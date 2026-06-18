import { Router } from 'express';
import { z } from 'zod';
import { WearController } from './wear.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

const createSchema = z.object({
  tireId: z.string().min(1),
  installedAt: z.string(),
  currentKm: z.number().min(0),
  estimatedMaxKm: z.number().min(1),
});

const updateSchema = z.object({
  currentKm: z.number().min(0),
});

router.use(authMiddleware);
router.get('/', WearController.getAll);
router.post('/', validate(createSchema), WearController.create);
router.patch('/:id', validate(updateSchema), WearController.update);

export default router;
