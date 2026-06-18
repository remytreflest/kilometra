import { AdminService } from './admin.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    regionCoverage: { findMany: jest.fn() },
    tireTerrainPerf: { findMany: jest.fn(), findFirst: jest.fn() },
    adminKpi: { findMany: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  regionCoverage: { findMany: jest.Mock };
  tireTerrainPerf: { findMany: jest.Mock; findFirst: jest.Mock };
  adminKpi: { findMany: jest.Mock };
};

beforeEach(() => jest.clearAllMocks());

describe('AdminService.getRegions', () => {
  it('returns regions ordered by coveragePct', async () => {
    const regions = [{ id: '1', name: 'IDF', coveragePct: 90 }];
    mockPrisma.regionCoverage.findMany.mockResolvedValue(regions);
    const result = await AdminService.getRegions();
    expect(result).toEqual(regions);
  });
});

describe('AdminService.getUndercoveredRegions', () => {
  it('returns regions with coveragePct < 40', async () => {
    const regions = [{ id: '2', name: 'Creuse', coveragePct: 20 }];
    mockPrisma.regionCoverage.findMany.mockResolvedValue(regions);
    const result = await AdminService.getUndercoveredRegions();
    expect(mockPrisma.regionCoverage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { coveragePct: { lt: 40 } } })
    );
    expect(result).toEqual(regions);
  });
});

describe('AdminService.getTireTerrainPerformance', () => {
  it('returns tire terrain performance data', async () => {
    mockPrisma.tireTerrainPerf.findMany.mockResolvedValue([]);
    const result = await AdminService.getTireTerrainPerformance();
    expect(result).toEqual([]);
  });
});

describe('AdminService.getBestTireForTerrain', () => {
  it('returns best tire for a valid terrain', async () => {
    const perf = { tireId: 't1', mountain: 9, tire: { name: 'PowerMTB', category: 'MTB', brand: 'Michelin', priceEur: 60 } };
    mockPrisma.tireTerrainPerf.findFirst.mockResolvedValue(perf);
    const result = await AdminService.getBestTireForTerrain('mountain');
    expect(result).toEqual(perf);
  });

  it('throws 400 for invalid terrain', async () => {
    await expect(AdminService.getBestTireForTerrain('desert')).rejects.toMatchObject({ status: 400 });
  });

  it('throws 404 when no data available', async () => {
    mockPrisma.tireTerrainPerf.findFirst.mockResolvedValue(null);
    await expect(AdminService.getBestTireForTerrain('coastal')).rejects.toMatchObject({ status: 404 });
  });

  it('validates all terrain types', async () => {
    mockPrisma.tireTerrainPerf.findFirst.mockResolvedValue({ tireId: 't1', tire: {} });
    for (const terrain of ['mountain', 'coastal', 'plain', 'wet']) {
      await expect(AdminService.getBestTireForTerrain(terrain)).resolves.not.toThrow();
    }
  });
});

describe('AdminService.getKpis', () => {
  it('returns admin kpis', async () => {
    mockPrisma.adminKpi.findMany.mockResolvedValue([{ id: 'k1', label: 'Total KM', value: 100000 }]);
    const result = await AdminService.getKpis();
    expect(result).toHaveLength(1);
  });
});
