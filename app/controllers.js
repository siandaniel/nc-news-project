const { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsById } = require('./models.js')

const getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({ topics});       
    })
};

const getArticles = (request, response, next) => {
    fetchArticles().then((articles) => {
        response.status(200).send({ articles });       
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
        response.status(200).send({ comments })
    })
    .catch((error) => {
        next(error)
    })
};

const updateArticle = (request, response, next) => {
    const { body } = request;
    const { article_id } = request.params;

    if (Object.keys(body).length > 0) {
            response.status(200).send({ updatedArticle: {} });
    }
    else {
        response.status(204).send();
    }
};

module.exports = { getTopics, getArticles, getArticleById, getComments, updateArticle };
