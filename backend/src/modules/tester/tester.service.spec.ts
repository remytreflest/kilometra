import { TesterService } from './tester.service';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    testerProgress: { findUnique: jest.fn() },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  testerProgress: { findUnique: jest.Mock };
};

const fakeProgress = {
  id: 'tp1',
  userId: 'u1',
  level: 2,
  points: 150,
  rewards: [{ id: 'tr1', label: 'Premier test' }, { id: 'tr2', label: 'Expert' }],
};

beforeEach(() => jest.clearAllMocks());

describe('TesterService.getMyProgress', () => {
  it('returns progress with rewards', async () => {
    mockPrisma.testerProgress.findUnique.mockResolvedValue(fakeProgress);
    const result = await TesterService.getMyProgress('u1');
    expect(result).toEqual(fakeProgress);
  });

  it('returns null when progress not found', async () => {
    mockPrisma.testerProgress.findUnique.mockResolvedValue(null);
    const result = await TesterService.getMyProgress('unknown');
    expect(result).toBeNull();
  });
});

describe('TesterService.getMyRewards', () => {
  it('returns rewards array from progress', async () => {
    mockPrisma.testerProgress.findUnique.mockResolvedValue(fakeProgress);
    const result = await TesterService.getMyRewards('u1');
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe('Premier test');
  });

  it('throws 404 when progress not found', async () => {
    mockPrisma.testerProgress.findUnique.mockResolvedValue(null);
    await expect(TesterService.getMyRewards('unknown')).rejects.toMatchObject({ status: 404 });
  });
});
