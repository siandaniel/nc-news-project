const request = require('supertest');
const app = require('../app/app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});

describe("/non-existent-or-misspelt-endpoint", () => {
    describe("ALL REQUESTS", () => {
        test("Returns 'Status: 404' and custom error message if endpoint is not found", () => {
            return request(app)
            .get('/invalid-or-misspelt-path')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - this path does not exist");
            });
        });
    });
});

describe("/api", () => {
    describe("GET", () => {
        test("Returns 'Status: 200' with a JSON endpoints object", () => {
            return request(app).get('/api').expect(200)
            .then(({ body }) => {
                const endpoints = body.endpoints;
                expect(typeof endpoints).toBe("object");
                expect(Array.isArray(endpoints)).toBe(false);
            });
        });
        test("Endpoints object contains keys for each endpoint in API", () => {
            return request(app).get('/api').expect(200)
            .then(({ body }) => {
                const endpoints = body.endpoints;
                expect(endpoints).toHaveProperty("GET /api");
                expect(endpoints).toHaveProperty("GET /api/topics");
                expect(endpoints).toHaveProperty("GET /api/users");
                expect(endpoints).toHaveProperty("GET /api/articles");
                expect(endpoints).toHaveProperty("GET /api/articles/:article_id");
                expect(endpoints).toHaveProperty("PATCH /api/articles/:article_id");
                expect(endpoints).toHaveProperty("GET /api/articles/:article_id/comments");
                expect(endpoints).toHaveProperty("POST /api/articles/:article_id/comments");
                expect(endpoints).toHaveProperty("DELETE /api/comments/:comment_id");
            });
        });
    });
});


describe("/api/topics", () => {
    describe("GET", () => {
        test("Returns 'Status: 200' if no error in path", () => {
            return request(app).get('/api/topics').expect(200);
        });
        test("Returns topic objects contained inside an array", () => {
            return request(app).get('/api/topics').expect(200)
            .then(({ body }) => {
                const topics = body.topics;
                expect(Array.isArray(topics)).toBe(true);
            });
        });
        test("Each topic object contains the keys 'slug' and 'description'", () => {
            return request(app).get('/api/topics').expect(200)
            .then(({ body }) => {
                const topics = body.topics;
                topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    )
                });
            });
        });
        test("Correct values are added to the keys in the topic objects", () => {
            return request(app).get('/api/topics').expect(200)
            .then(({ body }) => {
                const topics = body.topics;
                expect(topics[0].description).toBe("The man, the Mitch, the legend");
                expect(topics[0].slug).toBe("mitch");
                expect(topics[1].description).toBe("Not dogs");
                expect(topics[1].slug).toBe("cats");
                expect(topics[2].description).toBe("what books are made of");
                expect(topics[2].slug).toBe("paper");
            });
        });
    });
});

