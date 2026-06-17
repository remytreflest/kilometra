import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="activity-card">
      <div class="activity-icon" aria-hidden="true">
        <mat-icon>{{ typeIcon }}</mat-icon>
      </div>
      <div class="activity-info">
        <div class="card-row">
          <h4>{{ activity.name }}</h4>
          <span class="activity-date">{{ activity.date | date:'EEE d MMM':'':'fr' }}</span>
        </div>
        <div class="activity-stats">
          <span><strong>{{ activity.distanceKm }} km</strong> distance</span>
          <span><strong>{{ activity.elevationM }} m</strong> dénivelé</span>
          <span><strong>{{ activity.avgSpeedKmh }} km/h</strong> vitesse moy.</span>
          @if (activity.mpiImpact !== 0) {
            <span class="mpi-delta" [class.pos]="activity.mpiImpact > 0">
              <mat-icon>{{ activity.mpiImpact > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              {{ activity.mpiImpact > 0 ? '+' : '' }}{{ activity.mpiImpact }} MPI
            </span>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .activity-card {
      display: flex;
      gap: $space-4;
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-4;
      box-shadow: $elevation-1;
    }
    .activity-icon {
      width: 44px; height: 44px;
      border-radius: 50%;
      flex-shrink: 0;
      background: $color-blue-100;
      color: $color-blue-700;
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon { font-size: 22px; width: 22px; height: 22px; }
    }
    .activity-info { flex: 1; min-width: 0; }
    .card-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: $space-3;
      flex-wrap: wrap;
    }
    h4 { font-size: $text-body; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .activity-date { font-size: $text-caption; color: $text-secondary; flex-shrink: 0; }
    .activity-stats {
      display: flex;
      gap: $space-4;
      flex-wrap: wrap;
      margin-top: $space-2;
      font-size: $text-caption;
      color: $text-secondary;
      strong { color: $text-primary; font-family: $font-display; font-weight: $weight-bold; }
    }
    .mpi-delta {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-weight: $weight-bold;
      font-size: $text-caption;
      color: $color-danger;
      mat-icon { font-size: 12px; width: 12px; height: 12px; }
      &.pos { color: $color-success; }
    }
  `]
})
export class ActivityCardComponent {
  @Input({ required: true }) activity!: Activity;

  get typeIcon(): string {
    const map: Record<string, string> = {
      'route': 'directions_bike',
      'vtt': 'terrain',
      'fractionné': 'bolt',
      'sortie longue': 'route',
      'gravel': 'forest',
    };
    return map[this.activity.type] ?? 'directions_bike';
  }
}
