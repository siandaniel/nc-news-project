const express = require('express');
const { getTopics, getArticleById } = require('./controllers.js');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get(`*`, (request, response) => {
    response.status(404).send("Invalid path provided - please try again")
});

module.exports = app;