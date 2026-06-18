import prisma from '../../config/database';

export class UsersService {
  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        club: { select: { id: true, name: true, region: true } },
        badges: { include: { badge: true }, orderBy: { earnedAt: 'desc' } },
        rewards: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!user) throw Object.assign(new Error('Utilisateur introuvable'), { status: 404 });
    const { password, ...rest } = user;
    return {
      ...rest,
      initials: `${user.firstName[0]}${user.lastName[0]}`,
      badges: user.badges.map((ub) => ({ ...ub.badge, earnedAt: ub.earnedAt })),
    };
  }

  static async updateMe(userId: string, data: { firstName?: string; lastName?: string; stravaConnected?: boolean }) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, firstName: true, lastName: true, email: true, stravaConnected: true, level: true, role: true },
    });
    return updated;
  }

  static async getBadges(userId: string) {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });
    return userBadges.map((ub) => ({ ...ub.badge, earnedAt: ub.earnedAt }));
  }

  static async getRewards(userId: string) {
    return prisma.reward.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