describe("/api/articles", () => {
    describe("GET", () => {
        test("Returns 'Status: 200' if no error in path", () => {
            return request(app).get('/api/articles').expect(200);
        });
        test("Returns article objects contained inside an array", () => {
            return request(app).get('/api/articles').expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(Array.isArray(articles)).toBe(true);
            });
        });
        test("Returns ALL article objects", () => {
            return request(app).get('/api/articles').expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(12);
            });
        });
        test("Each article object contains the correct keys", () => {
            return request(app).get('/api/articles').expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(String)
                        })
                    )
                });
            });
        });
        test("Article objects are sorted by date in descending order as default", () => {
            return request(app).get('/api/articles').expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('created_at', { descending: true })
            });
        });
        test("Correct values are inputted to article object keys", () => {
            return request(app).get('/api/articles').expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(articles[0]).toHaveProperty("author", 'icellusedkars');
                expect(articles[0]).toHaveProperty("title", 'Eight pug gifs that remind me of mitch');
                expect(articles[0]).toHaveProperty("article_id", 3);
                expect(articles[0]).toHaveProperty("topic", 'mitch');
                expect(articles[0]).toHaveProperty("created_at", '2020-11-03T09:12:00.000Z');
                expect(articles[0]).toHaveProperty("votes", 0);
                expect(articles[0]).toHaveProperty("article_img_url", 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
                expect(articles[0]).toHaveProperty("comment_count", '2');
            });
        });
    });
    describe("GET: Queries", () => {
        test("Returns 'Status: 200' with ALL articles if no query specified", () => {
            return request(app).get('/api/articles?').expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(12);
            });
        });
        test("Topic query returns 'Status: 200' with correct number of articles for a given topic", () => {
            return request(app).get('/api/articles?topic=cats').expect(200)
            .then(({ body }) => {
                const catArticles = body.articles;
                expect(catArticles.length).toBe(1);
            })
            .then(() => {
                return request(app).get('/api/articles?topic=mitch').expect(200)
            })
            .then(({ body }) => {
                const mitchArticles = body.articles;
                expect(mitchArticles.length).toBe(11);
            })
        });
        test("Topic query returns 'Status: 200' with an empty array if valid topic but no articles", () => {
            return request(app).get('/api/articles?topic=paper').expect(200)
            .then(({ body }) => {
                expect(body.articles).toEqual([]);
            });
        });
        test("Topic query returns 'Status: 400' with 'Bad Request' error message if provided an invalid topic name", () => {
            return request(app).get('/api/articles?topic=123').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
        });
        test("Sort_by query returns 'Status: 200' with articles sorted by the specified column", () => {
            return request(app).get('/api/articles?sort_by=author').expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('author', { descending: true })
            });
        });
        test("Sort_by query returns 'Status: 400' with 'Bad Request' error message if provided with invalid sort_by criteria", () => {
            return request(app).get('/api/articles?sort_by=hello').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
        });
        test("Order query returns 'Status: 200' with articles sorted in the specified order", () => {
            return request(app).get('/api/articles?order=asc').expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('created_at', { ascending: true })
            });
        });
        test("Order query returns 'Status: 400' with 'Bad Request' error message if provided with invalid order criteria", () => {
            return request(app).get('/api/articles?order=hello').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
        });
        test("Sort_by and order default to 'date' and 'desc' respectively", () => {
            return request(app).get('/api/articles').expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('created_at', { descending: true })
            });
        });
    });
    describe("POST", () => {
        test("Returns 'Status: 204' with empty object if sent empty request body", () => {
            return request(app).post('/api/articles')
            .send()
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({})
            });
        });
        test("Returns 'Status: 201' with the article object that has been added", () => {
            return request(app).post('/api/articles')
            .send({
                author: "rogersop",
                title: "Famous cats from film and TV",
                body: "Lots of text about famous cats...",
                topic: "cats",
                article_img_url: "https://static.wikia.nocookie.net/topcat/images/5/50/Topcat002-1-.gif/revision/latest/scale-to-width-down/300?cb=20110424163028"
              })
            .expect(201)
            .then(({ body }) => {
                articlePosted = body.articlePosted
                expect(articlePosted).toHaveProperty("article_id", 13);
                expect(articlePosted).toHaveProperty("author", "rogersop");
                expect(articlePosted).toHaveProperty("title", "Famous cats from film and TV");
                expect(articlePosted).toHaveProperty("body", "Lots of text about famous cats...");
                expect(articlePosted).toHaveProperty("topic", "cats");
                expect(articlePosted).toHaveProperty("article_img_url", "https://static.wikia.nocookie.net/topcat/images/5/50/Topcat002-1-.gif/revision/latest/scale-to-width-down/300?cb=20110424163028");
                expect(articlePosted).toHaveProperty("votes", 0);
                expect(articlePosted).toHaveProperty("created_at");
                expect(articlePosted).toHaveProperty("comment_count", "0");
            });
        });
        test("Articles database is updated with the new article", () => {
            return request(app).post('/api/articles')
            .send({
                author: "rogersop",
                title: "Famous cats from film and TV",
                body: "Lots of text about famous cats...",
                topic: "cats",
                article_img_url: "https://static.wikia.nocookie.net/topcat/images/5/50/Topcat002-1-.gif/revision/latest/scale-to-width-down/300?cb=20110424163028"
              })
            .expect(201)
            .then(() => {
                return db.query('SELECT * FROM articles;')
            })
            .then(({rows}) => {
                expect(rows.length).toBe(13)
                expect(rows[rows.length-1].article_id).toBe(13);
                expect(rows[rows.length-1].title).toBe("Famous cats from film and TV");
            })
        });
        test("Returns 'Status: 404' and relevant error message if username is not in database", () => {
            return request(app).post('/api/articles')
            .send({
                author: "Sian",
                title: "Famous cats from film and TV",
                body: "Lots of text about famous cats...",
                topic: "cats",
                article_img_url: "https://static.wikia.nocookie.net/topcat/images/5/50/Topcat002-1-.gif/revision/latest/scale-to-width-down/300?cb=20110424163028"
              })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - no user of this username in database");
            });
        });
        test("Returns 'Status: 400' and 'Bad request' error message if any expected keys missing from request body", () => {
            return request(app).post('/api/articles')
            .send({
                author: "rogersop",
                body: "Lots of text about famous cats...",
                topic: "cats",
                article_img_url: "https://static.wikia.nocookie.net/topcat/images/5/50/Topcat002-1-.gif/revision/latest/scale-to-width-down/300?cb=20110424163028"
              })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - expected body key missing");
            });
        });
        test("Returns 'Status: 400' and 'Bad request' error message if any body values of incorrect data type", () => {
            return request(app).post('/api/articles')
            .send({
                author: 123,
                title: "Famous cats from film and TV",
                body: "Lots of text about famous cats...",
                topic: "cats",
                article_img_url: "https://static.wikia.nocookie.net/topcat/images/5/50/Topcat002-1-.gif/revision/latest/scale-to-width-down/300?cb=20110424163028"
              })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type");
            });
        });
    });    
});

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        test("Returns 'Status: 200' with single article object if valid article ID", () => {
            return request(app).get('/api/articles/1').expect(200)
            .then(({ body }) => {
                const article = body.requestedArticle;
                expect(typeof article).toBe("object");
                expect(Array.isArray(article)).toBe(false);
            });
        });
        test("Returns correct article object containing the correct keys", () => {
            return request(app).get('/api/articles/1').expect(200)
            .then(({ body }) => {
                const article = body.requestedArticle;
                expect(article).toHaveProperty("author", expect.any(String));
                expect(article).toHaveProperty("title", expect.any(String));
                expect(article).toHaveProperty("article_id", 1);
                expect(article).toHaveProperty("body", expect.any(String));
                expect(article).toHaveProperty("topic", expect.any(String));
                expect(article).toHaveProperty("created_at", expect.any(String));
                expect(article).toHaveProperty("votes", expect.any(Number));
                expect(article).toHaveProperty("article_img_url", expect.any(String));
            });
        });
        test("Returns the correct article object for other valid article IDs", () => {
            return request(app).get('/api/articles/2').expect(200)
            .then(({ body }) => {
                const article = body.requestedArticle;
                expect(article).toHaveProperty("article_id", 2);
            });
        });
        test("Returned article contains 'comment_count' key with correct number of comments for this ID", () => {
            return request(app).get('/api/articles/1').expect(200)
            .then(({ body }) => {
                const article = body.requestedArticle;
                expect(article).toHaveProperty("comment_count", "11");
            });
        });
        test("'Comment_count' key is set to zero if article exists but has no comments", () => {
            return request(app).get('/api/articles/2').expect(200)
            .then(({ body }) => {
                const article = body.requestedArticle;
                expect(article).toHaveProperty("comment_count", "0");
            });
        });
        test("Returns 'Status: 400' and relevant error message if article ID is of incorrect data type", () => {
            return request(app).get('/api/articles/abc').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type");
            });
        });
        test("Returns 'Status: 404' and relevant error message if article ID does not exist in database", () => {
            return request(app).get('/api/articles/392').expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - no article of this ID in database");
            });
        });
    });
    describe("PATCH", () => {
        test("Returns 'Status: 400' with 'Bad request' error message if sent empty request body", () => {
            return request(app).patch('/api/articles/1')
            .send()
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            });
        });
        test("Returns 'Status: 200' with an article object", () => {
            return request(app).patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                expect(typeof body.updatedArticle).toBe("object");
                expect(Array.isArray(body.updatedArticle)).toBe(false)
            });
        });
        test("Returns correct article object for ID with expected keys", () => {
            return request(app).patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                const updatedArticle = body.updatedArticle;
                expect(updatedArticle).toHaveProperty("article_id", 1)
                expect(updatedArticle).toHaveProperty("title")
                expect(updatedArticle).toHaveProperty("topic")
                expect(updatedArticle).toHaveProperty("author")
                expect(updatedArticle).toHaveProperty("body")
                expect(updatedArticle).toHaveProperty("created_at")
                expect(updatedArticle).toHaveProperty("votes")
                expect(updatedArticle).toHaveProperty("article_img_url")
            });
        });
        test("Returns article object with 'votes' key updated by correct amount, including by negative numbers", () => {
            return request(app).patch('/api/articles/1')
            .send({ inc_votes: -20 })
            .expect(200)
            .then(({ body }) => {
                const updatedArticle = body.updatedArticle;
                expect(updatedArticle).toHaveProperty("article_id", 1)
                expect(updatedArticle).toHaveProperty("votes", 80)
            });
        });
        test("Returns 'Status: 400' and relevant error message if article ID is of incorrect data type", () => {
            return request(app).patch('/api/articles/abc')
            .send({ inc_votes: 2 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type");
            });
        });
        test("Returns 'Status: 404' and relevant error message if article ID does not exist in database", () => {
            return request(app).patch('/api/articles/392')
            .send({ inc_votes: 2 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - no article of this ID in database");
            });
        });
        test("Returns 'Status: 400' and 'Bad request' error message if no 'inc_votes' property on request body", () => {
            return request(app).patch('/api/articles/1')
            .send({ change_votes: 2 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
        });
        test("Returns 'Status: 400' and 'Bad request' error message if 'inc_votes' property is of incorrect data type", () => {
            return request(app).patch('/api/articles/1')
            .send({ inc_votes: "abc" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type");
            });
        });
    });
});

describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
        test("Returns 'Status: 200' with comment objects contained inside an array", () => {
            return request(app).get('/api/articles/1/comments').expect(200)
            .then(({ body }) => {
                const comments = body.comments;
                expect(Array.isArray(comments)).toBe(true);
            });
        });
        test("Returns correct number of comment objects for the article ID", () => {
            return request(app).get('/api/articles/1/comments').expect(200)
            .then(({ body }) => {
                const comments = body.comments;
                expect(comments.length).toBe(11);
            });
        });
        test("Each comment object contains the expected keys for that article ID", () => {
            return request(app).get('/api/articles/1/comments').expect(200)
            .then(({ body }) => {
                const comments = body.comments;
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            article_id: 1,
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String)
                        })
                    )
                });
            });
        });
        test("Comment objects are sorted with most recent comments first", () => {
            return request(app).get('/api/articles/1/comments').expect(200)
            .then(({ body }) => {
                const comments = body.comments;
                expect(comments[0].comment_id).toBe(5);
                expect(comments[1].comment_id).toBe(2);
                expect(comments[comments.length-2].comment_id).toBe(4);
                expect(comments[comments.length-1].comment_id).toBe(9);
            });
        });
        test("Correct values are added to the comment objects' keys", () => {
            return request(app).get('/api/articles/1/comments').expect(200)
            .then(({ body }) => {
                const comments = body.comments;
                expect(comments[0]).toEqual({
                    comment_id: 5,
                    body: "I hate streaming noses",
                    votes: 0,
                    author: "icellusedkars",
                    article_id: 1,
                    created_at: "2020-11-03T21:00:00.000Z",
                });
            });
        });
        test("Returns 'Status: 400' and relevant error message if article ID is of incorrect data type", () => {
            return request(app).get('/api/articles/abc/comments').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type");
            });
        });
        test("Returns 'Status: 404' and relevant error message if article ID does not exist in database", () => {
            return request(app).get('/api/articles/392/comments').expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - no article of this ID in database");
            });
        });
        test("Returns 'Status: 200' and empty array for existing article IDs with no comments, without invoking error handler", () => {
            return request(app).get('/api/articles/2/comments').expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);
            });
        })
    });

    describe("POST", () => {
        test("Returns 'Status: 204' with empty object if sent empty request body", () => {
            return request(app).post('/api/articles/1/comments')
            .send()
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({})
            });
        });
        test("Returns 'Status: 201' with the comment object that has been added", () => {
            return request(app).post('/api/articles/1/comments')
            .send({
                body: "Mitch is cool",
                username: "rogersop"
              })
            .expect(201)
            .then(({ body }) => {
                expect(body.commentPosted).toHaveProperty("article_id", 1);
                expect(body.commentPosted).toHaveProperty("author", "rogersop");
                expect(body.commentPosted).toHaveProperty("body", "Mitch is cool");
                expect(body.commentPosted).toHaveProperty("comment_id", 19);
                expect(body.commentPosted).toHaveProperty("created_at");
                expect(body.commentPosted).toHaveProperty("votes", 0);
            });
        });
        test("Comments database is updated with the new comment", () => {
            return request(app).post('/api/articles/1/comments')
            .send({
                body: "Mitch is cool",
                username: "rogersop"
              })
            .expect(201)
            .then(() => {
                return db.query('SELECT * FROM comments;')
            })
            .then(({rows}) => {
                expect(rows.length).toBe(19)
                expect(rows[rows.length-1].comment_id).toBe(19);
                expect(rows[rows.length-1].body).toBe("Mitch is cool");
            })
        });
        test("Returns 'Status: 400' and relevant error message if article ID is of incorrect data type", () => {
            return request(app).post('/api/articles/abc/comments')
            .send({
                body: "Mitch is cool",
                username: "rogersop"
              })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type");
            });
        });
        test("Returns 'Status: 404' and relevant error message if article ID does not exist in database", () => {
            return request(app).post('/api/articles/392/comments')
            .send({
                body: "Mitch is cool",
                username: "rogersop"
              })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - no article of this ID in database");
            });
        });
        test("Returns 'Status: 404' and relevant error message if username is not in database", () => {
            return request(app).post('/api/articles/1/comments')
            .send({
                body: "Mitch is cool",
                username: "Sian"
              })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - no user of this username in database");
            });
        });
    });
});

