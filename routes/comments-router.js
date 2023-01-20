const commentsRouter = require('express').Router();
const { deleteComment } = require('../app/controllers.js');

commentsRouter.delete('/:comment_id', deleteComment);

module.exports = commentsRouter;