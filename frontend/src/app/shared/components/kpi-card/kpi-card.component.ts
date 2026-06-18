import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="kpi-card">
      <span class="kpi-value">{{ value }}</span>
      <span class="kpi-label">{{ label }}</span>
      @if (delta) {
        <span class="kpi-delta" [class.up]="deltaPositive" [class.down]="!deltaPositive">
          <mat-icon>{{ deltaPositive ? 'trending_up' : 'trending_down' }}</mat-icon>
          {{ delta }}
        </span>
      }
      @if (note) {
        <span class="kpi-note">{{ note }}</span>
      }
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .kpi-card {
      background: $surface-card;
      border-radius: $radius-lg;
      border: 1px solid $border-subtle;
      box-shadow: $elevation-1;
      padding: $space-4;
      display: flex;
      flex-direction: column;
      gap: $space-1;
    }
    .kpi-value {
      font-family: $font-display;
      font-weight: $weight-black;
      font-size: 1.5rem;
      color: $color-blue-700;
      line-height: 1.1;
    }
    .kpi-label {
      font-size: $text-caption;
      color: $text-secondary;
      font-weight: $weight-semibold;
    }
    .kpi-delta {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: $text-caption;
      font-weight: $weight-bold;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
      &.up   { color: $color-success; }
      &.down { color: $color-danger; }
    }
    .kpi-note {
      font-size: $text-caption;
      color: $text-secondary;
      font-style: italic;
    }
  `]
})
export class KpiCardComponent {
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) label!: string;
  @Input() delta?: string;
  @Input() deltaPositive = true;
  @Input() note?: string;
}
