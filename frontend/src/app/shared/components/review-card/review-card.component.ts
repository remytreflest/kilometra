import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';
import { MatIconModule } from '@angular/material/icon';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent, MatIconModule],
  template: `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-id">
          <span class="reviewer-avatar">{{ review.authorInitials }}</span>
          <div>
            <h4>{{ review.authorName }}</h4>
            <span class="reviewer-meta">
              {{ review.type === 'influencer' ? review.platform : (review.kmWithTire + ' km parcourus') }}
              @if (review.followerCount) {
                · {{ review.followerCount | number }} abonnés
              }
            </span>
          </div>
        </div>
        <div class="review-badges">
          @if (review.isVerified) {
            <app-badge variant="success">Achat vérifié</app-badge>
          }
          @if (review.sponsoredContent) {
            <app-badge variant="blue">Contenu sponsorisé</app-badge>
          }
        </div>
      </div>
      <div class="star-row" [attr.aria-label]="'Note ' + review.rating + ' sur 5'">
        @for (star of stars; track $index) {
          <mat-icon [class.filled]="$index < review.rating">star</mat-icon>
        }
      </div>
      <p class="review-comment">{{ review.comment }}</p>
      <span class="review-tire">{{ review.tireRef }}</span>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .review-card {
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-5;
      box-shadow: $elevation-1;
    }
    .review-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: $space-3;
    }
    .reviewer-id {
      display: flex;
      align-items: center;
      gap: $space-3;
    }
    .reviewer-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      flex-shrink: 0;
      background: $color-blue-100;
      color: $color-blue-700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: $weight-bold;
      font-size: $text-small;
      font-family: $font-display;
    }
    h4 { font-size: 0.95rem; }
    .reviewer-meta { font-size: $text-caption; color: $text-secondary; }
    .review-badges { display: flex; gap: $space-2; flex-wrap: wrap; }
    .star-row {
      display: flex;
      gap: 2px;
      margin-top: $space-3;
      mat-icon { font-size: 18px; width: 18px; height: 18px; color: $color-grey-300; }
      mat-icon.filled { color: $color-yellow-600; }
    }
    .review-comment {
      font-size: $text-small;
      margin-top: $space-2;
      line-height: 1.6;
      color: $text-primary;
    }
    .review-tire {
      display: inline-block;
      margin-top: $space-3;
      font-size: $text-caption;
      color: $text-secondary;
      font-weight: $weight-semibold;
    }
  `]
})
export class ReviewCardComponent {
  @Input({ required: true }) review!: Review;
  stars = [0, 1, 2, 3, 4];
}
