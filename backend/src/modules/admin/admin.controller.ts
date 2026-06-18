import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { formatResponse } from '../../utils/response';

export class AdminController {
  static async getRegions(_req: Request, res: Response) {
    const data = await AdminService.getRegions();
    res.json(formatResponse(data));
  }

  static async getUndercoveredRegions(_req: Request, res: Response) {
    const data = await AdminService.getUndercoveredRegions();
    res.json(formatResponse(data));
  }

  static async getTireTerrainPerformance(_req: Request, res: Response) {
    const data = await AdminService.getTireTerrainPerformance();
    res.json(formatResponse(data));
  }

  static async getBestTireForTerrain(req: Request, res: Response) {
    const data = await AdminService.getBestTireForTerrain(req.query.terrain as string);
    res.json(formatResponse(data));
  }

  static async getKpis(_req: Request, res: Response) {
    const data = await AdminService.getKpis();
    res.json(formatResponse(data));
  }
}
