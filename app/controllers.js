const { fetchTopics, fetchArticles, fetchArticleById } = require('./models.js')

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

const getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    fetchArticleById(article_id).then((article) => {
        response.status(200).send({ requestedArticle: article });
    });
};

module.exports = { getTopics, getArticles, getArticleById };
