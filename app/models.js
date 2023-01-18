const db = require('../db/connection.js');
const format = require('pg-format');

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    });
};

const fetchArticles = (topic, sort_by='created_at') => {
    const queriesArr = [];
    let sqlFetchArticlesQuery = `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
                                FROM articles
                                LEFT JOIN comments ON articles.article_id = comments.article_id`
    
    if (topic !== undefined) {
        if (!['mitch', 'cats', 'paper'].includes(topic.toLowerCase())) {
            return Promise.reject({status: 400, msg: "Bad request - invalid topic name in query"})
        }
        else {
        sqlFetchArticlesQuery+= ` WHERE articles.topic = $1`
        queriesArr.push(topic)
        }
    }

    if (!['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url'].includes(sort_by.toLowerCase())) {
        return Promise.reject({status: 400, msg: "Bad request - invalid sort_by criteria"})
    }

    sqlFetchArticlesQuery+= ` GROUP BY articles.article_id
                            ORDER BY articles.${sort_by} DESC`
    

    return db.query(sqlFetchArticlesQuery, queriesArr).then((result) => {
        return result.rows;
    });
};


const fetchArticleById = (article_id) => {
    let sqlFetchArticleByIdQuery = `SELECT * FROM articles
                                    WHERE article_id = $1`

    return db.query(sqlFetchArticleByIdQuery, [article_id]).then(({ rows, rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Not found - no article of this ID in database" })
        }
        else {
            return rows[0];
        }
    });
}

const fetchCommentsById = (article_id) => {
    let sqlFetchCommentsQuery = `SELECT * FROM comments
                                WHERE article_id = $1
                                ORDER BY created_at DESC`

    return db.query(sqlFetchCommentsQuery, [article_id]).then(({ rows }) => {
        return rows;
    });
};

const addComment = (comment, article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows, rowCount }) => {
            if (rowCount === 0) {
                return Promise.reject({ status: 404, msg: "Not found - no article of this ID in database" })
            }
            else {
                const correctArticle = rows[0]
                const formattedComment = [[comment.body, article_id, correctArticle.author]]

                let sqlAddCommentString = format(`INSERT INTO comments
                                    (body, article_id, author)
                                    VALUES
                                    %L
                                    RETURNING *`, formattedComment)

                return db.query(sqlAddCommentString)
                    .then(({ rows }) => {
                        return rows[0];
                    });
            }
        });
}

module.exports = { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsById, addComment };
