import prisma from '../../config/database';
import { ReviewType } from '@prisma/client';

export class ReviewsService {
  static async findAll(filters: { type?: string; tireRef?: string; rating?: number }) {
    return prisma.review.findMany({
      where: {
        ...(filters.type && { type: filters.type as ReviewType }),
        ...(filters.tireRef && { tireRef: filters.tireRef }),
        ...(filters.rating && { rating: { gte: filters.rating } }),
      },
      orderBy: { date: 'desc' },
    });
  }

  static async getKpis() {
    const [total, aggregates, recommended, verified] = await Promise.all([
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } }),
      prisma.review.count({ where: { recommended: true } }),
      prisma.review.count({ where: { isVerified: true } }),
    ]);
    return {
      total,
      avgRating: Math.round((aggregates._avg.rating ?? 0) * 10) / 10,
      recommendationPct: total > 0 ? Math.round((recommended / total) * 100) : 0,
      verifiedPct: total > 0 ? Math.round((verified / total) * 100) : 0,
    };
  }

  static async create(authorId: string, data: {
    kmWithTire: number; rating: number; comment: string; tireRef: string;
    recommended?: boolean; sponsoredContent?: string; followerCount?: number; platform?: string; type?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id: authorId }, select: { firstName: true, lastName: true } });
    if (!user) throw Object.assign(new Error('Utilisateur introuvable'), { status: 404 });
    return prisma.review.create({
      data: {
        ...data,
        authorId,
        authorName: `${user.firstName} ${user.lastName}`,
        authorInitials: `${user.firstName[0]}${user.lastName[0]}`,
        recommended: data.recommended ?? false,
        date: new Date(),
        type: (data.type as ReviewType) ?? 'user',
      },
    });
  }

  static async findById(id: string) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throw Object.assign(new Error('Avis introuvable'), { status: 404 });
    return review;
  }
}
