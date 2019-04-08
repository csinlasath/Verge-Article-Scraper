/*
Leave comments for articles
Users can delete comments with their articles
All comments should be visible to every user
*/
const express = require("express");
const exphbs = require("express-handlebars");

const PORT = process.env.PORT || 3000;
const routes = require("./controllers/news_controllers");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(routes);

app.listen(PORT, () => {
    console.log(`The server has started and is listening on ${PORT}`);
});