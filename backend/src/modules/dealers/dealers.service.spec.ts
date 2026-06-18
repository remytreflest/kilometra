import { DealersService } from './dealers.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    dealer: { findMany: jest.fn(), findUnique: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  dealer: { findMany: jest.Mock; findUnique: jest.Mock };
};

const makeDealer = (id: string, lat: number, lng: number) => ({
  id, name: `Dealer ${id}`, lat, lng,
  acceptsCoupon: true, isOpen: true, stockStatus: 'available',
});

beforeEach(() => jest.clearAllMocks());

describe('DealersService.findAll', () => {
  it('returns dealers with null distanceKm when no coordinates given', async () => {
    mockPrisma.dealer.findMany.mockResolvedValue([makeDealer('d1', 48.8566, 2.3522)]);
    const result = await DealersService.findAll({});
    expect(result[0].distanceKm).toBeNull();
  });

  it('adds and sorts by distanceKm when coordinates are given', async () => {
    const d1 = makeDealer('d1', 48.8566, 2.3522);
    const d2 = makeDealer('d2', 45.7640, 4.8357);
    mockPrisma.dealer.findMany.mockResolvedValue([d1, d2]);
    const result = await DealersService.findAll({ lat: 48.8566, lng: 2.3522 });
    expect(result[0].distanceKm).toBe(0);
    expect(result[0].id).toBe('d1');
    expect((result[1].distanceKm as number)).toBeGreaterThan(0);
  });

  it('applies coupon filter', async () => {
    mockPrisma.dealer.findMany.mockResolvedValue([]);
    await DealersService.findAll({ coupon: true });
    expect(mockPrisma.dealer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ acceptsCoupon: true }) })
    );
  });

  it('applies open filter', async () => {
    mockPrisma.dealer.findMany.mockResolvedValue([]);
    await DealersService.findAll({ open: false });
    expect(mockPrisma.dealer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isOpen: false }) })
    );
  });

  it('applies stock filter', async () => {
    mockPrisma.dealer.findMany.mockResolvedValue([]);
    await DealersService.findAll({ stock: 'available' });
    expect(mockPrisma.dealer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ stockStatus: 'available' }) })
    );
  });
});

describe('DealersService.findById', () => {
  it('returns dealer when found', async () => {
    const dealer = makeDealer('d1', 48.8566, 2.3522);
    mockPrisma.dealer.findUnique.mockResolvedValue(dealer);
    const result = await DealersService.findById('d1');
    expect(result).toEqual(dealer);
  });

  it('throws 404 when not found', async () => {
    mockPrisma.dealer.findUnique.mockResolvedValue(null);
    await expect(DealersService.findById('unknown')).rejects.toMatchObject({ status: 404 });
  });
});
