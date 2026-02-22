import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { getDogImage } from '../controllers/dogController';
import * as dogService from '../services/dogService';

vi.mock('../services/dogService');

describe('dogController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: vi.Mock;
  let mockStatus: vi.Mock;

// Weird error here with "vi", "cannot find namespace".
// I couldn't figure out what it means, but it doesn't
// interfere with testing.

  beforeEach(() => {
    vi.clearAllMocks();

    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };
  });

  describe('getDogImage', () => {
    it('should successfully return dog image data', async () => {
      const mockDogData = {
        imageUrl: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
        status: 'success'
      };

      vi.mocked(dogService.getRandomDogImage).mockResolvedValueOnce(mockDogData);

      await getDogImage(mockRequest as Request, mockResponse as Response);

      expect(dogService.getRandomDogImage).toHaveBeenCalledOnce();
      
      expect(mockStatus).not.toHaveBeenCalled();
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockDogData
      });
    });
  });
});