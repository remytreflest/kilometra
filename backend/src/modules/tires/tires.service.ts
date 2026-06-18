import prisma from '../../config/database';

export class TiresService {
  static async findAll(filters: { category?: string; brand?: string }) {
    return prisma.tire.findMany({
      where: {
        ...(filters.category && { category: filters.category as any }),
        ...(filters.brand && { brand: { contains: filters.brand, mode: 'insensitive' } }),
      },
      orderBy: { avgScore: 'desc' },
    });
  }

  static async findMichelin() {
    return prisma.tire.findMany({
      where: { brand: { contains: 'michelin', mode: 'insensitive' } },
      orderBy: { avgScore: 'desc' },
    });
  }

  static async findById(id: string) {
    const tire = await prisma.tire.findUnique({ where: { id } });
    if (!tire) throw Object.assign(new Error('Pneu introuvable'), { status: 404 });
    return tire;
  }

  static async getBenchmark(id: string) {
    const tire = await prisma.tire.findUnique({ where: { id } });
    if (!tire) throw Object.assign(new Error('Pneu introuvable'), { status: 404 });

    const categoryAvg = await prisma.tire.aggregate({
      where: { category: tire.category, id: { not: id } },
      _avg: { adhesion: true, efficiency: true, comfort: true, punctureResistance: true, durability: true, avgScore: true, priceEur: true },
    });

    return {
      tire,
      benchmark: {
        label: 'Moyenne catégorie',
        adhesion: categoryAvg._avg.adhesion ?? 0,
        efficiency: categoryAvg._avg.efficiency ?? 0,
        comfort: categoryAvg._avg.comfort ?? 0,
        punctureResistance: categoryAvg._avg.punctureResistance ?? 0,
        durability: categoryAvg._avg.durability ?? 0,
        avgScore: categoryAvg._avg.avgScore ?? 0,
        priceEur: categoryAvg._avg.priceEur ?? 0,
      },
    };
  }

  static async getAllTerrainStats() {
    return prisma.tireTerrainPerf.findMany({
      include: { tire: { select: { name: true, brand: true, category: true } } },
      orderBy: { avgRating: 'desc' },
    });
  }

  static async getTireTerrainStats(id: string) {
    const perf = await prisma.tireTerrainPerf.findUnique({
      where: { tireId: id },
      include: { tire: { select: { name: true, brand: true, category: true } } },
    });
    if (!perf) throw Object.assign(new Error('Statistiques terrain introuvables'), { status: 404 });
    return perf;
  }
}
