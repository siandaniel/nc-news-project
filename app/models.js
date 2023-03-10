const db = require('../db/connection.js');
const format = require('pg-format');

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    });
};

const fetchArticles = (topic, sort_by = 'created_at', order = 'desc') => {
    return fetchTopics()
        .then((topics) => {
            const topicNames = topics.map((topic) => {
                return topic.slug;
            })
            const queriesArr = [];
            let sqlFetchArticlesQuery = `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
                                FROM articles
                                LEFT JOIN comments ON articles.article_id = comments.article_id`

            if (topic !== undefined) {
                if (!topicNames.includes(topic.toLowerCase())) {
                    return Promise.reject({ status: 400, msg: "Bad request" })
                }
                else {
                    sqlFetchArticlesQuery += ` WHERE articles.topic = $1`
                    queriesArr.push(topic)
                }
            }

            if (!['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url', 'comment_count'].includes(sort_by.toLowerCase()) ||
                !['asc', 'desc'].includes(order.toLowerCase())) {
                return Promise.reject({ status: 400, msg: "Bad request" })
            }

            sqlFetchArticlesQuery += ` GROUP BY articles.article_id
                            ORDER BY ${sort_by === 'comment_count' ? 'comment_count' : `articles.${sort_by}`} ${order}`


            return db.query(sqlFetchArticlesQuery, queriesArr).then((result) => {
                return result.rows;
            })
        })
};


const fetchArticleById = (article_id) => {

    let sqlFetchArticleByIdQuery = `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
                                    FROM articles
                                    LEFT JOIN comments ON articles.article_id = comments.article_id
                                    WHERE articles.article_id = $1
                                    GROUP BY articles.article_id
                                    `

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
    return fetchArticleById(article_id)
        .then(() => {
            return fetchUserByUsername(comment.username)
        })
        .then(() => {
            const formattedComment = [[comment.body, article_id, comment.username]]

            let sqlAddCommentString = format(`INSERT INTO comments
                                    (body, article_id, author)
                                    VALUES
                                    %L
                                    RETURNING *`, formattedComment)

            return db.query(sqlAddCommentString)
        })
        .then(({ rows }) => {
            return rows[0];
        });
};


const updateVotes = (body, article_id) => {
    return fetchArticleById(article_id)
        .then(() => {
            if (!body.inc_votes || Object.keys(body).length === 0) {
                return Promise.reject({ status: 400, msg: "Bad request" })
            }

            let sqlUpdateVotesQuery = `UPDATE articles
                                    SET votes = votes + $1
                                    WHERE article_id = $2
                                    RETURNING *`

            return db.query(sqlUpdateVotesQuery, [body.inc_votes, article_id])
        })
        .then(({ rows }) => {
            return rows[0];
        });
};

const fetchUsers = () => {
    return db.query(`SELECT * FROM users`).then((result) => {
        return result.rows;
    });
};

const deleteCommentById = (comment_id) => {
    const sqlDeleteCommentQuery = `DELETE FROM comments
                                   WHERE comment_id = $1
                                   RETURNING *;`

    return db.query(sqlDeleteCommentQuery, [comment_id]).then(({ rows, rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Not found" })
        }
        else {
            return rows[0];
        }
    })
};

const fetchUserByUsername = (username) => {
    if (/^\d+$/.test(username) === true) {
        return Promise.reject({ status: 400, msg: "Bad request - invalid data type" })
    }

    let sqlFetchUserQuery = `SELECT * FROM users
                            WHERE username = $1
                            `

    return db.query(sqlFetchUserQuery, [username]).then(({ rows, rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Not found - no user of this username in database" })
        }
        else {
            return rows[0];
        }
    });
};

const updateCommentVotes = (body, comment_id) => {
    if (!body.inc_votes || Object.keys(body).length === 0) {
        return Promise.reject({ status: 400, msg: "Bad request - no inc_votes property found" })
    }

    let sqlUpdateVotesQuery = `UPDATE comments
                                SET votes = votes + $1
                                WHERE comment_id = $2
                                RETURNING *`

    return db.query(sqlUpdateVotesQuery, [body.inc_votes, comment_id])
        .then(({ rows, rowCount }) => {
            if (rowCount === 0) {
                return Promise.reject({ status: 404, msg: "Not found - no comment of this ID in database" })
            }
            return rows[0];
        });
};

const addArticle = (article) => {

    if (!article.author || !article.title || !article.body || !article.topic || !article.article_img_url) {
        return Promise.reject({ status: 400, msg: "Bad request - expected body key missing" })
    }

    return fetchUserByUsername(article.author)
        .then(() => {
            const formattedArticle = [[article.title, article.topic, article.author, article.body, article.article_img_url]]

            let sqlAddArticleString = format(`INSERT INTO articles
                                (title, topic, author, body, article_img_url)
                                VALUES
                                %L
                                RETURNING *`, formattedArticle)

            return db.query(sqlAddArticleString)
        })
        .then(({ rows }) => {
            const newArticle = rows[0];
            return fetchArticleById(newArticle.article_id)
        });
};

module.exports = { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsById, addComment, updateVotes, fetchUsers, deleteCommentById, fetchUserByUsername, updateCommentVotes, addArticle };

// let sqlFetchArticleByIdQuery = `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
// FROM articles
// LEFT JOIN comments ON articles.article_id = comments.article_id
// WHERE articles.article_id = $1
// GROUP BY articles.article_id
// `