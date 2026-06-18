import { ActivitiesService } from './activities.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    activity: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  activity: { findMany: jest.Mock; findFirst: jest.Mock; create: jest.Mock };
};

const fakeActivity = {
  id: 'a1', userId: 'u1', name: 'Sortie vélo', date: new Date(), distanceKm: 50,
  elevationM: 300, avgSpeedKmh: 25, maxSpeedKmh: 45, durationMin: 120,
  type: 'road', location: 'Paris', mpiImpact: 5,
};

beforeEach(() => jest.clearAllMocks());

describe('ActivitiesService.getUserActivities', () => {
  it('returns activities without limit', async () => {
    mockPrisma.activity.findMany.mockResolvedValue([fakeActivity]);
    const result = await ActivitiesService.getUserActivities('u1');
    expect(result).toHaveLength(1);
  });

  it('passes take option when limit is provided', async () => {
    mockPrisma.activity.findMany.mockResolvedValue([fakeActivity]);
    await ActivitiesService.getUserActivities('u1', 3);
    expect(mockPrisma.activity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 3 })
    );
  });
});

describe('ActivitiesService.getRecent', () => {
  it('defaults to limit 5', async () => {
    mockPrisma.activity.findMany.mockResolvedValue([]);
    await ActivitiesService.getRecent('u1');
    expect(mockPrisma.activity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    );
  });

  it('uses provided limit', async () => {
    mockPrisma.activity.findMany.mockResolvedValue([]);
    await ActivitiesService.getRecent('u1', 10);
    expect(mockPrisma.activity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10 })
    );
  });
});

describe('ActivitiesService.getById', () => {
  it('returns activity when found', async () => {
    mockPrisma.activity.findFirst.mockResolvedValue(fakeActivity);
    const result = await ActivitiesService.getById('a1', 'u1');
    expect(result).toEqual(fakeActivity);
  });

  it('throws 404 when not found', async () => {
    mockPrisma.activity.findFirst.mockResolvedValue(null);
    await expect(ActivitiesService.getById('unknown', 'u1')).rejects.toMatchObject({ status: 404 });
  });
});

describe('ActivitiesService.create', () => {
  it('creates and returns activity with default mpiImpact', async () => {
    mockPrisma.activity.create.mockResolvedValue(fakeActivity);
    const result = await ActivitiesService.create('u1', {
      name: 'Sortie', date: '2024-01-01', distanceKm: 50, elevationM: 300,
      avgSpeedKmh: 25, maxSpeedKmh: 45, durationMin: 120, type: 'road', location: 'Paris',
    });
    expect(mockPrisma.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ mpiImpact: 0 }) })
    );
    expect(result).toEqual(fakeActivity);
  });

  it('uses provided mpiImpact', async () => {
    mockPrisma.activity.create.mockResolvedValue(fakeActivity);
    await ActivitiesService.create('u1', {
      name: 'Sortie', date: '2024-01-01', distanceKm: 50, elevationM: 300,
      avgSpeedKmh: 25, maxSpeedKmh: 45, durationMin: 120, type: 'road', location: 'Paris',
      mpiImpact: 10,
    });
    expect(mockPrisma.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ mpiImpact: 10 }) })
    );
  });
});
