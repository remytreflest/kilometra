import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'blue' | 'yellow' | 'success' | 'warning' | 'danger' | 'dark' | 'grey';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [ngClass]="'badge-' + variant"><ng-content /></span>`,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;

    .badge {
      display: inline-flex;
      align-items: center;
      gap: $space-1;
      padding: $space-1 $space-3;
      border-radius: $radius-pill;
      font-size: $text-caption;
      font-weight: $weight-bold;
      letter-spacing: 0.01em;
      white-space: nowrap;
    }
    .badge-blue    { background: $color-blue-100;   color: $color-blue-700; }
    .badge-yellow  { background: $color-yellow-100; color: $color-dark-blue; border: 1px solid $color-yellow-600; }
    .badge-success { background: #E5F3E6;            color: $color-success; }
    .badge-warning { background: #FEF3E0;            color: #8A5A00; }
    .badge-danger  { background: #FBE5E5;            color: $color-danger; }
    .badge-dark    { background: $color-midnight;    color: $color-white; }
    .badge-grey    { background: $color-grey-100;    color: $text-secondary; }
  `]
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'blue';
}
