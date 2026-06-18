import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewCardComponent } from './review-card.component';
import { Review } from '../../models/review.model';

const mockUserReview: Review = {
  id: 'r1',
  authorInitials: 'CD',
  authorName: 'Camille D.',
  kmWithTire: 1500,
  rating: 5,
  comment: 'Excellent pneu, très bon grip.',
  isVerified: true,
  date: new Date('2024-01-01'),
  type: 'user',
  tireRef: 'Power Road TLR',
};

const mockInfluencerReview: Review = {
  id: 'r2',
  authorInitials: 'MV',
  authorName: 'Marc V.',
  kmWithTire: 3000,
  rating: 4,
  comment: 'Incroyable grip en descente.',
  isVerified: false,
  date: new Date('2024-03-01'),
  type: 'influencer',
  tireRef: 'Power Road TLR',
  platform: 'YouTube',
  followerCount: 50000,
  sponsoredContent: true,
};

describe('ReviewCardComponent', () => {
  let fixture: ComponentFixture<ReviewCardComponent>;
  let component: ReviewCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCardComponent],
    })
      .overrideComponent(ReviewCardComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ReviewCardComponent);
    component = fixture.componentInstance;
    component.review = mockUserReview;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should accept review input', () => {
    expect(component.review).toEqual(mockUserReview);
  });

  it('should expose 5 stars', () => {
    expect(component.stars).toHaveLength(5);
    expect(component.stars).toEqual([0, 1, 2, 3, 4]);
  });

  it('should accept an influencer review', () => {
    component.review = mockInfluencerReview;
    fixture.detectChanges();
    expect(component.review.type).toBe('influencer');
    expect(component.review.platform).toBe('YouTube');
    expect(component.review.followerCount).toBe(50000);
  });

  it('should accept a review with sponsoredContent', () => {
    component.review = mockInfluencerReview;
    fixture.detectChanges();
    expect(component.review.sponsoredContent).toBe(true);
  });
});
