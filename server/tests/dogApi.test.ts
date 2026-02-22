import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import dogRoutes from '../routes/dogRoutes';
import * as dogController from '../controllers/dogController';

vi.mock('../controllers/dogController');

describe('Dog API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    vi.clearAllMocks();
    
    app = express();
    app.use('/api/dogs', dogRoutes);
  });

  describe('GET /api/dogs/random', () => {
    it('should return a random dog image successfully', async () => {
      const mockDogData = {
        imageUrl: 'https://images.dog.ceo/breeds/stbernard/n02109525_15579.jpg',
        status: 'success'
      };

      const mockControllerResponse = {
        success: true,
        data: mockDogData
      };

      vi.mocked(dogController.getDogImage).mockImplementation(
        async (_req, res) => {
          res.json(mockControllerResponse);
        }
      );

      const response = await request(app)
        .get('/api/dogs/random')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockControllerResponse);
      expect(response.body.success).toBe(true);
      expect(response.body.data.imageUrl).toBe(mockDogData.imageUrl);
      expect(response.body.data.status).toBe('success');
      
      expect(dogController.getDogImage).toHaveBeenCalledOnce();
    });

    it('should return 500 when an error occurs in the controller', async () => {
      const mockErrorResponse = {
        success: false,
        error: 'Failed to fetch dog image: Network error'
      };

      vi.mocked(dogController.getDogImage).mockImplementation(
        async (_req, res) => {
          res.status(500).json(mockErrorResponse);
        }
      );

      const response = await request(app)
        .get('/api/dogs/random')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual(mockErrorResponse);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Failed to fetch dog image: Network error');
      
      expect(dogController.getDogImage).toHaveBeenCalledOnce();
    });
  });
});