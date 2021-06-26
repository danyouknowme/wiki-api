//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////All Articles///////////////////////////////////

app.route("/articles")


    .get((req, res) => {
        Article.find((err, articles) => {
            if (articles) {
                const jsonArticles = JSON.stringify(articles);
                res.send(jsonArticles);
            } else {
                res.send("No articles currently in wikiDB.");
            }
        });
    })

    .post((req, res) => {
        const newArticle = Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {

        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted all the articles in wikiDB.");
            } else {
                res.send(err);
            }
        });

    });


/////////////////////////Individual Articles///////////////////////////////////

app.route("/articles/:articleTitle")

    .get((req, res) => {
        const articleTitle = req.params.articleTitle;
        Article.findOne(
            {title: articleTitle},
            (err, article) => {
                if (article) {
                    const jsonArticle = JSON.stringify(article);
                    res.send(jsonArticle);
                } else {
                    res.send("No article with that title found.");
                }
            });
        })

    .patch((req, res) => {
        const articleTitle = req.params.articleTitle;
        Article.update(
            {title: articleTitle},
            {content: req.body.newContent},
            (err) => {
                if (!err) {
                    res.send("Successfully updated selected article.");
                } else {
                    res.send(err);
                }
            });
        })

    .put((req, res) => {

        const articleTitle = req.params.articleTitle;

        Article.update(
            {title: articleTitle},
            {content: req.body.newContent},
            {overwrite: true},
            (err) => {
                if (!err) {
                    res.send("Successfully updated the content of the selected article.");
                } else {
                    res.send(err);
                }
            });
        })


    .delete((req, res) => {
        const articleTitle = req.params.articleTitle;
        LostPet.findOneAndDelete(
            {title: articleTitle},
            (err) => {
                if (!err) {
                    res.send("Successfully deleted selected article.");
                } else {
                    res.send(err);
                }
            });
        });


app.listen(3000, () => {
    console.log("Server started on port 3000");
});
