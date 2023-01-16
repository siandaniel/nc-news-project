const { fetchTopics } = require('./models.js')

const getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({ topics: topics});       
    })
};

const getArticleById = (request, response, next) => {
    response.status(200).send();
}

module.exports = { getTopics, getArticleById };