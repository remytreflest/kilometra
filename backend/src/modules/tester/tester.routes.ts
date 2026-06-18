import { Router } from 'express';
import { TesterController } from './tester.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/me', TesterController.me);
router.get('/me/rewards', TesterController.rewards);

export default router;
