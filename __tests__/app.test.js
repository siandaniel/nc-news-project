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
        test("Returns an article object containing the correct keys", () => {
            return request(app).get('/api/articles/1').expect(200)
            .then(({ body }) => {
                const article = body.requestedArticle;
                expect(article).toHaveProperty("author", expect.any(String));
                expect(article).toHaveProperty("title", expect.any(String));
                expect(article).toHaveProperty("article_id", expect.any(Number));
                expect(article).toHaveProperty("body", expect.any(String));
                expect(article).toHaveProperty("topic", expect.any(String));
                expect(article).toHaveProperty("created_at", expect.any(String));
                expect(article).toHaveProperty("votes", expect.any(Number));
                expect(article).toHaveProperty("article_img_url", expect.any(String));
            });
        });
        test("Returns the correct article object for article ID 1", () => {
            return request(app).get('/api/articles/1').expect(200)
            .then(({ body }) => {
                const article = body.requestedArticle;
                expect(article).toEqual({
                    author: "butter_bridge",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2020-07-09T20:11:00.000Z",
                    title: "Living in the shadow of a great man",
                    votes: 100,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                });
            });
        });
        test("Returns the correct article object for other valid article IDs", () => {
            return request(app).get('/api/articles/2').expect(200)
            .then(({ body }) => {
                const article = body.requestedArticle;
                expect(article).toHaveProperty("article_id", 2);
            });
        });
        test("Returns 'Status: 400' and relevant error message if article ID is of incorrect data type", () => {
            return request(app).get('/api/articles/abc').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type for article ID");
            });
        });
        test("Returns 'Status: 404' and relevant error message if article ID does not exist in database", () => {
            return request(app).get('/api/articles/392').expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - no article of this ID in database");
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
                expect(body.msg).toBe("Bad request - invalid data type for article ID");
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
                username: "Sian"
              })
            .expect(201)
            .then(({ body }) => {
                expect(body.commentPosted).toHaveProperty("article_id", 1);
                expect(body.commentPosted).toHaveProperty("author", "butter_bridge");
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
                username: "Sian"
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
                username: "Sian"
              })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request - invalid data type for article ID");
            });
        });
        test("Returns 'Status: 404' and relevant error message if article ID does not exist in database", () => {
            return request(app).post('/api/articles/392/comments')
            .send({
                body: "Mitch is cool",
                username: "Sian"
              })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found - no article of this ID in database");
            });
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
});
