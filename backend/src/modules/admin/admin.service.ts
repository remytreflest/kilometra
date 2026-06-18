import prisma from '../../config/database';

const TERRAIN_FIELDS = ['mountain', 'coastal', 'plain', 'wet'] as const;
type Terrain = (typeof TERRAIN_FIELDS)[number];

export class AdminService {
  static async getRegions() {
    return prisma.regionCoverage.findMany({ orderBy: { coveragePct: 'desc' } });
  }

  static async getUndercoveredRegions() {
    return prisma.regionCoverage.findMany({
      where: { coveragePct: { lt: 40 } },
      orderBy: { coveragePct: 'asc' },
    });
  }

  static async getTireTerrainPerformance() {
    return prisma.tireTerrainPerf.findMany({
      include: { tire: { select: { category: true, brand: true } } },
      orderBy: { avgRating: 'desc' },
    });
  }

  static async getBestTireForTerrain(terrain: string) {
    if (!TERRAIN_FIELDS.includes(terrain as Terrain)) {
      throw Object.assign(new Error(`Terrain invalide. Valeurs: ${TERRAIN_FIELDS.join(', ')}`), { status: 400 });
    }
    const result = await prisma.tireTerrainPerf.findFirst({
      orderBy: { [terrain]: 'desc' },
      include: { tire: { select: { name: true, category: true, brand: true, priceEur: true } } },
    });
    if (!result) throw Object.assign(new Error('Aucune donnée terrain disponible'), { status: 404 });
    return result;
  }

  static async getKpis() {
    return prisma.adminKpi.findMany();
  }
}
