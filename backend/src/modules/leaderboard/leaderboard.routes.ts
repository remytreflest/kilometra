import { Router } from 'express';
import { LeaderboardController } from './leaderboard.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.get('/national', asyncHandler(LeaderboardController.getNational));
router.get('/regional', asyncHandler(LeaderboardController.getRegional));

export default router;
