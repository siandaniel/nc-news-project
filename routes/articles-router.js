const { getArticles, getArticleById, getComments, updateArticle, postComment } = require('../app/controllers.js');

const articlesRouter = require('express').Router();

articlesRouter
    .route('/')
    .get(getArticles);

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(updateArticle);

articlesRouter
    .route('/:article_id/comments')
    .get(getComments)
    .post(postComment)

module.exports = articlesRouter;