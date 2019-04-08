const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    username: String,
    commentBody: String
});

const Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;