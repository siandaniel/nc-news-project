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
        test("Returns 'Status Code: 200' if no error", () => {
            return request(app).get('/api/topics').expect(200);
        });
    });
});