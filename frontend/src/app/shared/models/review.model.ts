export type ReviewType = 'user' | 'influencer';

export interface Review {
  id: string;
  authorInitials: string;
  authorName: string;
  kmWithTire: number;
  rating: number;        // 1–5
  comment: string;
  isVerified: boolean;
  date: Date;
  type: ReviewType;
  tireRef: string;
  sponsoredContent?: boolean;
  followerCount?: number;  // pour les influenceurs
  platform?: string;       // YouTube, Instagram…
}

export interface ReviewKpis {
  avgRating: number;
  totalReviews: number;
  recommendationPct: number;
  verifiedPct: number;
}
