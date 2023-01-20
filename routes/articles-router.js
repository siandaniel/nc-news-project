const { getArticles, getArticleById, getComments } = require('../app/controllers.js');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);

articlesRouter.get('/:article_id', getArticleById);
  
articlesRouter.get('/:article_id/comments', getComments);

module.exports = articlesRouter;