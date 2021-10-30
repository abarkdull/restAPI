
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// connect to local mongo server (database: wikiDB)
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema( {
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);


app.route("/articles")

// get all articles
.get( function(req, res) {
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

// create a new article
.post( function(req, res) {

    const newTitle = req.body.title;
    const newContent = req.body.content;

    const article = new Article( {
        title: newTitle,
        content: newContent
    });

    article.save( function(err) {
        if (!err) {
            res.send({ title: newTitle, content: newContent});
        } else {
            res.send(err);
        }
    });
})

// delete all articles
.delete( function(req, res) {
    Article.deleteMany( function(err) {
        if (!err) {
            res.send("Succesfully deleted all articles")
        } else {
            res.send(err);
        }
    })
});


// query specific article
app.route("/articles/:articleName")

// GET a specific article
.get( function(req, res) {
    const articleName = req.params.articleName;

    Article.findOne( {title: articleName}, function(err, foundArticle) {
        res.send(foundArticle);
    })
})

.put( function(req, res) {
    Article.findOneAndUpdate(
        {title: req.params.articleName},
        {title: req.body.title,
        content: req.body.content},
        {overwrite: true},
        function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("succesfully updated " + req.params.articleName);
            }
        }
    );
})

.patch( function(req, res) {
    Article.findOneAndUpdate(
        {title: req.params.articleName},
        {$set: req.body},
        function(err) {
            if (!err) {
                res.send("succesfull updated articles");
            } else {
                res.send(err);
            }
        }
    )
})

.delete( function(req, res) {
    Article.deleteOne({title: req.params.articleName}, function(err) {
        if (!err) {
            res.send(req.params.articleName + " was succesfully deleted.");
        } else {
            res.send(err);
        }
    })
})


// start server locally on port 3000
app.listen(3000, function() {
    console.log("Server started on port 3000 at http://localhost:3000");
})