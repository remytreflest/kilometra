import { Router } from 'express';
import { TiresController } from './tires.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Routes statiques avant les routes paramétrées
router.get('/michelin', asyncHandler(TiresController.getMichelin));
router.get('/terrain-stats', asyncHandler(TiresController.getTerrainStats));

router.get('/', asyncHandler(TiresController.getAll));
router.get('/:id', asyncHandler(TiresController.getById));
router.get('/:id/benchmark', asyncHandler(TiresController.getBenchmark));
router.get('/:id/terrain-stats', asyncHandler(TiresController.getTireTerrainStats));

export default router;
