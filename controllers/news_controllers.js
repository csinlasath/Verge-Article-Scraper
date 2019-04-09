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
                result.bookmarked = false;

                if (result.headline !== "Careers") {
                    db.Article.create(result).then((dbArticle) => {
                        console.log(dbArticle)
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            });
        });
    });
    db.Article.find({}).then((dbNews) => {
        res.json(dbNews)
    }).catch((err) => {
        console.error(err);
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
    db.Comment.create(req.body).then(function(dbComments) {
        console.log(dbComments);
        return db.Article.findOneAndUpdate({ _id: req.params.id}, {$push: { comments: dbComments._id} }, { new: true });
    }).then(function(dbNews) {
      res.json(dbNews);  
    }).catch((err) => {
        console.error(err);
    });
});

router.get("/news/bookmark/:id", (req, res) => {
    db.Article.findOneAndUpdate({_id: req.params.id}, { bookmarked: true }).then((dbNews) => {
        console.log(dbNews);
        res.json(dbNews);
    }).catch((err) => {
        console.error(err)
    });
});

router.get("/news/removebookmark/:id", (req, res) => {
    db.Article.findOneAndUpdate({_id: req.params.id}, { bookmarked: false }).then((dbNews) => {
        console.log(dbNews);
        res.json(dbNews);
    }).catch((err) => {
        console.error(err)
    });
});

router.get("/news/remove/all", (req, res) => {
    db.Article.remove({}).then((dbNews) => {
        console.log(dbNews);
        db.Comment.remove({}).then((dbComments) => {
            console.log(dbComments);
            res.redirect("/");
        });
    }).catch((err) => {
        console.error(err);
    });
});

module.exports = router;