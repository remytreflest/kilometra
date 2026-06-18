import { Request, Response } from 'express';
import { TiresService } from './tires.service';
import { formatResponse } from '../../utils/response';

export class TiresController {
  static async getAll(req: Request, res: Response) {
    const tires = await TiresService.findAll({ category: req.query.category as string, brand: req.query.brand as string });
    res.json(formatResponse(tires));
  }

  static async getMichelin(_req: Request, res: Response) {
    const tires = await TiresService.findMichelin();
    res.json(formatResponse(tires));
  }

  static async getTerrainStats(_req: Request, res: Response) {
    const stats = await TiresService.getAllTerrainStats();
    res.json(formatResponse(stats));
  }

  static async getById(req: Request, res: Response) {
    const tire = await TiresService.findById(req.params.id);
    res.json(formatResponse(tire));
  }

  static async getBenchmark(req: Request, res: Response) {
    const data = await TiresService.getBenchmark(req.params.id);
    res.json(formatResponse(data));
  }

  static async getTireTerrainStats(req: Request, res: Response) {
    const stats = await TiresService.getTireTerrainStats(req.params.id);
    res.json(formatResponse(stats));
  }
}
