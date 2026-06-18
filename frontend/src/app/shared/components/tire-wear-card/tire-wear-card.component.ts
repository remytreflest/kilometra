import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../badge/badge.component';
import { ProgressTrackComponent } from '../progress-track/progress-track.component';
import { TireWear } from '../../models/tire.model';

@Component({
  selector: 'app-tire-wear-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink, BadgeComponent, ProgressTrackComponent],
  template: `
    <div class="tire-wear-card">
      <div class="card-header">
        <div>
          <p class="position-label">Pneu {{ wear.position === 'front' ? 'avant' : 'arrière' }}</p>
          <h4>{{ wear.tire.name }}</h4>
        </div>
        <app-badge [variant]="urgencyVariant">
          {{ wear.estimatedDaysLeft }} j. avant remplacement
        </app-badge>
      </div>
      <app-progress-track
        [value]="wear.wearPercentage"
        [variant]="urgencyVariant === 'danger' ? 'yellow' : urgencyVariant === 'warning' ? 'yellow' : 'blue'"
        [height]="14"
        [tread]="true"
      />
      <div class="wear-footer">
        <span class="wear-label">Usure</span>
        <span class="wear-value">{{ wear.wearPercentage }}%</span>
      </div>
      <p class="wear-note">
        Estimation basée sur {{ wear.kmSinceInstall | number }} km parcourus depuis l'installation.
      </p>
      <button mat-stroked-button color="primary" routerLink="/benchmark" class="cta-btn">
        Voir les recommandations
      </button>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .tire-wear-card {
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-5;
      box-shadow: $elevation-1;
      display: flex;
      flex-direction: column;
      gap: $space-3;
    }
    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: $space-3;
      flex-wrap: wrap;
    }
    .position-label {
      font-size: $text-caption;
      color: $text-secondary;
      font-weight: $weight-semibold;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: $space-1;
    }
    .wear-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $space-1;
    }
    .wear-label { font-size: $text-caption; color: $text-secondary; }
    .wear-value { font-size: $text-small; font-weight: $weight-bold; color: $text-primary; }
    .wear-note  { font-size: $text-caption; color: $text-secondary; }
    .cta-btn    { align-self: flex-start; }
  `]
})
export class TireWearCardComponent {
  @Input({ required: true }) wear!: TireWear;

  get urgencyVariant(): 'success' | 'warning' | 'danger' {
    if (this.wear.wearPercentage < 60) return 'success';
    if (this.wear.wearPercentage < 80) return 'warning';
    return 'danger';
  }
}
