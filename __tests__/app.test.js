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
        test("Returns 'Status: 404' if invalid path provided, e.g. misspelt path", () => {
            return request(app).get('/api/topisc').expect(404);
        });
        test("Returns custom error message if invalid path provided ", () => {
            return request(app).get('/api/topisc').expect(404).then((body) => {
                const errorMsg = body.error.text
                expect(errorMsg).toBe("Invalid path provided - please try again");
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
    });
});
