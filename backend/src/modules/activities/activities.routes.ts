import { Router } from 'express';
import { z } from 'zod';
import { ActivitiesController } from './activities.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1),
  date: z.string(),
  distanceKm: z.number().positive(),
  elevationM: z.number().min(0),
  avgSpeedKmh: z.number().positive(),
  maxSpeedKmh: z.number().positive(),
  durationMin: z.number().positive(),
  type: z.enum(['route', 'gravel', 'vtt', 'fractionné', 'sortie longue']),
  location: z.string().min(1),
  mpiImpact: z.number().optional(),
});

router.use(authMiddleware);
router.get('/recent', ActivitiesController.getRecent);
router.get('/', ActivitiesController.getAll);
router.post('/', validate(createSchema), ActivitiesController.create);
router.get('/:id', ActivitiesController.getById);

export default router;
