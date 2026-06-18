import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-coupon-card',
  standalone: true,
  imports: [RouterLink, MatButtonModule, BadgeComponent],
  template: `
    <div class="coupon-card">
      <div class="tread-bg" aria-hidden="true"></div>
      <div class="coupon-inner">
        <div class="coupon-left">
          <app-badge variant="dark">Offre testeur</app-badge>
          <h3>−50% sur votre prochain train de pneus</h3>
          <p>Coupon débloqué grâce à votre régularité d'entraînement.</p>
        </div>
        <div class="coupon-right">
          <span class="coupon-code">{{ code }}</span>
          <button mat-raised-button color="accent" routerLink="/testeurs">Utiliser mon coupon</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;

    .coupon-card {
      background: $color-midnight;
      border-radius: $radius-xl;
      padding: $space-6;
      position: relative;
      overflow: hidden;
      border: 1px dashed $color-yellow-600;
    }
    .tread-bg {
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
        115deg,
        rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px,
        transparent 2px, transparent 16px
      );
      pointer-events: none;
    }
    .coupon-inner {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: $space-5;
      @media (min-width: 600px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
    .coupon-left {
      display: flex;
      flex-direction: column;
      gap: $space-2;
      h3 { color: #fff; }
      p  { font-size: $text-small; color: rgba(255,255,255,0.7); }
    }
    .coupon-right {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: $space-3;
      @media (min-width: 600px) { align-items: flex-end; }
    }
    .coupon-code {
      font-family: $font-display;
      font-weight: $weight-black;
      letter-spacing: 0.08em;
      color: $color-yellow;
      font-size: 1.1rem;
    }
  `]
})
export class CouponCardComponent {
  @Input() code = 'MICHELIN50';
}
