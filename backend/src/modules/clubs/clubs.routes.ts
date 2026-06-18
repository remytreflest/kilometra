import { Router } from 'express';
import { ClubsController } from './clubs.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Routes statiques avant les routes paramétrées
router.get('/me', authMiddleware, ClubsController.getMyClub);
router.get('/ranking', ClubsController.getRanking);
router.get('/', ClubsController.getAll);
router.get('/:id', ClubsController.getById);

export default router;
