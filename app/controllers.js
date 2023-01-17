const { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsById } = require('./models.js')

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
    })
    .catch((error) => {
        next(error)
    });
};

const getComments = (request, response, next) => {
    const { article_id } = request.params;

    fetchArticleById(article_id)
    .then(() => {
        return fetchCommentsById(article_id)
    })
    .then((comments) => {
        response.status(200).send({ comments: comments })
    })
    .catch((error) => {
        next(error)
    })
};

module.exports = { getTopics, getArticles, getArticleById, getComments };
