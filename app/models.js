const db = require('../db/connection.js');
const format = require('pg-format');

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    });
};

const fetchArticles = () => {
    let sqlFetchArticlesQuery = `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
                                FROM articles
                                LEFT JOIN comments ON articles.article_id = comments.article_id
                                GROUP BY articles.article_id
                                ORDER BY articles.created_at DESC`
 
    return db.query(sqlFetchArticlesQuery).then((result) => {
        return result.rows;
    });
};

module.exports = { fetchTopics, fetchArticles };