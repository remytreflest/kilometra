import { Request, Response } from 'express';
import { TesterService } from './tester.service';
import { formatResponse } from '../../utils/response';

export class TesterController {
  static async me(req: Request, res: Response) {
    const data = await TesterService.getMyProgress(req.user!.id);
    res.json(formatResponse(data));
  }

  static async rewards(req: Request, res: Response) {
    const data = await TesterService.getMyRewards(req.user!.id);
    res.json(formatResponse(data));
  }
}
