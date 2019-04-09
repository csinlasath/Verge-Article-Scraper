const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    username: String,
    commentBody: String,
    articleId: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;