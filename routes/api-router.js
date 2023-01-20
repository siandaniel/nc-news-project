const apiRouter = require('express').Router();
const { topicsRouter, usersRouter, articlesRouter, commentsRouter } = require('../routes')
const { getEndpoints } = require('../app/controllers.js');

apiRouter.get('/', getEndpoints);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;