import { Component } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  template: `
    <div class="metric-card">
      <div class="tread-bg" aria-hidden="true"></div>
      <div class="metric-content">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/elevation' as *;

    .metric-card {
      background: linear-gradient(135deg, #{$color-blue-700}, #{$color-midnight});
      color: $color-white;
      border-radius: $radius-xl;
      padding: $space-6;
      position: relative;
      overflow: hidden;
      box-shadow: $elevation-brand;
    }
    .tread-bg {
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
        115deg,
        rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px,
        transparent 2px, transparent 16px
      );
      pointer-events: none;
    }
    .metric-content {
      position: relative;
      z-index: 1;
    }
  `]
})
export class MetricCardComponent {}
