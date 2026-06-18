import prisma from '../../config/database';

export class ClubsService {
  static async findAll(filters: { region?: string; department?: string }) {
    return prisma.club.findMany({
      where: {
        ...(filters.region && { region: { contains: filters.region, mode: 'insensitive' } }),
        ...(filters.department && { department: filters.department }),
      },
      orderBy: { rank: 'asc' },
    });
  }

  static async getMyClub(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { club: { include: { members: { select: { id: true, firstName: true, lastName: true, level: true } } } } },
    });
    if (!user?.club) throw Object.assign(new Error('Vous n\'appartenez à aucun club'), { status: 404 });
    return user.club;
  }

  static async findById(id: string) {
    const club = await prisma.club.findUnique({
      where: { id },
      include: { members: { select: { id: true, firstName: true, lastName: true, level: true } } },
    });
    if (!club) throw Object.assign(new Error('Club introuvable'), { status: 404 });
    return club;
  }

  static async getRanking(filters: { scale?: string; region?: string }) {
    return prisma.club.findMany({
      where: { ...(filters.region && { region: { contains: filters.region, mode: 'insensitive' } }) },
      orderBy: { rank: 'asc' },
      select: { id: true, name: true, region: true, department: true, rank: true, rankDelta: true, totalKm: true, monthlyKm: true, memberCount: true, michelinEquipmentPct: true },
    });
  }
}
