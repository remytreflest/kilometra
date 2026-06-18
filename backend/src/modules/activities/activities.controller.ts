import { Request, Response } from 'express';
import { ActivitiesService } from './activities.service';
import { formatResponse } from '../../utils/response';

export class ActivitiesController {
  static async getAll(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const data = await ActivitiesService.getUserActivities(req.user!.id, limit);
    res.json(formatResponse(data));
  }

  static async getRecent(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const data = await ActivitiesService.getRecent(req.user!.id, limit);
    res.json(formatResponse(data));
  }

  static async getById(req: Request, res: Response) {
    const data = await ActivitiesService.getById(req.params.id, req.user!.id);
    res.json(formatResponse(data));
  }

  static async create(req: Request, res: Response) {
    const data = await ActivitiesService.create(req.user!.id, req.body);
    res.status(201).json(formatResponse(data));
  }
}
