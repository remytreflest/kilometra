import { Request, Response } from 'express';
import { DealersService } from './dealers.service';
import { formatResponse } from '../../utils/response';

export class DealersController {
  static async getAll(req: Request, res: Response) {
    const { lat, lng, coupon, open, stock } = req.query;
    const data = await DealersService.findAll({
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      coupon: coupon === 'true' ? true : coupon === 'false' ? false : undefined,
      open: open === 'true' ? true : open === 'false' ? false : undefined,
      stock: stock as string | undefined,
    });
    res.json(formatResponse(data));
  }

  static async getById(req: Request, res: Response) {
    const data = await DealersService.findById(req.params.id);
    res.json(formatResponse(data));
  }
}
