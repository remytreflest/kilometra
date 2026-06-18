import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReviewService } from './review.service';
import { ApiService } from './api.service';
import { Review } from '../../shared/models/review.model';

const mockReviews: Review[] = [
  {
    id: 'r1', authorInitials: 'CD', authorName: 'Camille D.', kmWithTire: 1500,
    rating: 5, comment: 'Excellent', isVerified: true,
    date: new Date('2024-01-01'), type: 'user', tireRef: 'p1',
  },
];

const mockBackendKpis = {
  total: 1200, avgRating: 4.6, recommendationPct: 92, verifiedPct: 87,
};

describe('ReviewService', () => {
  let service: ReviewService;
  let apiService: any;

  beforeEach(() => {
    apiService = { get: jest.fn().mockReturnValue(of(mockReviews)) };
    TestBed.configureTestingModule({
      providers: [ReviewService, { provide: ApiService, useValue: apiService }],
    });
    service = TestBed.inject(ReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getReviews() should call /reviews with no params when no type', () => {
    service.getReviews().subscribe(res => expect(res).toEqual(mockReviews));
    expect(apiService.get).toHaveBeenCalledWith('/reviews', undefined);
  });

  it('getReviews() should pass type param when provided', () => {
    service.getReviews('influencer').subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/reviews', { type: 'influencer' });
  });

  it('getReviewsByTire() should call /reviews with tireRef param', () => {
    service.getReviewsByTire('power-road').subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/reviews', { tireRef: 'power-road' });
  });

  it('getKpis() should map backend fields to ReviewKpis shape', () => {
    apiService.get.mockReturnValue(of(mockBackendKpis));
    service.getKpis().subscribe(res => {
      expect(res).toEqual({
        avgRating: 4.6,
        totalReviews: 1200,
        recommendationPct: 92,
        verifiedPct: 87,
      });
    });
    expect(apiService.get).toHaveBeenCalledWith('/reviews/kpis');
  });
});
