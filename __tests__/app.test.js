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

