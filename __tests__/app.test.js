const request = require('supertest');
//const app = require('../db/app.js');
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
        test("Returns status code: 200 when okay", () => {
            
        })
    })
})