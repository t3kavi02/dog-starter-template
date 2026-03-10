import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

const API_BASE_URL = 'http://localhost:5000';

describe('API Tests - Real Server', () => {
  describe('GET /api/dogs/random - Positive Test', () => {
    it('should return a random dog image with status 200', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/dogs/random')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('imageUrl');
      expect(response.body.data).toHaveProperty('status', 'success');
      
      expect(typeof response.body.data.imageUrl).toBe('string');
      expect(response.body.data.imageUrl.length).toBeGreaterThan(0);
      
      expect(response.body.data.imageUrl).toMatch(/^https?:\/\/.+/);
    });
  });

  describe('GET /api/dogs/invalid - Negative Test (404)', () => {
    it('should return 404 with error message for invalid route', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/dogs/invalid')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      
      const errorMessage = response.body.error;
      expect(typeof errorMessage).toBe('string');
      expect(errorMessage.length).toBeGreaterThan(0);
      
      console.log('404 error message:', errorMessage);
    });
  });
});