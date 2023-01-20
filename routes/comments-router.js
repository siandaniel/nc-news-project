const commentsRouter = require('express').Router();
const { deleteComment, addVoteToComment } = require('../app/controllers.js');

commentsRouter
    .route('/:comment_id')
    .delete(deleteComment);

commentsRouter
    .route('/:comment_id')
    .patch(addVoteToComment);

module.exports = commentsRouter;