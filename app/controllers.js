const { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsById, addComment, updateVotes, fetchUsers, deleteCommentById, fetchUserByUsername, updateCommentVotes, addArticle } = require('./models.js')
const endpoints = require('../endpoints.json');

const getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({ topics });
    })
};

const getArticles = (request, response, next) => {
    const { topic, sort_by, order } = request.query

    fetchArticles(topic, sort_by, order).then((articles) => {
        response.status(200).send({ articles });
    })
        .catch((error) => {
            next(error)
        });
};

const getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    fetchArticleById(article_id).then((article) => {
        response.status(200).send({ requestedArticle: article });
    })
        .catch((error) => {
            next(error)
        });
};

const getComments = (request, response, next) => {
    const { article_id } = request.params;

    fetchArticleById(article_id)
        .then(() => {
            return fetchCommentsById(article_id)
        })
        .then((comments) => {
            response.status(200).send({ comments })
        })
        .catch((error) => {
            next(error)
        })
};

const postComment = (request, response, next) => {
    const { body } = request;
    const { article_id } = request.params;

    if (Object.keys(body).length > 0) {
        addComment(body, article_id).then((comment) => {
            response.status(201).send({ commentPosted: comment })
        })
            .catch((error) => {
                next(error)
            })
    }
    else {
        response.status(204).send()
    }
};

const updateArticle = (request, response, next) => {
    const { body } = request;
    const { article_id } = request.params;

    updateVotes(body, article_id).then((article) => {
        response.status(200).send({ updatedArticle: article });
    })
        .catch((error) => {
            next(error)
        });
};

const getUsers = (request, response, next) => {
    fetchUsers().then((users) => {
        response.status(200).send({ users });
    });
};

const deleteComment = (request, response, next) => {
    const { comment_id } = request.params;
    deleteCommentById(comment_id).then(() => {
        response.status(204).send();
    })
        .catch((error) => {
            next(error)
        })
};

const getEndpoints = (request, response, next) => {
    response.status(200).send({ endpoints: endpoints });
};

const getUserByUsername = (request, response, next) => {
    const { username } = request.params;
    fetchUserByUsername(username).then((user) => {
        response.status(200).send({ user });
    })
        .catch((error) => {
            next(error)
        })
}

const addVoteToComment = (request, response, next) => {
    const { body } = request;
    const { comment_id } = request.params;

    updateCommentVotes(body, comment_id).then((comment) => {
        response.status(200).send({ updatedComment: comment });
    })
    .catch((error) => {
        next(error)
    });
};

const postArticle = (request, response, next) => {
    const { body } = request;

    if (Object.keys(body).length > 0) {
        addArticle(body).then((article) => {
            response.status(201).send({ articlePosted: article })
        })
        .catch((error) => {
            next(error)
        })
    }
    else {
        response.status(204).send()
    }
};

module.exports = { getTopics, getArticles, getArticleById, getComments, postComment, updateArticle, getUsers, deleteComment, getEndpoints, getUserByUsername, addVoteToComment, postArticle };
