import prisma from '../../config/database';

export class PerformanceService {
  static async getMyPerformance(userId: string) {
    const perf = await prisma.performanceIndex.findUnique({
      where: { userId },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    if (!perf) throw Object.assign(new Error('Indice de performance introuvable'), { status: 404 });
    return perf;
  }

  static async getCommunityKpis() {
    const [activeCyclists, registeredClubs, kmAggregate, reviewKpis, recentUsers, recentClubs] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.club.count(),
      prisma.activity.aggregate({ _sum: { distanceKm: true } }),
      prisma.review.aggregate({ _avg: { rating: true } }),
      prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
      prisma.club.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    ]);

    const analyzedKm = Math.round((kmAggregate._sum.distanceKm ?? 0));

    return {
      activeCyclists,
      registeredClubs,
      analyzedKm,
      punctureReductionPct: 34,   // valeurs statiques — à remplacer par un calcul dynamique
      weeklyKmGrowth: 5.2,
      monthlyUserGrowth: recentUsers,
      monthlyClubGrowth: recentClubs,
      avgRating: Math.round((reviewKpis._avg.rating ?? 0) * 10) / 10,
    };
  }
}
