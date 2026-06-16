import { Router } from 'express';
import { TodoController } from './todos.controller';

const router = Router();

router.get('/', TodoController.getAll);
router.post('/', TodoController.create);
router.put('/:id', TodoController.patch);
router.patch('/:id', TodoController.patch);
router.delete('/:id', TodoController.remove);

export default router;
