import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Review, ReviewKpis } from '../../shared/models/review.model';

interface BackendKpis {
  total: number;
  avgRating: number;
  recommendationPct: number;
  verifiedPct: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private api: ApiService) {}

  getReviews(type?: 'user' | 'influencer'): Observable<Review[]> {
    const params = type ? { type } : undefined;
    return this.api.get<Review[]>('/reviews', params);
  }

  getReviewsByTire(tireRef: string): Observable<Review[]> {
    return this.api.get<Review[]>('/reviews', { tireRef });
  }

  getKpis(): Observable<ReviewKpis> {
    return this.api.get<BackendKpis>('/reviews/kpis').pipe(
      map(b => ({
        avgRating: b.avgRating,
        totalReviews: b.total,
        recommendationPct: b.recommendationPct,
        verifiedPct: b.verifiedPct,
      }))
    );
  }
}