describe("/api/users", () => {
    describe("GET", () => {
        test("Returns 'Status: 200' with ALL user objects contained in an array", () => {
            return request(app).get('/api/users').expect(200)
            .then(({ body }) => {
                const users = body.users;
                expect(Array.isArray(users)).toBe(true);
                expect(users.length).toBe(4)
            });
        });
        test("Each user object contains the keys 'username', 'name' and 'avatar_url'", () => {
            return request(app).get('/api/users').expect(200)
            .then(({ body }) => {
                const users = body.users;
                users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)     
                        })
                    )
                });
            });
        });
    });
});

describe("api/users/:username", () => {
    describe("GET", () => {
        test("Returns 'Status: 200' with single user object if valid username", () => {
            return request(app).get('/api/users/lurker').expect(200)
            .then(({ body }) => {
                const user = body.user;
                expect(typeof user).toBe("object");
                expect(Array.isArray(user)).toBe(false);
            });
        });
        test("Returns correct user object containing the correct keys", () => {
            return request(app).get('/api/users/lurker').expect(200)
            .then(({ body }) => {
                const user = body.user;
                expect(user).toHaveProperty("username", "lurker");
                expect(user).toHaveProperty("avatar_url", expect.any(String));
                expect(user).toHaveProperty("name", expect.any(String));
            });
        });
        test("Returns 'Status: 400' and relevant error message if username is of incorrect data type", () => {
            return request(app).get('/api/users/976').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type");
            });
        });
        test("Returns 'Status: 404' and relevant error message if username does not exist in database", () => {
            return request(app).get('/api/users/sian').expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - no user of this username in database");
            });
        });
    });
});

describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
        test("Returns a status 204 with no content", () => {
            return request(app).delete('/api/comments/1')
            .expect(204)
            .then(( { body }) => {
                expect(body).toEqual({});
            });
        });
        test("Database no longer contains the comment with the specified ID", () => {
            return request(app).delete('/api/comments/1')
            .expect(204)
            .then(() => {
                return request(app).get('/api/articles/9/comments')
                .expect(200)
            })
            .then(({ body }) => {
                const comments = body.comments;
                expect(comments.length).toBe(1);
            });
        });
        test("Returns 'Status: 404' and relevant error message if comment ID does not exist in database", () => {
            return request(app).delete('/api/comments/567')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
        });
        test("Returns 'Status: 400' and relevant error message if comment ID is of incorrect data type", () => {
            return request(app).delete('/api/comments/abc')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type");
            });
        });
    });
    describe("PATCH", () => {
        test("Returns 'Status: 400' with 'Bad request' error message if sent empty request body", () => {
            return request(app).patch('/api/comments/1')
            .send()
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - no inc_votes property found")
            });
        });
        test("Returns 'Status: 200' with updated comment object", () => {
            return request(app).patch('/api/comments/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                expect(typeof body.updatedComment).toBe("object");
                expect(Array.isArray(body.updatedComment)).toBe(false)
            });
        });
        test("Returns correct comment object for comment ID with expected keys", () => {
            return request(app).patch('/api/comments/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                const updatedComment = body.updatedComment;
                expect(updatedComment).toHaveProperty("comment_id", 1)
                expect(updatedComment).toHaveProperty("body")
                expect(updatedComment).toHaveProperty("votes")
                expect(updatedComment).toHaveProperty("author")
                expect(updatedComment).toHaveProperty("article_id")
                expect(updatedComment).toHaveProperty("created_at")
            });
        });
        test("Returns comment object with 'votes' key updated by correct amount, including by negative numbers", () => {
            return request(app).patch('/api/comments/1')
            .send({ inc_votes: -5 })
            .expect(200)
            .then(({ body }) => {
                const updatedComment = body.updatedComment;
                expect(updatedComment).toHaveProperty("comment_id", 1)
                expect(updatedComment).toHaveProperty("votes", 11)
            });
        });
        test("Returns 'Status: 400' and relevant error message if comment ID is of incorrect data type", () => {
            return request(app).patch('/api/comments/abc')
            .send({ inc_votes: 2 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type");
            });
        });
        test("Returns 'Status: 404' and relevant error message if comment ID does not exist in database", () => {
            return request(app).patch('/api/comments/474')
            .send({ inc_votes: 2 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - no comment of this ID in database");
            });
        });
        test("Returns 'Status: 400' and 'Bad request' error message if no 'inc_votes' property on request body", () => {
            return request(app).patch('/api/comments/1')
            .send({ change_votes: 2 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - no inc_votes property found");
            });
        });
        test("Returns 'Status: 400' and 'Bad request' error message if 'inc_votes' property is of incorrect data type", () => {
            return request(app).patch('/api/comments/1')
            .send({ inc_votes: "abc" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type");
            });
        });
    });
});