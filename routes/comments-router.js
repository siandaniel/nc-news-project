const commentsRouter = require('express').Router();
const { deleteComment } = require('../app/controllers.js');

commentsRouter
    .route('/:comment_id')
    .delete(deleteComment);

module.exports = commentsRouter;