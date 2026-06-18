import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { formatResponse } from '../../utils/response';

export class UsersController {
  static async me(req: Request, res: Response) {
    const user = await UsersService.getMe(req.user!.id);
    res.json(formatResponse(user));
  }

  static async updateMe(req: Request, res: Response) {
    const updated = await UsersService.updateMe(req.user!.id, req.body);
    res.json(formatResponse(updated));
  }

  static async badges(req: Request, res: Response) {
    const badges = await UsersService.getBadges(req.user!.id);
    res.json(formatResponse(badges));
  }

  static async rewards(req: Request, res: Response) {
    const rewards = await UsersService.getRewards(req.user!.id);
    res.json(formatResponse(rewards));
  }

  static async allBadges(req: Request, res: Response) {
    const badges = await UsersService.getAllBadgesWithStatus(req.user!.id);
    res.json(formatResponse(badges));
  }
}
