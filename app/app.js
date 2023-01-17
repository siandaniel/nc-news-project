const express = require('express');
const { getTopics, getArticles, getArticleById } = require('./controllers.js');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.use((request, response, next) => {
    response.status(404).send({ msg: 'Path not found - please try again' })
})

module.exports = app;