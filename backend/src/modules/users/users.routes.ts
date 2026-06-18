import { Router } from 'express';
import { z } from 'zod';
import { UsersController } from './users.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  stravaConnected: z.boolean().optional(),
});

router.use(authMiddleware);
router.get('/me', UsersController.me);
router.patch('/me', validate(updateSchema), UsersController.updateMe);
router.get('/me/badges', UsersController.badges);
router.get('/me/rewards', UsersController.rewards);

export default router;
