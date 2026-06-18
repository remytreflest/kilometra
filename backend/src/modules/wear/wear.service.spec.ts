import { WearService } from './wear.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    tire: { findUnique: jest.fn() },
    tireWear: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  tire: { findUnique: jest.Mock };
  tireWear: { findMany: jest.Mock; findFirst: jest.Mock; create: jest.Mock; update: jest.Mock };
};

const fakeTire = { id: 't1', reference: 'PR-001', name: 'PowerRoad' };
const fakeWear = {
  id: 'w1', userId: 'u1', tireId: 't1', tireRef: 'PR-001', tireName: 'PowerRoad',
  installedAt: new Date(), currentKm: 1000, estimatedMaxKm: 5000, wearPct: 20, status: 'good',
};

beforeEach(() => jest.clearAllMocks());

describe('WearService.getUserWear', () => {
  it('returns user wear records', async () => {
    mockPrisma.tireWear.findMany.mockResolvedValue([fakeWear]);
    const result = await WearService.getUserWear('u1');
    expect(result).toHaveLength(1);
  });
});

describe('WearService.createWear', () => {
  it('creates wear with status "good" when wearPct < 60', async () => {
    mockPrisma.tire.findUnique.mockResolvedValue(fakeTire);
    mockPrisma.tireWear.create.mockResolvedValue({ ...fakeWear, wearPct: 20, status: 'good' });
    const result = await WearService.createWear('u1', {
      tireId: 't1', installedAt: '2024-01-01', currentKm: 1000, estimatedMaxKm: 5000,
    });
    expect(mockPrisma.tireWear.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ wearPct: 20, status: 'good' }) })
    );
    expect(result.status).toBe('good');
  });

  it('creates wear with status "warning" when wearPct >= 60', async () => {
    mockPrisma.tire.findUnique.mockResolvedValue(fakeTire);
    mockPrisma.tireWear.create.mockResolvedValue({ ...fakeWear, wearPct: 65, status: 'warning' });
    await WearService.createWear('u1', {
      tireId: 't1', installedAt: '2024-01-01', currentKm: 3250, estimatedMaxKm: 5000,
    });
    expect(mockPrisma.tireWear.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ wearPct: 65, status: 'warning' }) })
    );
  });

  it('creates wear with status "critical" when wearPct >= 85', async () => {
    mockPrisma.tire.findUnique.mockResolvedValue(fakeTire);
    mockPrisma.tireWear.create.mockResolvedValue({ ...fakeWear, wearPct: 90, status: 'critical' });
    await WearService.createWear('u1', {
      tireId: 't1', installedAt: '2024-01-01', currentKm: 4500, estimatedMaxKm: 5000,
    });
    expect(mockPrisma.tireWear.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ wearPct: 90, status: 'critical' }) })
    );
  });

  it('throws 404 when tire not found', async () => {
    mockPrisma.tire.findUnique.mockResolvedValue(null);
    await expect(
      WearService.createWear('u1', { tireId: 'unknown', installedAt: '2024-01-01', currentKm: 1000, estimatedMaxKm: 5000 })
    ).rejects.toMatchObject({ status: 404 });
  });
});

describe('WearService.updateWear', () => {
  it('updates wear and recalculates status', async () => {
    mockPrisma.tireWear.findFirst.mockResolvedValue(fakeWear);
    mockPrisma.tireWear.update.mockResolvedValue({ ...fakeWear, currentKm: 2000, wearPct: 40, status: 'good' });
    const result = await WearService.updateWear('w1', 'u1', { currentKm: 2000 });
    expect(mockPrisma.tireWear.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ currentKm: 2000, wearPct: 40, status: 'good' }) })
    );
    expect(result.status).toBe('good');
  });

  it('updates wear with status "warning" when wearPct >= 60', async () => {
    mockPrisma.tireWear.findFirst.mockResolvedValue(fakeWear);
    mockPrisma.tireWear.update.mockResolvedValue({ ...fakeWear, currentKm: 3250, wearPct: 65, status: 'warning' });
    await WearService.updateWear('w1', 'u1', { currentKm: 3250 });
    expect(mockPrisma.tireWear.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ wearPct: 65, status: 'warning' }) })
    );
  });

  it('updates wear with status "critical" when wearPct >= 85', async () => {
    mockPrisma.tireWear.findFirst.mockResolvedValue(fakeWear);
    mockPrisma.tireWear.update.mockResolvedValue({ ...fakeWear, currentKm: 4500, wearPct: 90, status: 'critical' });
    await WearService.updateWear('w1', 'u1', { currentKm: 4500 });
    expect(mockPrisma.tireWear.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ wearPct: 90, status: 'critical' }) })
    );
  });

  it('throws 404 when wear record not found', async () => {
    mockPrisma.tireWear.findFirst.mockResolvedValue(null);
    await expect(WearService.updateWear('unknown', 'u1', { currentKm: 1000 })).rejects.toMatchObject({ status: 404 });
  });
});
