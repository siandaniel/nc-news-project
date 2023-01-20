const topicsRouter = require('express').Router();
const { getTopics } = require('../app/controllers.js');

topicsRouter.get('/', getTopics);

module.exports = topicsRouter;