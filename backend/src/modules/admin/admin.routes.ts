import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authMiddleware, adminMiddleware } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/regions', asyncHandler(AdminController.getRegions));
router.get('/regions/undercovered', asyncHandler(AdminController.getUndercoveredRegions));
router.get('/tires/terrain-performance', asyncHandler(AdminController.getTireTerrainPerformance));
router.get('/tires/terrain-performance/best', asyncHandler(AdminController.getBestTireForTerrain));
router.get('/kpis', asyncHandler(AdminController.getKpis));

export default router;
