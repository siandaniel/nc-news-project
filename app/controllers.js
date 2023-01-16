const { fetchTopics, fetchArticles } = require('./models.js')

const getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({ topics: topics});       
    })
};

const getArticles = (request, response, next) => {
        fetchArticles().then((articles) => {
            response.status(200).send({ articles: articles });       
        });
};

module.exports = { getTopics, getArticles };