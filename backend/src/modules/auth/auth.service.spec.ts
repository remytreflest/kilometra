import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import prisma from '../../config/database';

const mockPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock; create: jest.Mock };
};
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

const fakeUser = {
  id: 'user-1',
  email: 'test@example.com',
  password: 'hashed',
  firstName: 'Jean',
  lastName: 'Dupont',
  role: 'USER',
  level: 'Intermédiaire',
  memberSince: new Date(),
  stravaConnected: false,
};

beforeEach(() => jest.clearAllMocks());

describe('AuthService.login', () => {
  it('returns token and user on valid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser);
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
    (mockJwt.sign as jest.Mock).mockReturnValue('signed-token');

    const result = await AuthService.login('test@example.com', 'password');

    expect(result.token).toBe('signed-token');
    expect(result.user.email).toBe('test@example.com');
  });

  it('throws 401 when user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(AuthService.login('x@x.com', 'pass')).rejects.toMatchObject({ status: 401 });
  });

  it('throws 401 when password is invalid', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser);
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(AuthService.login('test@example.com', 'wrong')).rejects.toMatchObject({ status: 401 });
  });
});

describe('AuthService.register', () => {
  it('creates user and returns token', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
    mockPrisma.user.create.mockResolvedValue(fakeUser);
    (mockJwt.sign as jest.Mock).mockReturnValue('signed-token');

    const result = await AuthService.register({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'new@example.com',
      password: 'secure',
    });

    expect(result.token).toBe('signed-token');
    expect(result.user.email).toBe('test@example.com');
  });

  it('throws 409 when email already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser);

    await expect(
      AuthService.register({ firstName: 'A', lastName: 'B', email: 'test@example.com', password: 'pw' })
    ).rejects.toMatchObject({ status: 409 });
  });
});

describe('AuthService.getMe', () => {
  it('returns user data', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser);
    const result = await AuthService.getMe('user-1');
    expect(result).toEqual(fakeUser);
  });

  it('throws 404 when user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(AuthService.getMe('unknown')).rejects.toMatchObject({ status: 404 });
  });
});
