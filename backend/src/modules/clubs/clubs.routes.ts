import { Router } from 'express';
import { ClubsController } from './clubs.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Routes statiques avant les routes paramétrées
router.get('/me', authMiddleware, asyncHandler(ClubsController.getMyClub));
router.get('/ranking', asyncHandler(ClubsController.getRanking));
router.get('/', asyncHandler(ClubsController.getAll));
router.get('/:id', asyncHandler(ClubsController.getById));

export default router;
