import { Router } from 'express';
import { TesterController } from './tester.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);
router.get('/me', asyncHandler(TesterController.me));
router.get('/me/rewards', asyncHandler(TesterController.rewards));

export default router;
