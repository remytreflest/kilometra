import { ClubsService } from './clubs.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    club: { findMany: jest.fn(), findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  club: { findMany: jest.Mock; findUnique: jest.Mock };
  user: { findUnique: jest.Mock };
};

const fakeClub = {
  id: 'c1', name: 'Club Paris', region: 'Île-de-France', department: '75',
  rank: 1, rankDelta: 0, totalKm: 10000, monthlyKm: 500, memberCount: 20,
  michelinEquipmentPct: 80, members: [],
};

beforeEach(() => jest.clearAllMocks());

describe('ClubsService.findAll', () => {
  it('returns clubs without filters', async () => {
    mockPrisma.club.findMany.mockResolvedValue([fakeClub]);
    const result = await ClubsService.findAll({});
    expect(result).toHaveLength(1);
  });

  it('applies region filter', async () => {
    mockPrisma.club.findMany.mockResolvedValue([]);
    await ClubsService.findAll({ region: 'Île-de-France' });
    expect(mockPrisma.club.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ region: expect.any(Object) }) })
    );
  });

  it('applies department filter', async () => {
    mockPrisma.club.findMany.mockResolvedValue([]);
    await ClubsService.findAll({ department: '75' });
    expect(mockPrisma.club.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ department: '75' }) })
    );
  });
});

describe('ClubsService.getMyClub', () => {
  it('returns user club', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', club: fakeClub });
    const result = await ClubsService.getMyClub('u1');
    expect(result).toEqual(fakeClub);
  });

  it('throws 404 when user has no club', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', club: null });
    await expect(ClubsService.getMyClub('u1')).rejects.toMatchObject({ status: 404 });
  });

  it('throws 404 when user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(ClubsService.getMyClub('unknown')).rejects.toMatchObject({ status: 404 });
  });
});

describe('ClubsService.findById', () => {
  it('returns club when found', async () => {
    mockPrisma.club.findUnique.mockResolvedValue(fakeClub);
    const result = await ClubsService.findById('c1');
    expect(result).toEqual(fakeClub);
  });

  it('throws 404 when not found', async () => {
    mockPrisma.club.findUnique.mockResolvedValue(null);
    await expect(ClubsService.findById('unknown')).rejects.toMatchObject({ status: 404 });
  });
});

describe('ClubsService.getRanking', () => {
  it('returns club ranking without region filter', async () => {
    mockPrisma.club.findMany.mockResolvedValue([fakeClub]);
    const result = await ClubsService.getRanking({});
    expect(result).toHaveLength(1);
  });

  it('applies region filter when provided', async () => {
    mockPrisma.club.findMany.mockResolvedValue([]);
    await ClubsService.getRanking({ region: 'Bretagne' });
    expect(mockPrisma.club.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ region: expect.any(Object) }) })
    );
  });
});
