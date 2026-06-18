import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-treadline',
  standalone: true,
  template: `<div class="treadline" [class.thin]="thin" [style.max-width]="maxWidth"></div>`,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;

    .treadline {
      height: 10px;
      width: 100%;
      background-image: repeating-linear-gradient(
        100deg,
        #{$color-midnight} 0px, #{$color-midnight} 3px,
        transparent 3px, transparent 9px
      );
      background-color: $color-yellow;
      border-radius: $radius-pill;
      opacity: 0.9;
    }
    .thin { height: 4px; }
  `]
})
export class TreadlineComponent {
  @Input() thin = false;
  @Input() maxWidth = '100%';
}
