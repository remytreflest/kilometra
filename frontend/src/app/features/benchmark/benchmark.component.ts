import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';

import { TireService } from '../../core/services/tire.service';
import { SectionEyebrowComponent } from '../../shared/components/section-eyebrow/section-eyebrow.component';
import { FilterBarComponent, FilterChip } from '../../shared/components/filter-bar/filter-bar.component';
import { RadarChartComponent, RadarDataset } from '../../shared/components/radar-chart/radar-chart.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

import { Tire } from '../../shared/models/tire.model';

@Component({
  selector: 'app-benchmark',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule, MatTableModule,
    SectionEyebrowComponent, FilterBarComponent, RadarChartComponent, BadgeComponent,
  ],
  template: `
    <div class="mich-container">
      <section class="page-header">
        <app-section-eyebrow>Analyse comparative</app-section-eyebrow>
        <h1>Benchmark pneus</h1>
        <p class="page-desc">
          Comparez les performances mesurées sur 5 critères, basées sur les remontées terrain
          de la communauté et les tests en laboratoire Michelin.
        </p>
      </section>

      <section class="bench-section">
        <app-filter-bar
          [chips]="filters"
          [activeValue]="activeFilter"
          ariaLabel="Catégorie de pneus"
          (filterChange)="onFilterChange($event)"
        />
      </section>

      <!-- RADAR CHART -->
      @if (michelin && competitors.length) {
      <section class="bench-section">
        <div class="card">
          <h3>Vue d'ensemble des critères</h3>
          <app-radar-chart
            [labels]="radarLabels"
            [datasets]="radarDatasets"
          />
        </div>
      </section>

      <!-- TABLEAU COMPARATIF -->
      <section class="bench-section">
        <h3>Comparatif détaillé</h3>
        <div class="table-wrap">
          <table mat-table [dataSource]="tableRows" class="bench-table">

            <ng-container matColumnDef="critere">
              <th mat-header-cell *matHeaderCellDef>Critère</th>
              <td mat-cell *matCellDef="let row">{{ row.label }}</td>
            </ng-container>

            <ng-container matColumnDef="michelin">
              <th mat-header-cell *matHeaderCellDef>{{ michelin.reference }}</th>
              <td mat-cell *matCellDef="let row" class="num michelin-col">
                {{ row.michelin.toFixed(1) }} / 10
              </td>
            </ng-container>

            @for (comp of competitors.slice(0, 3); track comp.id; let i = $index) {
            <ng-container [matColumnDef]="'comp' + i">
              <th mat-header-cell *matHeaderCellDef>{{ comp.reference }}</th>
              <td mat-cell *matCellDef="let row" class="num">{{ row['comp' + i].toFixed(1) }} / 10</td>
            </ng-container>
            }

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                [class.highlight]="row.highlight"></tr>
          </table>
        </div>
      </section>

      <!-- PREUVE COMMUNAUTAIRE -->
      <section class="bench-section">
        <div class="proof-card">
          <div class="proof-icon" aria-hidden="true">
            <mat-icon>verified</mat-icon>
          </div>
          <div>
            <p class="proof-value">{{ michelin.punctureReductionPct }}% de crevaisons en moins</p>
            <p class="proof-desc">
              Observées chez les cyclistes équipés Michelin sur 18 000 sorties analysées
              au cours des 6 derniers mois.
            </p>
          </div>
        </div>
      </section>

      <section class="bench-section" style="text-align:center;">
        <button mat-raised-button color="accent" routerLink="/testeurs">
          Tester ce pneu à −50%
        </button>
      </section>
      }

    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;
    @use 'styles/design-tokens/breakpoints' as *;

    .page-header {
      padding-top: $space-6;
      padding-bottom: $space-5;
    }
    .page-desc { font-size: $text-small; color: $text-secondary; margin-top: $space-2; max-width: 56ch; }
    .bench-section {
      padding-block: $space-6;
      & + .bench-section { border-top: 1px solid $border-subtle; }
    }
    .card {
      background: $surface-card;
      border-radius: $radius-lg;
      border: 1px solid $border-subtle;
      box-shadow: $elevation-1;
      padding: $space-5;
    }
    h3 { margin-bottom: $space-4; }

    // TABLE
    .table-wrap {
      overflow-x: auto;
      border-radius: $radius-lg;
      border: 1px solid $border-subtle;
    }
    .bench-table {
      width: 100%;
      min-width: 520px;
    }
    .num {
      font-family: $font-display;
      font-weight: $weight-bold;
    }
    .michelin-col { color: $color-blue-700; font-weight: $weight-black !important; }
    .highlight { background: $color-blue-100; }

    // PROOF
    .proof-card {
      display: flex;
      align-items: center;
      gap: $space-4;
      background: $color-blue-100;
      border: 1px solid $color-blue-300;
      border-radius: $radius-lg;
      padding: $space-5;
    }
    .proof-icon {
      width: 48px; height: 48px;
      border-radius: 50%;
      flex-shrink: 0;
      background: $color-blue-700;
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }
    .proof-value { font-family: $font-display; font-weight: $weight-black; font-size: 1.5rem; color: $color-blue-700; }
    .proof-desc  { font-size: $text-small; color: $text-secondary; margin-top: $space-1; }
  `]
})
export class BenchmarkComponent implements OnInit {
  michelin: Tire | null = null;
  competitors: Tire[] = [];
  radarLabels = ['Adhérence', 'Rendement', 'Confort', 'Anti-crevaison', 'Durabilité'];
  radarDatasets: RadarDataset[] = [];
  tableRows: any[] = [];
  displayedColumns: string[] = [];

