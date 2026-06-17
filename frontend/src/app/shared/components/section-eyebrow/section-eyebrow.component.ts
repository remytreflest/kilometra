import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-eyebrow',
  standalone: true,
  template: `<p class="eyebrow" [class.on-dark]="onDark"><ng-content /></p>`,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: $space-2;
      font-size: $text-caption;
      font-weight: $weight-bold;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $color-blue-700;
      margin-bottom: $space-2;

      &::before {
        content: '';
        width: 14px;
        height: 3px;
        background: $color-yellow;
        border-radius: 2px;
        display: inline-block;
        flex-shrink: 0;
      }
      &.on-dark { color: $color-yellow; }
    }
  `]
})
export class SectionEyebrowComponent {
  @Input() onDark = false;
}
