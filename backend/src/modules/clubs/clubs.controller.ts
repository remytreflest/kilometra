import { Request, Response } from 'express';
import { ClubsService } from './clubs.service';
import { formatResponse } from '../../utils/response';

export class ClubsController {
  static async getAll(req: Request, res: Response) {
    const data = await ClubsService.findAll({ region: req.query.region as string, department: req.query.department as string });
    res.json(formatResponse(data));
  }

  static async getMyClub(req: Request, res: Response) {
    const data = await ClubsService.getMyClub(req.user!.id);
    res.json(formatResponse(data));
  }

  static async getRanking(req: Request, res: Response) {
    const data = await ClubsService.getRanking({ scale: req.query.scale as string, region: req.query.region as string });
    res.json(formatResponse(data));
  }

  static async getById(req: Request, res: Response) {
    const data = await ClubsService.findById(req.params.id);
    res.json(formatResponse(data));
  }
}
