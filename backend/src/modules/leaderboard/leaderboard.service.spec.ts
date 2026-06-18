import { LeaderboardService } from './leaderboard.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    performanceIndex: { findMany: jest.fn() },
    user: { findMany: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  performanceIndex: { findMany: jest.Mock };
  user: { findMany: jest.Mock };
};

const entry = {
  userId: 'u1',
  score: 800,
  user: {
    id: 'u1', firstName: 'Marie', lastName: 'Curie',
    club: { name: 'Club Paris', region: 'Île-de-France' },
    activities: [{ distanceKm: 500 }, { distanceKm: 300 }],
  },
};

const entryNoClub = {
  userId: 'u2',
  score: 600,
  user: {
    id: 'u2', firstName: 'Pierre', lastName: 'Dupont',
    club: null,
    activities: [],
  },
};

beforeEach(() => jest.clearAllMocks());

describe('LeaderboardService.getNational', () => {
  it('returns ranked entries with computed level', async () => {
    mockPrisma.performanceIndex.findMany.mockResolvedValue([entry]);
    const result = await LeaderboardService.getNational();
    expect(result).toHaveLength(1);
    expect(result[0].rank).toBe(1);
    expect(result[0].totalKm).toBe(800);
    expect(result[0].level).toBe('Compétiteur Expert');
  });

  it('handles entries without a club', async () => {
    mockPrisma.performanceIndex.findMany.mockResolvedValue([entryNoClub]);
    const result = await LeaderboardService.getNational();
    expect(result[0].club).toBeNull();
    expect(result[0].region).toBeNull();
    expect(result[0].totalKm).toBe(0);
  });

  it('applies level "Élite" for score >= 850', async () => {
    mockPrisma.performanceIndex.findMany.mockResolvedValue([{ ...entry, score: 900 }]);
    const result = await LeaderboardService.getNational();
    expect(result[0].level).toBe('Élite');
  });

  it('applies level "Expert" for score >= 650', async () => {
    mockPrisma.performanceIndex.findMany.mockResolvedValue([{ ...entry, score: 700 }]);
    const result = await LeaderboardService.getNational();
    expect(result[0].level).toBe('Expert');
  });

  it('applies level "Passionné" for score >= 550', async () => {
    mockPrisma.performanceIndex.findMany.mockResolvedValue([{ ...entry, score: 600 }]);
    const result = await LeaderboardService.getNational();
    expect(result[0].level).toBe('Passionné');
  });

  it('applies level "Intermédiaire" for score >= 400', async () => {
    mockPrisma.performanceIndex.findMany.mockResolvedValue([{ ...entry, score: 450 }]);
    const result = await LeaderboardService.getNational();
    expect(result[0].level).toBe('Intermédiaire');
  });

  it('applies level "Débutant" for score < 400', async () => {
    mockPrisma.performanceIndex.findMany.mockResolvedValue([{ ...entry, score: 200 }]);
    const result = await LeaderboardService.getNational();
    expect(result[0].level).toBe('Débutant');
  });

  it('uses custom limit', async () => {
    mockPrisma.performanceIndex.findMany.mockResolvedValue([]);
    await LeaderboardService.getNational(10);
    expect(mockPrisma.performanceIndex.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10 })
    );
  });
});

describe('LeaderboardService.getRegional', () => {
  it('filters by region and returns entries', async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'u1' }]);
    mockPrisma.performanceIndex.findMany.mockResolvedValue([entry]);
    const result = await LeaderboardService.getRegional('Île-de-France');
    expect(result).toHaveLength(1);
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { club: { region: { contains: 'Île-de-France', mode: 'insensitive' } } } })
    );
  });
});
