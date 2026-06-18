import { PerformanceService } from './performance.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    performanceIndex: { findUnique: jest.fn() },
    user: { count: jest.fn() },
    club: { count: jest.fn() },
    activity: { aggregate: jest.fn() },
    review: { aggregate: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  performanceIndex: { findUnique: jest.Mock };
  user: { count: jest.Mock };
  club: { count: jest.Mock };
  activity: { aggregate: jest.Mock };
  review: { aggregate: jest.Mock };
};

const fakePerf = {
  id: 'p1', userId: 'u1', score: 750,
  user: { firstName: 'Marie', lastName: 'Curie' },
};

beforeEach(() => jest.clearAllMocks());

describe('PerformanceService.getMyPerformance', () => {
  it('returns performance index', async () => {
    mockPrisma.performanceIndex.findUnique.mockResolvedValue(fakePerf);
    const result = await PerformanceService.getMyPerformance('u1');
    expect(result).toEqual(fakePerf);
  });

  it('throws 404 when not found', async () => {
    mockPrisma.performanceIndex.findUnique.mockResolvedValue(null);
    await expect(PerformanceService.getMyPerformance('unknown')).rejects.toMatchObject({ status: 404 });
  });
});

describe('PerformanceService.getCommunityKpis', () => {
  it('returns community kpis with valid data', async () => {
    mockPrisma.user.count.mockResolvedValue(100);
    mockPrisma.club.count.mockResolvedValue(10);
    mockPrisma.activity.aggregate.mockResolvedValue({ _sum: { distanceKm: 50000 } });
    mockPrisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 } });

    const result = await PerformanceService.getCommunityKpis();

    expect(result.activeCyclists).toBe(100);
    expect(result.registeredClubs).toBe(10);
    expect(result.analyzedKm).toBe(50000);
    expect(result.avgRating).toBe(4.5);
  });

  it('handles null aggregates gracefully', async () => {
    mockPrisma.user.count.mockResolvedValue(0);
    mockPrisma.club.count.mockResolvedValue(0);
    mockPrisma.activity.aggregate.mockResolvedValue({ _sum: { distanceKm: null } });
    mockPrisma.review.aggregate.mockResolvedValue({ _avg: { rating: null } });

    const result = await PerformanceService.getCommunityKpis();

    expect(result.analyzedKm).toBe(0);
    expect(result.avgRating).toBe(0);
  });
});
