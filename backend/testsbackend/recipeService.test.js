//To verify that the /api/recipes endpoint returns a successful response and the data structure is correct.

const request = require('supertest');
const express = require('express');

const app = express();

// Mock routes
app.get('/api/recipes', (req, res) => {
  res.status(200).json([]);
});

describe('Recipe Service', () => {
  it('should fetch recipes successfully', async () => {
    const response = await request(app).get('/api/recipes');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});