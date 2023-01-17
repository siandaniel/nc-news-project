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
                expect(articles[0].article_id).toBe(3);
                expect(articles[1].article_id).toBe(6);
                expect(articles[articles.length-2].article_id).toBe(11);
                expect(articles[articles.length-1].article_id).toBe(7);
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
                expect(article).toHaveProperty("author", "butter_bridge");
                expect(article).toHaveProperty("title", "Living in the shadow of a great man");
                expect(article).toHaveProperty("article_id", 1);
                expect(article).toHaveProperty("body", "I find this existence challenging");
                expect(article).toHaveProperty("topic", "mitch");
                expect(article).toHaveProperty("created_at", "2020-07-09T20:11:00.000Z");
                expect(article).toHaveProperty("votes", 100);
                expect(article).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
            });
        });
        test("Returns the correct article object for other valid article IDs", () => {
            return request(app).get('/api/articles/2').expect(200)
            .then(({ body }) => {
                const articleA = body.requestedArticle;
                expect(articleA).toHaveProperty("article_id", 2);
            })
            .then(() => {
                return request(app).get('/api/articles/12').expect(200)
            })
            .then(({ body }) => {
                const articleC = body.requestedArticle;
                expect(articleC).toHaveProperty("article_id", 12);
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
                console.log(body)
                expect(body.msg).toBe("Not found - no article of this ID in database");
            });
        });
    });
});