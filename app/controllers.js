const { fetchTopics, fetchArticles, fetchCommentsById } = require('./models.js')

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








const getComments = (request, response, next) => {
    const { article_id } = request.params;
    fetchCommentsById(article_id).then((comments) => {
        response.status(200).send({ comments: comments })
    });
};

module.exports = { getTopics, getArticles, getComments };
