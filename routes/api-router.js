const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topics-router.js');
const usersRouter = require('../routes/users-router.js');
const articlesRouter = require('../routes/articles-router.js');
const { getEndpoints } = require('../app/controllers.js');

apiRouter.get('/', getEndpoints);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;