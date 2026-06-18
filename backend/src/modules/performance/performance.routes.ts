import { Router } from 'express';
import { PerformanceController } from './performance.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, PerformanceController.me);
router.get('/community', PerformanceController.community);

export default router;
