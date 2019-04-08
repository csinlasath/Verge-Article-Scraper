const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    byline: {
        type: String,
        required: true
    },
    linkURL: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }
});

const Article = mongoose.model("News", NewsSchema);

module.exports = Article;