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
    return fetchArticleById(article_id)
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
            return db.query(`SELECT votes FROM articles WHERE article_id = $1`, [article_id])
        })
        .then(({ rows }) => {
            let newVoteTotal = rows[0].votes + body.inc_votes;

            let sqlUpdateVotesQuery = `UPDATE articles
                                       SET votes = $1
                                       WHERE article_id = $2
                                       RETURNING *`

            return db.query(sqlUpdateVotesQuery, [newVoteTotal, article_id])
        })
        .then(({ rows }) => {
            return rows[0];
        });
};

module.exports = { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsById, addComment, updateVotes };
