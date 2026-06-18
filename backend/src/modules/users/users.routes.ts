import { Router } from 'express';
import { z } from 'zod';
import { UsersController } from './users.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  stravaConnected: z.boolean().optional(),
});

router.use(authMiddleware);
router.get('/me', asyncHandler(UsersController.me));
router.patch('/me', validate(updateSchema), asyncHandler(UsersController.updateMe));
router.get('/me/badges/all', asyncHandler(UsersController.allBadges));
router.get('/me/badges', asyncHandler(UsersController.badges));
router.get('/me/rewards', asyncHandler(UsersController.rewards));

export default router;
