import { Component, Input } from '@angular/core';

export type ProgressVariant = 'blue' | 'yellow' | 'green' | 'red';

@Component({
  selector: 'app-progress-track',
  standalone: true,
  template: `
    <div class="track" [style.height]="height + 'px'">
      <div
        class="fill"
        [class]="'fill-' + variant"
        [class.tread]="tread"
        [style.width]="value + '%'"
      ></div>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;

    .track {
      width: 100%;
      background: $color-grey-100;
      border-radius: $radius-pill;
      overflow: hidden;
      position: relative;
    }
    .fill {
      height: 100%;
      border-radius: $radius-pill;
      position: relative;
      transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
    }
    .fill-blue   { background: linear-gradient(90deg, #{$color-blue-500}, #{$color-blue-700}); }
    .fill-yellow { background: linear-gradient(90deg, #{$color-yellow-600}, #{$color-yellow}); }
    .fill-green  { background: linear-gradient(90deg, #4CAF50, #{$color-green}); }
    .fill-red    { background: linear-gradient(90deg, #EF5350, #B71C1C); }
    .fill.tread::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
        110deg,
        rgba(0,12,52,0.18) 0 2px, transparent 2px 7px
      );
    }
  `]
})
export class ProgressTrackComponent {
  @Input() value = 0;          // 0–100
  @Input() variant: ProgressVariant = 'blue';
  @Input() height = 8;
  @Input() tread = false;
}
