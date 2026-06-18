import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BadgeComponent } from '../badge/badge.component';
import { ProgressTrackComponent } from '../progress-track/progress-track.component';
import { TesterReward } from '../../models/tester.model';

@Component({
  selector: 'app-reward-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, BadgeComponent, ProgressTrackComponent],
  template: `
    <div class="reward-card" [class.unlocked]="reward.status === 'unlocked'">
      @if (reward.status === 'unlocked') {
        <app-badge variant="success">Débloqué</app-badge>
      } @else if (reward.status === 'in-progress') {
        <app-badge variant="blue">À {{ reward.requiredKm | number }} km</app-badge>
      } @else {
        <app-badge variant="grey">À {{ reward.requiredKm | number }} km</app-badge>
      }
      <div class="reward-icon" aria-hidden="true">
        <mat-icon>{{ reward.icon }}</mat-icon>
      </div>
      <h4>{{ reward.title }}</h4>
      <p class="reward-desc">{{ reward.description }}</p>
      @if (reward.status === 'unlocked' && reward.couponCode) {
        <button mat-stroked-button color="primary" class="cta">Utiliser mon coupon</button>
      }
      @if (reward.status !== 'unlocked' && reward.progressPct !== undefined) {
        <app-progress-track [value]="reward.progressPct" class="reward-progress" />
      }
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .reward-card {
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-5;
      box-shadow: $elevation-1;
      display: flex;
      flex-direction: column;
      gap: $space-2;
      &.unlocked {
        border-color: $color-success;
        box-shadow: 0 0 0 1px #{$color-success}, #{$elevation-1};
      }
    }
    .reward-icon {
      width: 48px; height: 48px;
      border-radius: $radius-md;
      background: $color-blue-100;
      color: $color-blue-700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: $space-2;
      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }
    h4 { font-size: $text-h4; }
    .reward-desc { font-size: $text-small; color: $text-secondary; }
    .cta { margin-top: $space-2; }
    .reward-progress { margin-top: $space-2; }
  `]
})
export class RewardCardComponent {
  @Input({ required: true }) reward!: TesterReward;
}
