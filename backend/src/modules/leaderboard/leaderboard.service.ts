import prisma from '../../config/database';

function computeLevel(score: number): string {
  if (score >= 850) return 'Élite';
  if (score >= 750) return 'Compétiteur Expert';
  if (score >= 650) return 'Expert';
  if (score >= 550) return 'Passionné';
  if (score >= 400) return 'Intermédiaire';
  return 'Débutant';
}

async function buildLeaderboard(where: object, limit?: number) {
  const entries = await prisma.performanceIndex.findMany({
    where,
    orderBy: { score: 'desc' },
    ...(limit && { take: limit }),
    include: {
      user: {
        select: {
          id: true, firstName: true, lastName: true,
          club: { select: { name: true, region: true } },
          activities: { select: { distanceKm: true } },
        },
      },
    },
  });

  return entries.map((entry, idx) => ({
    rank: idx + 1,
    userId: entry.userId,
    riderName: `${entry.user.firstName} ${entry.user.lastName}`,
    club: entry.user.club?.name ?? null,
    region: entry.user.club?.region ?? null,
    totalKm: entry.user.activities.reduce((sum, a) => sum + a.distanceKm, 0),
    mpiScore: entry.score,
    level: computeLevel(entry.score),
    michelinUser: true,
  }));
}

export class LeaderboardService {
  static async getNational(limit = 50) {
    return buildLeaderboard({}, limit);
  }

  static async getRegional(region: string) {
    const users = await prisma.user.findMany({
      where: { club: { region: { contains: region, mode: 'insensitive' } } },
      select: { id: true },
    });
    const userIds = users.map((u) => u.id);
    return buildLeaderboard({ userId: { in: userIds } });
  }
}
