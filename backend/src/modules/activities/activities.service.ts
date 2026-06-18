import prisma from '../../config/database';

export class ActivitiesService {
  static async getUserActivities(userId: string, limit?: number) {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      ...(limit && { take: limit }),
    });
  }

  static async getRecent(userId: string, limit = 5) {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }

  static async getById(id: string, userId: string) {
    const activity = await prisma.activity.findFirst({ where: { id, userId } });
    if (!activity) throw Object.assign(new Error('Activité introuvable'), { status: 404 });
    return activity;
  }

  static async create(userId: string, data: {
    name: string; date: string; distanceKm: number; elevationM: number;
    avgSpeedKmh: number; maxSpeedKmh: number; durationMin: number;
    type: string; location: string; mpiImpact?: number;
  }) {
    return prisma.activity.create({
      data: { ...data, userId, date: new Date(data.date), mpiImpact: data.mpiImpact ?? 0 },
    });
  }
}
