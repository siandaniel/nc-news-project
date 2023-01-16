const express = require('express');
const { getTopics } = require('./controllers.js');

const app = express();

app.get('/api/topics', getTopics);

app.get(`*`, (request, response) => {
    response.status(404).send("Invalid path provided - please try again")
});

module.exports = app;