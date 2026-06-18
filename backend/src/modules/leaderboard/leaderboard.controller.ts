import { Request, Response } from 'express';
import { LeaderboardService } from './leaderboard.service';
import { formatResponse } from '../../utils/response';

export class LeaderboardController {
  static async getNational(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const data = await LeaderboardService.getNational(limit);
    res.json(formatResponse(data));
  }

  static async getRegional(req: Request, res: Response) {
    const region = req.query.region as string;
    if (!region) {
      return res.status(400).json({ success: false, error: { message: 'Paramètre region requis', code: 'MISSING_PARAM' } });
    }
    const data = await LeaderboardService.getRegional(region);
    res.json(formatResponse(data));
  }
}
