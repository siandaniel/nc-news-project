const usersRouter = require('express').Router();
const { getUsers, getUserByUsername } = require('../app/controllers.js');

usersRouter
    .route('/')
    .get(getUsers);

usersRouter
    .route('/:username')
    .get(getUserByUsername);

module.exports = usersRouter;