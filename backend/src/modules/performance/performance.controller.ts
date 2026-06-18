import { Request, Response } from 'express';
import { PerformanceService } from './performance.service';
import { formatResponse } from '../../utils/response';

export class PerformanceController {
  static async me(req: Request, res: Response) {
    const data = await PerformanceService.getMyPerformance(req.user!.id);
    res.json(formatResponse(data));
  }

  static async community(_req: Request, res: Response) {
    const data = await PerformanceService.getCommunityKpis();
    res.json(formatResponse(data));
  }
}
