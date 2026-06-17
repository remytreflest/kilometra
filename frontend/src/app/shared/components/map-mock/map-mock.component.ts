import { Component } from '@angular/core';

@Component({
  selector: 'app-map-mock',
  standalone: true,
  template: `
    <div class="map-mock" role="img" aria-label="Carte illustrant la localisation de revendeurs Michelin à proximité">
      <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <rect width="400" height="220" fill="#EEEFF1"/>
        <!-- Routes principales -->
        <path d="M0 60 C80 90 140 40 220 70 S360 100 400 60" stroke="#C1D6EF" stroke-width="14" fill="none"/>
        <path d="M0 160 C100 130 180 190 280 150 S380 130 400 160" stroke="#C1D6EF" stroke-width="10" fill="none"/>
        <!-- Routes secondaires -->
        <path d="M40 0 C70 60 60 140 90 220" stroke="#E2E4E7" stroke-width="6" fill="none"/>
        <path d="M320 0 C300 70 330 150 300 220" stroke="#E2E4E7" stroke-width="6" fill="none"/>
        <path d="M0 110 Q200 95 400 110" stroke="#E2E4E7" stroke-width="4" fill="none"/>
        <!-- Revendeur 1 (proche, coupon) -->
        <circle cx="120" cy="90" r="16" fill="#27509B" opacity="0.15"/>
        <circle cx="120" cy="90" r="9" fill="#27509B"/>
        <text x="120" y="75" text-anchor="middle" font-size="9" font-family="Noto Sans" font-weight="700" fill="#27509B">Coupon ✓</text>
        <!-- Revendeur 2 -->
        <circle cx="210" cy="130" r="16" fill="#27509B" opacity="0.15"/>
        <circle cx="210" cy="130" r="9" fill="#27509B"/>
        <text x="210" y="115" text-anchor="middle" font-size="9" font-family="Noto Sans" font-weight="700" fill="#27509B">Coupon ✓</text>
        <!-- Revendeur 3 (sans coupon) -->
        <circle cx="310" cy="80" r="11" fill="#FCE500" stroke="#000C34" stroke-width="2"/>
        <circle cx="310" cy="80" r="4" fill="#000C34"/>
        <!-- Position utilisateur -->
        <circle cx="180" cy="155" r="8" fill="#84BD00"/>
        <circle cx="180" cy="155" r="16" fill="#84BD00" opacity="0.2"/>
      </svg>
      <span class="map-badge">Vous êtes ici</span>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .map-mock {
      position: relative;
      border-radius: $radius-lg;
      overflow: hidden;
      border: 1px solid $border-subtle;
      box-shadow: $elevation-1;
      height: 220px;
    }
    .map-badge {
      position: absolute;
      top: $space-3;
      left: $space-3;
      background: $surface-card;
      padding: $space-1 $space-3;
      border-radius: $radius-pill;
      font-size: $text-caption;
      font-weight: $weight-bold;
      box-shadow: $elevation-1;
    }
  `]
})
export class MapMockComponent {}
