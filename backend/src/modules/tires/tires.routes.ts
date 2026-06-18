import { Router } from 'express';
import { TiresController } from './tires.controller';

const router = Router();

// Routes statiques avant les routes paramétrées
router.get('/michelin', TiresController.getMichelin);
router.get('/terrain-stats', TiresController.getTerrainStats);

router.get('/', TiresController.getAll);
router.get('/:id', TiresController.getById);
router.get('/:id/benchmark', TiresController.getBenchmark);
router.get('/:id/terrain-stats', TiresController.getTireTerrainStats);

export default router;
