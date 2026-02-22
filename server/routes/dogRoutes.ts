import { Router } from 'express';
import { getDogImage } from '../controllers/dogController';

const router = Router();

/**
 * GET /dogs/random - Retrieve a random dog image
 */
router.get('/random', getDogImage);

export default router;
