const express = require('express');
const { getTopics, getArticles, getArticleById, getComments, postComment, updateArticle } = require('./controllers.js');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getComments);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', updateArticle);

app.use((request, response, next) => {
    response.status(404).send({ msg: "Not found - this path does not exist" })
});

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg })
    }
    else {
        next(error)
    }
});

app.use((error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({ msg: "Bad request - invalid data type for article ID" })
    }
    else {
        next(error)
    }
});

app.use((error, request, response, next) => {
    console.log(error, "<<<500 ERROR") 
    response.status(500).send({ msg: "Internal server error" })
});


module.exports = app;