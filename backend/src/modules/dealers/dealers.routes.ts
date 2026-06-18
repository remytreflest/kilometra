import { Router } from 'express';
import { DealersController } from './dealers.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(DealersController.getAll));
router.get('/:id', asyncHandler(DealersController.getById));

export default router;
