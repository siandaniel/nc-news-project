const usersRouter = require('express').Router();
const { getUsers } = require('../app/controllers.js');

usersRouter.get('/', getUsers);

module.exports = usersRouter;