import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRandomDogImage } from '../services/dogService';

describe('dogService', () => {
  const mockFetchResponse = {
    message: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
    status: 'success'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    global.fetch = vi.fn();
  });

  describe('getRandomDogImage', () => {
    it('should successfully fetch a random dog image and return formatted response', async () => {
      const mockFetch = vi.mocked(global.fetch);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFetchResponse
      } as Response);

      const result = await getRandomDogImage();

      expect(result).toEqual({
        imageUrl: mockFetchResponse.message,
        status: 'success'
      });
      
      expect(result.imageUrl).toBe(mockFetchResponse.message);
      expect(result.status).toBe('success');
      expect(mockFetch).toHaveBeenCalledOnce();
      expect(mockFetch).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random');
    });

    it('should throw an error when the API returns a 500 status', async () => {
      const mockFetch = vi.mocked(global.fetch);
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response);

      await expect(getRandomDogImage()).rejects.toThrow('Failed to fetch dog image: Dog API returned status 500');
      
      expect(mockFetch).toHaveBeenCalledOnce();
      expect(mockFetch).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random');
    });
  });
});