  filters: FilterChip[] = [
    { label: 'Tous les pneus', value: 'all' },
    { label: 'Pneus route', value: 'route' },
    { label: 'Pneus endurance', value: 'endurance' },
    { label: 'Pneus compétition', value: 'competition' },
  ];
  activeFilter = 'all';

  constructor(private tireService: TireService) {}

  ngOnInit() {
    this.tireService.getBenchmarkData().subscribe(({ michelin, competitors }) => {
      this.michelin = michelin;
      this.competitors = competitors.slice(0, 3);
      this.buildChart();
      this.buildTable();
    });
  }

  onFilterChange(value: string) {
    this.activeFilter = value;
  }

  private buildChart() {
    if (!this.michelin) return;
    const s = this.michelin.scores;
    this.radarDatasets = [
      {
        label: this.michelin.reference,
        data: [s.grip, s.energyReturn, s.comfort, s.punctureResistance, s.durability],
        color: '#27509B'
      },
      ...this.competitors.map((c, i) => ({
        label: c.reference,
        data: [c.scores.grip, c.scores.energyReturn, c.scores.comfort, c.scores.punctureResistance, c.scores.durability],
        color: ['#9DA1A8', '#C9CCD1', '#AEC5E5'][i] ?? '#9DA1A8'
      }))
    ];
  }

  private buildTable() {
    if (!this.michelin) return;
    const s = this.michelin.scores;
    const criteria = [
      { label: 'Adhérence',               key: 'grip',               highlight: true  },
      { label: 'Rendement énergétique',   key: 'energyReturn',       highlight: false },
      { label: 'Confort',                 key: 'comfort',            highlight: true  },
      { label: 'Résistance crevaison',    key: 'punctureResistance', highlight: false },
      { label: 'Durabilité',              key: 'durability',         highlight: true  },
    ];
    this.tableRows = criteria.map(c => {
      const row: any = {
        label: c.label,
        michelin: (s as any)[c.key],
        highlight: c.highlight,
      };
      this.competitors.forEach((comp, i) => {
        row['comp' + i] = (comp.scores as any)[c.key];
      });
      return row;
    });
    this.displayedColumns = ['critere', 'michelin', ...this.competitors.map((_, i) => 'comp' + i)];
  }
}
