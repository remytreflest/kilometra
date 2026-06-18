import { Request, Response } from 'express';
import { WearService } from './wear.service';
import { formatResponse } from '../../utils/response';

export class WearController {
  static async getAll(req: Request, res: Response) {
    const data = await WearService.getUserWear(req.user!.id);
    res.json(formatResponse(data));
  }

  static async create(req: Request, res: Response) {
    const data = await WearService.createWear(req.user!.id, req.body);
    res.status(201).json(formatResponse(data));
  }

  static async update(req: Request, res: Response) {
    const data = await WearService.updateWear(req.params.id, req.user!.id, req.body);
    res.json(formatResponse(data));
  }
}
