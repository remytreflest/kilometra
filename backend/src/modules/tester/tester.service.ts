import prisma from '../../config/database';

export class TesterService {
  static async getMyProgress(userId: string) {
    const progress = await prisma.testerProgress.findUnique({
      where: { userId },
      include: { rewards: { orderBy: { id: 'asc' } } },
    });
    return progress ?? null;
  }

  static async getMyRewards(userId: string) {
    const progress = await prisma.testerProgress.findUnique({
      where: { userId },
      include: { rewards: { orderBy: { id: 'asc' } } },
    });
    if (!progress) throw Object.assign(new Error('Progression testeur introuvable'), { status: 404 });
    return progress.rewards;
  }
}
