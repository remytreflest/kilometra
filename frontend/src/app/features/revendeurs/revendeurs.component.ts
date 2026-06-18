import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DealerService } from '../../core/services/dealer.service';
import { SectionEyebrowComponent } from '../../shared/components/section-eyebrow/section-eyebrow.component';
import { FilterBarComponent, FilterChip } from '../../shared/components/filter-bar/filter-bar.component';
import { DealerCardComponent } from '../../shared/components/dealer-card/dealer-card.component';
import { MapMockComponent } from '../../shared/components/map-mock/map-mock.component';
import { Dealer } from '../../shared/models/dealer.model';

@Component({
  selector: 'app-revendeurs',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule,
    SectionEyebrowComponent, FilterBarComponent, DealerCardComponent, MapMockComponent,
  ],
  template: `
    <div class="mich-container">
      <section class="page-header">
        <app-section-eyebrow>Réseau partenaire</app-section-eyebrow>
        <h1>Revendeurs Michelin</h1>
        <p class="page-desc">Trouvez un revendeur près de chez vous acceptant votre coupon testeur.</p>
      </section>

      <section class="rev-section">
        <app-map-mock />
      </section>

      <section class="rev-section">
        <app-filter-bar
          [chips]="filters"
          [activeValue]="activeFilter"
          ariaLabel="Filtres revendeurs"
          (filterChange)="onFilterChange($event)"
        />
      </section>

      <section class="rev-section">
        <div class="dealers-stack">
          @for (dealer of filteredDealers; track dealer.id) {
            <app-dealer-card [dealer]="dealer" />
          }
          @empty {
            <div class="empty-state">
              <mat-icon>store_off</mat-icon>
              <p>Aucun revendeur ne correspond à vos filtres.</p>
            </div>
          }
        </div>
      </section>

      <section class="rev-section" style="text-align:center;">
        <button mat-raised-button color="accent">
          <mat-icon>calendar_month</mat-icon>
          Réserver mon train de pneus
        </button>
      </section>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .page-header { padding-top: $space-6; padding-bottom: $space-5; }
    .page-desc   { font-size: $text-small; color: $text-secondary; margin-top: $space-2; max-width: 56ch; }
    .rev-section {
      padding-block: $space-6;
      & + .rev-section { border-top: 1px solid $border-subtle; }
    }
    .dealers-stack { display: flex; flex-direction: column; gap: $space-3; }
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      gap: $space-3; padding: $space-10 $space-6;
      color: $text-secondary; text-align: center;
      mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.4; }
    }
  `]
})
export class RevendeursComponent implements OnInit {
  allDealers: Dealer[] = [];
  filteredDealers: Dealer[] = [];

  filters: FilterChip[] = [
    { label: 'Tous',             value: 'all'       },
    { label: 'Coupon accepté',   value: 'coupon'    },
    { label: 'Ouvert maintenant', value: 'open'     },
    { label: 'Stock disponible', value: 'available' },
  ];
  activeFilter = 'all';

  constructor(private dealerService: DealerService) {}

  ngOnInit() {
    this.dealerService.getNearbyDealers().subscribe(d => {
      this.allDealers = d;
      this.filteredDealers = d;
    });
  }

  onFilterChange(value: string) {
    this.activeFilter = value;
    switch (value) {
      case 'coupon':    this.filteredDealers = this.allDealers.filter(d => d.acceptsCoupon); break;
      case 'open':      this.filteredDealers = this.allDealers.filter(d => d.isOpen); break;
      case 'available': this.filteredDealers = this.allDealers.filter(d => d.stockStatus === 'available'); break;
      default:          this.filteredDealers = [...this.allDealers];
    }
  }
}
