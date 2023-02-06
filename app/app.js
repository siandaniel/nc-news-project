const express = require('express');
const apiRouter = require('../routes/api-router.js');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);
app.use((request, response, next) => {
    response.status(404).send({ msg: "Not found - this path does not exist" })
});

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg })
    }
    else {
        next(error)
    }
});

app.use((error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({ msg: "Bad request - invalid data type" })
    }
    else {
        next(error)
    }
});

app.use((error, request, response, next) => {
    console.log(error, "<<<500 ERROR") 
    response.status(500).send({ msg: "Internal server error" })
});


module.exports = app;