import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BadgeComponent } from '../badge/badge.component';
import { Dealer } from '../../models/dealer.model';

@Component({
  selector: 'app-dealer-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, BadgeComponent],
  template: `
    <div class="dealer-card">
      <div class="dealer-info">
        <div class="dealer-header">
          <h4>{{ dealer.name }}</h4>
          <app-badge [variant]="dealer.acceptsCoupon ? 'success' : 'warning'">
            {{ dealer.acceptsCoupon ? 'Coupon accepté' : 'Coupon non accepté' }}
          </app-badge>
        </div>
        <p class="dealer-address">{{ dealer.address }}, {{ dealer.city }}</p>
        <div class="dealer-meta">
          <span><mat-icon>place</mat-icon> {{ dealer.distanceKm }} km</span>
          <span [class]="dealer.isOpen ? 'open' : 'closed'">
            {{ dealer.isOpen ? ('Ouvert · ferme à ' + dealer.closingTime) : ('Fermé · ouvre à ' + dealer.openingTime) }}
          </span>
          <span><mat-icon>inventory</mat-icon> Stock :
            {{ dealer.stockStatus === 'available' ? 'disponible' : dealer.stockStatus === 'limited' ? 'limité' : 'sur commande' }}
          </span>
        </div>
      </div>
      <button mat-stroked-button color="primary" class="direction-btn">
        <mat-icon>directions</mat-icon> Itinéraire
      </button>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .dealer-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $space-4;
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-4 $space-5;
      box-shadow: $elevation-1;
      flex-wrap: wrap;
    }
    .dealer-info { flex: 1; min-width: 220px; }
    .dealer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $space-3;
      flex-wrap: wrap;
    }
    h4 { font-size: 1.05rem; }
    .dealer-address { font-size: $text-small; color: $text-secondary; margin-top: $space-1; }
    .dealer-meta {
      display: flex;
      gap: $space-4;
      flex-wrap: wrap;
      margin-top: $space-2;
      font-size: $text-caption;
      color: $text-secondary;
      align-items: center;
      span { display: flex; align-items: center; gap: 4px; }
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }
    .open   { color: $color-success; font-weight: $weight-semibold; }
    .closed { color: $color-danger; }
    .direction-btn { flex-shrink: 0; }
  `]
})
export class DealerCardComponent {
  @Input({ required: true }) dealer!: Dealer;
}
