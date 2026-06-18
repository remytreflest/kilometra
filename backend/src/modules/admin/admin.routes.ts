import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authMiddleware, adminMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/regions', AdminController.getRegions);
router.get('/regions/undercovered', AdminController.getUndercoveredRegions);
router.get('/tires/terrain-performance', AdminController.getTireTerrainPerformance);
router.get('/tires/terrain-performance/best', AdminController.getBestTireForTerrain);
router.get('/kpis', AdminController.getKpis);

export default router;
