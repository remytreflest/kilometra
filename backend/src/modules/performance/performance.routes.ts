import { Router } from 'express';
import { PerformanceController } from './performance.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.get('/me', authMiddleware, asyncHandler(PerformanceController.me));
router.get('/community', asyncHandler(PerformanceController.community));

export default router;
