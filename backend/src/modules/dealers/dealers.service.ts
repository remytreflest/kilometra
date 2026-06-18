import prisma from '../../config/database';
import { StockStatus } from '@prisma/client';

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export class DealersService {
  static async findAll(filters: { lat?: number; lng?: number; coupon?: boolean; open?: boolean; stock?: string }) {
    const dealers = await prisma.dealer.findMany({
      where: {
        ...(filters.coupon !== undefined && { acceptsCoupon: filters.coupon }),
        ...(filters.open !== undefined && { isOpen: filters.open }),
        ...(filters.stock && { stockStatus: filters.stock as StockStatus }),
      },
      orderBy: { name: 'asc' },
    });

    if (filters.lat !== undefined && filters.lng !== undefined) {
      return dealers
        .map((d) => ({ ...d, distanceKm: Math.round(haversine(filters.lat!, filters.lng!, d.lat, d.lng) * 10) / 10 }))
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return dealers.map((d) => ({ ...d, distanceKm: null }));
  }

  static async findById(id: string) {
    const dealer = await prisma.dealer.findUnique({ where: { id } });
    if (!dealer) throw Object.assign(new Error('Revendeur introuvable'), { status: 404 });
    return dealer;
  }
}
