import prisma from '../../config/database';

export class WearService {
  static async getUserWear(userId: string) {
    return prisma.tireWear.findMany({
      where: { userId },
      include: { tire: { select: { name: true, reference: true, category: true } } },
      orderBy: { installedAt: 'desc' },
    });
  }

  static async createWear(userId: string, data: { tireId: string; installedAt: string; currentKm: number; estimatedMaxKm: number; position?: 'front' | 'rear' }) {
    const tire = await prisma.tire.findUnique({ where: { id: data.tireId } });
    if (!tire) throw Object.assign(new Error('Pneu introuvable'), { status: 404 });
    const wearPct = Math.round((data.currentKm / data.estimatedMaxKm) * 100);
    const status = wearPct >= 85 ? 'critical' : wearPct >= 60 ? 'warning' : 'good';
    return prisma.tireWear.create({
      data: {
        userId,
        tireId: data.tireId,
        tireRef: tire.reference,
        tireName: tire.name,
        position: data.position ?? 'front',
        installedAt: new Date(data.installedAt),
        currentKm: data.currentKm,
        estimatedMaxKm: data.estimatedMaxKm,
        wearPct,
        status,
      },
    });
  }

  static async updateWear(id: string, userId: string, data: { currentKm: number }) {
    const wear = await prisma.tireWear.findFirst({ where: { id, userId } });
    if (!wear) throw Object.assign(new Error('Enregistrement introuvable'), { status: 404 });
    const wearPct = Math.round((data.currentKm / wear.estimatedMaxKm) * 100);
    const status = wearPct >= 85 ? 'critical' : wearPct >= 60 ? 'warning' : 'good';
    return prisma.tireWear.update({ where: { id }, data: { currentKm: data.currentKm, wearPct, status } });
  }
}
