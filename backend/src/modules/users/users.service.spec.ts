import { UsersService } from './users.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn(), update: jest.fn() },
    userBadge: { findMany: jest.fn() },
    badge: { findMany: jest.fn() },
    reward: { findMany: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock; update: jest.Mock };
  userBadge: { findMany: jest.Mock };
  badge: { findMany: jest.Mock };
  reward: { findMany: jest.Mock };
};

const badge = { id: 'b1', label: 'Gold', icon: '🥇', color: '#FFD700', earnedAt: new Date() };
const fakeUser = {
  id: 'u1',
  firstName: 'Marie',
  lastName: 'Curie',
  email: 'marie@example.com',
  password: 'hashed',
  role: 'USER',
  level: 'Expert',
  stravaConnected: false,
  memberSince: new Date(),
  club: { id: 'c1', name: 'Club Test', region: 'IDF' },
  badges: [{ badge, earnedAt: badge.earnedAt }],
  rewards: [],
};

beforeEach(() => jest.clearAllMocks());

describe('UsersService.getMe', () => {
  it('returns user without password and with initials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser);
    const result = await UsersService.getMe('u1');
    expect(result).not.toHaveProperty('password');
    expect(result.initials).toBe('MC');
  });

  it('throws 404 when user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(UsersService.getMe('unknown')).rejects.toMatchObject({ status: 404 });
  });
});

describe('UsersService.updateMe', () => {
  it('returns updated user', async () => {
    const updated = { id: 'u1', firstName: 'M', lastName: 'C', email: 'marie@example.com', stravaConnected: true, level: 'Expert', role: 'USER' };
    mockPrisma.user.update.mockResolvedValue(updated);
    const result = await UsersService.updateMe('u1', { firstName: 'M' });
    expect(result.firstName).toBe('M');
  });
});

describe('UsersService.getBadges', () => {
  it('returns mapped badges', async () => {
    mockPrisma.userBadge.findMany.mockResolvedValue([{ badge, earnedAt: badge.earnedAt }]);
    const result = await UsersService.getBadges('u1');
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('Gold');
  });
});

describe('UsersService.getRewards', () => {
  it('returns rewards', async () => {
    const rewards = [{ id: 'r1', userId: 'u1' }];
    mockPrisma.reward.findMany.mockResolvedValue(rewards);
    const result = await UsersService.getRewards('u1');
    expect(result).toEqual(rewards);
  });
});

describe('UsersService.getAllBadgesWithStatus', () => {
  const allBadges = [
    { id: 'b1', label: 'Gold', icon: '🥇', color: '#FFD700' },
    { id: 'b2', label: 'Silver', icon: '🥈', color: '#C0C0C0' },
  ];

  it('marks earned badges with unlocked:true and their earnedAt date', async () => {
    const earnedAt = new Date('2024-01-01');
    mockPrisma.badge.findMany.mockResolvedValue(allBadges);
    mockPrisma.userBadge.findMany.mockResolvedValue([{ badgeId: 'b1', earnedAt }]);

    const result = await UsersService.getAllBadgesWithStatus('u1');

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 'b1', unlocked: true, earnedAt });
    expect(result[1]).toMatchObject({ id: 'b2', unlocked: false, earnedAt: null });
  });

  it('returns all badges as unlocked:false when user has no badges', async () => {
    mockPrisma.badge.findMany.mockResolvedValue(allBadges);
    mockPrisma.userBadge.findMany.mockResolvedValue([]);

    const result = await UsersService.getAllBadgesWithStatus('u1');

    expect(result.every((b) => b.unlocked === false)).toBe(true);
    expect(result.every((b) => b.earnedAt === null)).toBe(true);
  });
});
