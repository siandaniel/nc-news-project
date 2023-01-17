const express = require('express');
const { getTopics, getArticles, getComments } = require('./controllers.js');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);



app.get('/api/articles/:article_id/comments', getComments);

app.get(`*`, (request, response) => {
    response.status(404).send("Invalid path provided - please try again")
});

module.exports = app;