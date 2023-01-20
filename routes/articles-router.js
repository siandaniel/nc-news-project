const articlesRouter = require('express').Router();
const { getArticles, getArticleById, getComments, updateArticle, postComment, postArticle } = require('../app/controllers.js');

articlesRouter
    .route('/')
    .get(getArticles)
    .post(postArticle);

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(updateArticle);

articlesRouter
    .route('/:article_id/comments')
    .get(getComments)
    .post(postComment)

module.exports = articlesRouter;