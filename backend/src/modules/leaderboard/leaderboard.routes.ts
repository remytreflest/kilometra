import { Router } from 'express';
import { LeaderboardController } from './leaderboard.controller';

const router = Router();

router.get('/national', LeaderboardController.getNational);
router.get('/regional', LeaderboardController.getRegional);

export default router;
