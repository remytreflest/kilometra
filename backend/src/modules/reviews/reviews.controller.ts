import { Request, Response } from 'express';
import { ReviewsService } from './reviews.service';
import { formatResponse } from '../../utils/response';

export class ReviewsController {
  static async getAll(req: Request, res: Response) {
    const data = await ReviewsService.findAll({
      type: req.query.type as string,
      tireRef: req.query.tireRef as string,
      rating: req.query.rating ? Number(req.query.rating) : undefined,
    });
    res.json(formatResponse(data));
  }

  static async getKpis(_req: Request, res: Response) {
    const data = await ReviewsService.getKpis();
    res.json(formatResponse(data));
  }

  static async create(req: Request, res: Response) {
    const data = await ReviewsService.create(req.user!.id, req.body);
    res.status(201).json(formatResponse(data));
  }

  static async getById(req: Request, res: Response) {
    const data = await ReviewsService.findById(req.params.id);
    res.json(formatResponse(data));
  }
}
