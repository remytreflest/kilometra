import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import { JWT_SECRET } from '../../config/env';

function signToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw Object.assign(new Error('Email ou mot de passe incorrect'), { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw Object.assign(new Error('Email ou mot de passe incorrect'), { status: 401 });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
  }

  static async register(data: { firstName: string; lastName: string; email: string; password: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw Object.assign(new Error('Cet email est déjà utilisé'), { status: 409 });

    const password = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { firstName: data.firstName, lastName: data.lastName, email: data.email, password },
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, level: true, memberSince: true, stravaConnected: true },
    });
    if (!user) throw Object.assign(new Error('Utilisateur introuvable'), { status: 404 });
    return user;
  }
}
