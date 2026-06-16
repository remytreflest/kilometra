import { Request, Response } from 'express';
import { TodoService } from './todos.service';
import { formatResponse } from '../../utils/response';

export class TodoController {
  static async getAll(req: Request, res: Response) {
    const todos = await TodoService.findAll();
    res.json(formatResponse(todos));
  }

  static async create(req: Request, res: Response) {
    const todo = await TodoService.create(req.body);
    res.status(201).json(formatResponse(todo));
  }

  static async patch(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await TodoService.update(id, req.body);
    res.json(formatResponse(updated));
  }

  static async remove(req: Request, res: Response) {
    const { id } = req.params;
    await TodoService.delete(id);
    res.json(formatResponse({ id }));
  }
}
