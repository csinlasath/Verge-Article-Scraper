const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();
const mongoose = require("mongoose");
const MONOGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoVerge";
const db = require("../models");
mongoose.connect(MONOGODB_URI, { useNewUrlParser: true});

router.get("/scrape", (req, res) => {
    var result = {};
    axios.get("https://www.theverge.com").then(function (response) {
        let $ = cheerio.load(response.data);
        $(".c-entry-box--compact__body .c-entry-box--compact__title").each(function (i, element) {
            let articleURL = $(this).children("a").attr("href");

            axios.get(articleURL).then(function (summaryResponse) {
                let $ = cheerio.load(summaryResponse.data);
                result.headline = $(".l-segment .c-entry-hero").children(".c-entry-hero__header-wrap").children(".c-page-title").text();
                result.byline = $(".l-segment .c-entry-hero").children(".c-byline").children(".c-byline__item").first().text().trim().split("@", 1);
                result.linkURL = articleURL;
                result.summary = $(".l-segment .c-entry-hero").children(".c-entry-summary").text();
                result.image = $(".e-image__image .c-picture").children("img").attr("src");

                if (result.headline !== "Careers") {
                    console.log(`--------------------------------`);
                    db.Article.create(result).then((dbArticle) => {
                        console.log(dbArticle)
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            });
        });
    }).then(() => {
        res.redirect("/");
    });
});
router.get("/news/:id", (req, res) => {
    db.Article.findOne({_id: req.params.id}).populate("comments").then((dbNews) => {
        res.json(dbNews);
    }).catch((err) => {
        res.json(err);
    });
});

router.get("/", (req, res) => {
    db.Article.find({}).then((dbNews) => {
        var handlebarsObj = {
            news: dbNews
        };
        res.render("index", handlebarsObj);
    }).catch((err) => {
        console.error(err);
    });
});

router.post("/news/:id", (req, res) => {
    db.Comment.create(req.body).then((dbComments) => {
        console.log(req.body);
        console.log(dbComments);
        return db.Article.findOneAndUpdate({ _id: req.params.id}, { comment: dbComments._id}, { new: true});
    }).then((dbNews) => {
      res.json(dbNews);  
    }).catch((err) => {
        console.error(err);
    });
});

module.exports = router;