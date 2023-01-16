const db = require('../db/connection.js');
const format = require('pg-format');

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    });
};

const fetchArticles = () => {
    return db.query(`SELECT * FROM articles`).then((result) => {
        return result.rows;
    });
};

module.exports = { fetchTopics, fetchArticles };