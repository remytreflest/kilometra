import { ReviewsService } from './reviews.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    review: { findMany: jest.fn(), count: jest.fn(), aggregate: jest.fn(), create: jest.fn(), findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  review: { findMany: jest.Mock; count: jest.Mock; aggregate: jest.Mock; create: jest.Mock; findUnique: jest.Mock };
  user: { findUnique: jest.Mock };
};

const fakeReview = { id: 'r1', authorId: 'u1', authorName: 'Marie C', authorInitials: 'MC', rating: 5, comment: 'Super', tireRef: 'PR-001', type: 'user', date: new Date() };
const fakeUser = { firstName: 'Marie', lastName: 'Curie' };

beforeEach(() => jest.clearAllMocks());

describe('ReviewsService.findAll', () => {
  it('returns all reviews with no filter', async () => {
    mockPrisma.review.findMany.mockResolvedValue([fakeReview]);
    const result = await ReviewsService.findAll({});
    expect(result).toHaveLength(1);
  });

  it('applies type filter', async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);
    await ReviewsService.findAll({ type: 'influencer' });
    expect(mockPrisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ type: 'influencer' }) })
    );
  });

  it('applies tireRef filter', async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);
    await ReviewsService.findAll({ tireRef: 'PR-001' });
    expect(mockPrisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ tireRef: 'PR-001' }) })
    );
  });

  it('applies rating filter', async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);
    await ReviewsService.findAll({ rating: 4 });
    expect(mockPrisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ rating: { gte: 4 } }) })
    );
  });
});

describe('ReviewsService.getKpis', () => {
  it('returns computed kpis', async () => {
    mockPrisma.review.count
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(30)
      .mockResolvedValueOnce(80);
    mockPrisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.3 } });

    const result = await ReviewsService.getKpis();
    expect(result.total).toBe(100);
    expect(result.fiveStarPct).toBe(30);
    expect(result.verifiedPct).toBe(80);
    expect(result.avgRating).toBe(4.3);
  });

  it('handles zero total without division by zero', async () => {
    mockPrisma.review.count.mockResolvedValue(0);
    mockPrisma.review.aggregate.mockResolvedValue({ _avg: { rating: null } });

    const result = await ReviewsService.getKpis();
    expect(result.fiveStarPct).toBe(0);
    expect(result.verifiedPct).toBe(0);
    expect(result.avgRating).toBe(0);
  });
});

describe('ReviewsService.create', () => {
  it('creates review with author info', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser);
    mockPrisma.review.create.mockResolvedValue(fakeReview);
    const result = await ReviewsService.create('u1', { kmWithTire: 1000, rating: 5, comment: 'Super', tireRef: 'PR-001' });
    expect(mockPrisma.review.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ authorName: 'Marie Curie', authorInitials: 'MC' }),
      })
    );
    expect(result).toEqual(fakeReview);
  });

  it('defaults type to "user"', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser);
    mockPrisma.review.create.mockResolvedValue(fakeReview);
    await ReviewsService.create('u1', { kmWithTire: 1000, rating: 5, comment: 'Super', tireRef: 'PR-001' });
    expect(mockPrisma.review.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ type: 'user' }) })
    );
  });

  it('throws 404 when user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(ReviewsService.create('unknown', { kmWithTire: 1000, rating: 5, comment: 'x', tireRef: 'PR-001' }))
      .rejects.toMatchObject({ status: 404 });
  });
});

describe('ReviewsService.findById', () => {
  it('returns review when found', async () => {
    mockPrisma.review.findUnique.mockResolvedValue(fakeReview);
    const result = await ReviewsService.findById('r1');
    expect(result).toEqual(fakeReview);
  });

  it('throws 404 when not found', async () => {
    mockPrisma.review.findUnique.mockResolvedValue(null);
    await expect(ReviewsService.findById('unknown')).rejects.toMatchObject({ status: 404 });
  });
});
