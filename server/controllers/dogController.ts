import { Request, Response } from 'express';
import { getRandomDogImage } from '../services/dogService';

/**
 * Controller for getting a random dog image
 * @param _req - Express request object
 * @param res - Express response object
 */
export async function getDogImage(_req: Request, res: Response): Promise<void> {
  try {
    const dogData = await getRandomDogImage();

    res.json({
      success: true,
      data: dogData
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';

    res.status(500).json({
      success: false,
      error: message
    });
  }
}
