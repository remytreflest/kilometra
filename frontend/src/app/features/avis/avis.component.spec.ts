import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { AvisComponent } from './avis.component';
import { ReviewService } from '../../core/services/review.service';
import { Review, ReviewKpis } from '../../shared/models/review.model';

const mockKpis: ReviewKpis = {
  avgRating: 4.6,
  totalReviews: 1200,
  recommendationPct: 92,
  verifiedPct: 87,
};

const mockUserReviews: Review[] = [
  {
    id: 'r1', authorInitials: 'CD', authorName: 'Camille D.', kmWithTire: 1500,
    rating: 5, comment: 'Excellent', isVerified: true,
    date: new Date('2024-01-01'), type: 'user', tireRef: 'p1',
  },
  {
    id: 'r2', authorInitials: 'PL', authorName: 'Pierre L.', kmWithTire: 800,
    rating: 3, comment: 'Correct', isVerified: true,
    date: new Date('2024-02-01'), type: 'user', tireRef: 'p1',
  },
];

const mockInfluencerReviews: Review[] = [
  {
    id: 'r3', authorInitials: 'MV', authorName: 'Marc V.', kmWithTire: 3000,
    rating: 5, comment: 'Incroyable grip', isVerified: false,
    date: new Date('2024-03-01'), type: 'influencer', tireRef: 'p1',
    platform: 'YouTube', followerCount: 50000,
  },
];

describe('AvisComponent', () => {
  let fixture: ComponentFixture<AvisComponent>;
  let component: AvisComponent;
  let reviewService: any;

  beforeEach(async () => {
    reviewService = {
      getKpis:    jest.fn().mockReturnValue(of(mockKpis)),
      getReviews: jest.fn().mockImplementation((type: string) =>
        of(type === 'user' ? mockUserReviews : mockInfluencerReviews)
      ),
    };

    await TestBed.configureTestingModule({
      imports: [AvisComponent],
      providers: [{ provide: ReviewService, useValue: reviewService }],
    })
      .overrideComponent(AvisComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AvisComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call service methods on init', () => {
    fixture.detectChanges();
    expect(reviewService.getKpis).toHaveBeenCalled();
    expect(reviewService.getReviews).toHaveBeenCalledWith('user');
    expect(reviewService.getReviews).toHaveBeenCalledWith('influencer');
  });

  it('should populate kpis and reviews after init', () => {
    fixture.detectChanges();
    expect(component.kpis).toEqual(mockKpis);
    expect(component.userReviews).toEqual(mockUserReviews);
    expect(component.influencerReviews).toEqual(mockInfluencerReviews);
  });

  it('should initialise activeFilter to "all"', () => {
    expect(component.activeFilter).toBe('all');
  });

  it('onFilterChange() should update activeFilter', () => {
    fixture.detectChanges();
    component.onFilterChange('influencer');
    expect(component.activeFilter).toBe('influencer');
  });

  it('onFilterChange("five") should keep only 5-star user reviews', () => {
    fixture.detectChanges();
    component.onFilterChange('five');
    expect(component.userReviews.every(r => r.rating === 5)).toBe(true);
    expect(component.userReviews.length).toBe(1);
  });

  it('onFilterChange("user") should reload full review lists', () => {
    fixture.detectChanges();
    reviewService.getReviews.mockClear();
    component.onFilterChange('user');
    expect(reviewService.getReviews).toHaveBeenCalledWith('user');
    expect(reviewService.getReviews).toHaveBeenCalledWith('influencer');
  });

  it('should expose 4 filter chips', () => {
    expect(component.filters.length).toBe(4);
  });
});
