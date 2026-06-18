import { Router } from 'express';
import { DealersController } from './dealers.controller';

const router = Router();

router.get('/', DealersController.getAll);
router.get('/:id', DealersController.getById);

export default router;
