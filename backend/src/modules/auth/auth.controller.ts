import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { formatResponse } from '../../utils/response';

export class AuthController {
  static async login(req: Request, res: Response) {
    const result = await AuthService.login(req.body.email, req.body.password);
    res.json(formatResponse(result));
  }

  static async register(req: Request, res: Response) {
    const result = await AuthService.register(req.body);
    res.status(201).json(formatResponse(result));
  }

  static async logout(_req: Request, res: Response) {
    res.json(formatResponse({ message: 'Déconnexion réussie' }));
  }

  static async me(req: Request, res: Response) {
    const user = await AuthService.getMe(req.user!.id);
    res.json(formatResponse(user));
  }
}
