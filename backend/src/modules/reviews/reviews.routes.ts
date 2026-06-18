import { Router } from 'express';
import { z } from 'zod';
import { ReviewsController } from './reviews.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

const createSchema = z.object({
  kmWithTire: z.number().min(0),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10),
  tireRef: z.string().min(1),
  type: z.enum(['user', 'influencer']).optional(),
  sponsoredContent: z.string().optional(),
  followerCount: z.number().int().optional(),
  platform: z.string().optional(),
});

// Routes statiques avant les routes paramétrées
router.get('/kpis', ReviewsController.getKpis);
router.get('/', ReviewsController.getAll);
router.post('/', authMiddleware, validate(createSchema), ReviewsController.create);
router.get('/:id', ReviewsController.getById);

export default router;
