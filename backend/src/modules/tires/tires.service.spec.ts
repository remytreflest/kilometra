import { TiresService } from './tires.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    tire: { findMany: jest.fn(), findUnique: jest.fn(), aggregate: jest.fn() },
    tireTerrainPerf: { findMany: jest.fn(), findUnique: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  tire: { findMany: jest.Mock; findUnique: jest.Mock; aggregate: jest.Mock };
  tireTerrainPerf: { findMany: jest.Mock; findUnique: jest.Mock };
};

const fakeTire = {
  id: 't1', name: 'PowerRoad', reference: 'PR-001', brand: 'Michelin',
  category: 'ROAD', avgScore: 9.2, adhesion: 9, efficiency: 8, comfort: 9,
  punctureResistance: 8, durability: 9, priceEur: 50,
};

beforeEach(() => jest.clearAllMocks());

describe('TiresService.findAll', () => {
  it('returns tires with no filters', async () => {
    mockPrisma.tire.findMany.mockResolvedValue([fakeTire]);
    const result = await TiresService.findAll({});
    expect(result).toHaveLength(1);
  });

  it('applies category filter', async () => {
    mockPrisma.tire.findMany.mockResolvedValue([]);
    await TiresService.findAll({ category: 'ROAD' });
    expect(mockPrisma.tire.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ category: 'ROAD' }) })
    );
  });

  it('applies brand filter', async () => {
    mockPrisma.tire.findMany.mockResolvedValue([]);
    await TiresService.findAll({ brand: 'Michelin' });
    expect(mockPrisma.tire.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ brand: expect.any(Object) }) })
    );
  });
});

describe('TiresService.findMichelin', () => {
  it('returns Michelin tires', async () => {
    mockPrisma.tire.findMany.mockResolvedValue([fakeTire]);
    const result = await TiresService.findMichelin();
    expect(result).toHaveLength(1);
  });
});

describe('TiresService.findById', () => {
  it('returns tire when found', async () => {
    mockPrisma.tire.findUnique.mockResolvedValue(fakeTire);
    const result = await TiresService.findById('t1');
    expect(result).toEqual(fakeTire);
  });

  it('throws 404 when not found', async () => {
    mockPrisma.tire.findUnique.mockResolvedValue(null);
    await expect(TiresService.findById('unknown')).rejects.toMatchObject({ status: 404 });
  });
});

describe('TiresService.getBenchmark', () => {
  it('returns tire with benchmark averages', async () => {
    mockPrisma.tire.findUnique.mockResolvedValue(fakeTire);
    mockPrisma.tire.aggregate.mockResolvedValue({
      _avg: { adhesion: 8, efficiency: 7, comfort: 8, punctureResistance: 7, durability: 8, avgScore: 8, priceEur: 45 },
    });
    const result = await TiresService.getBenchmark('t1');
    expect(result.tire).toEqual(fakeTire);
    expect(result.benchmark.adhesion).toBe(8);
  });

  it('defaults null averages to 0', async () => {
    mockPrisma.tire.findUnique.mockResolvedValue(fakeTire);
    mockPrisma.tire.aggregate.mockResolvedValue({
      _avg: { adhesion: null, efficiency: null, comfort: null, punctureResistance: null, durability: null, avgScore: null, priceEur: null },
    });
    const result = await TiresService.getBenchmark('t1');
    expect(result.benchmark.adhesion).toBe(0);
  });

  it('throws 404 when tire not found', async () => {
    mockPrisma.tire.findUnique.mockResolvedValue(null);
    await expect(TiresService.getBenchmark('unknown')).rejects.toMatchObject({ status: 404 });
  });
});

describe('TiresService.getAllTerrainStats', () => {
  it('returns all terrain stats', async () => {
    mockPrisma.tireTerrainPerf.findMany.mockResolvedValue([]);
    const result = await TiresService.getAllTerrainStats();
    expect(result).toEqual([]);
  });
});

describe('TiresService.getTireTerrainStats', () => {
  it('returns stats when found', async () => {
    const stats = { tireId: 't1', avgRating: 8, tire: fakeTire };
    mockPrisma.tireTerrainPerf.findUnique.mockResolvedValue(stats);
    const result = await TiresService.getTireTerrainStats('t1');
    expect(result).toEqual(stats);
  });

  it('throws 404 when not found', async () => {
    mockPrisma.tireTerrainPerf.findUnique.mockResolvedValue(null);
    await expect(TiresService.getTireTerrainStats('unknown')).rejects.toMatchObject({ status: 404 });
  });
});
