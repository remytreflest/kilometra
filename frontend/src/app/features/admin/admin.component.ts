import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin } from 'rxjs';

import { AdminService } from '../../core/services/admin.service';
import { SectionEyebrowComponent } from '../../shared/components/section-eyebrow/section-eyebrow.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressTrackComponent } from '../../shared/components/progress-track/progress-track.component';

import { AdminKpi, TireTerrainPerf, RegionMichelinCoverage } from '../../shared/models/admin.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatTableModule, MatButtonModule,
    SectionEyebrowComponent, BadgeComponent, ProgressTrackComponent,
  ],
  template: `
    <div class="mich-container">
      <section class="page-header">
        <app-section-eyebrow>Administration</app-section-eyebrow>
        <h1>Tableau de bord Michelin</h1>
        <p class="page-desc">
          Vue agrégée de la performance réseau, des données terrain et des opportunités
          de croissance par région.
        </p>
      </section>

      <!-- KPI OVERVIEW -->
      @if (kpis.length) {
      <section class="admin-section">
        <div class="kpi-grid">
          @for (kpi of kpis; track kpi.label) {
            <div class="kpi-tile">
              <div class="kpi-icon" aria-hidden="true">
                <mat-icon>{{ kpi.icon }}</mat-icon>
              </div>
              <div class="kpi-body">
                <span class="kpi-value">{{ kpi.value }}</span>
                <span class="kpi-label">{{ kpi.label }}</span>
                @if (kpi.delta) {
                  <span class="kpi-delta" [class.positive]="kpi.deltaPositive" [class.negative]="!kpi.deltaPositive">
                    {{ kpi.delta }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      </section>
      }

      <!-- MEILLEURES PERFORMANCES PAR TERRAIN -->
      @if (terrainPerf.length) {
      <section class="admin-section">
        <h3 class="section-title">Meilleur pneu par type de terrain</h3>
        <div class="terrain-best-grid">
          @for (terrain of terrains; track terrain.key) {
            <div class="terrain-card" [class]="'terrain-card--' + terrain.key">
              <div class="terrain-icon" aria-hidden="true">
                <mat-icon>{{ terrain.icon }}</mat-icon>
              </div>
              <div class="terrain-info">
                <p class="terrain-type">{{ terrain.label }}</p>
                <h4 class="terrain-tire">{{ getBest(terrain.key).tireName }}</h4>
                <span class="terrain-score">{{ getBest(terrain.key)[terrain.key] | number:'1.0-2' }} / 10</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- TABLEAU COMPLET -->
      <section class="admin-section">
        <h3 class="section-title">Analyse terrain complète</h3>
        <div class="table-wrap">
          <table mat-table [dataSource]="terrainPerf" class="admin-table">
            <ng-container matColumnDef="pneu">
              <th mat-header-cell *matHeaderCellDef>Pneu</th>
              <td mat-cell *matCellDef="let r">{{ r.tireName }}</td>
            </ng-container>
            <ng-container matColumnDef="montagne">
              <th mat-header-cell *matHeaderCellDef>Montagne</th>
              <td mat-cell *matCellDef="let r" class="num" [class.best]="r.mountain === maxScores.mountain">
                {{ r.mountain | number:'1.0-2' }}
              </td>
            </ng-container>
            <ng-container matColumnDef="cotier">
              <th mat-header-cell *matHeaderCellDef>Côtier</th>
              <td mat-cell *matCellDef="let r" class="num" [class.best]="r.coastal === maxScores.coastal">
                {{ r.coastal | number:'1.0-2' }}
              </td>
            </ng-container>
            <ng-container matColumnDef="plaine">
              <th mat-header-cell *matHeaderCellDef>Plaine</th>
              <td mat-cell *matCellDef="let r" class="num" [class.best]="r.plain === maxScores.plain">
                {{ r.plain | number:'1.0-2' }}
              </td>
            </ng-container>
            <ng-container matColumnDef="pluie">
              <th mat-header-cell *matHeaderCellDef>Pluie</th>
              <td mat-cell *matCellDef="let r" class="num" [class.best]="r.wet === maxScores.wet">
                {{ r.wet | number:'1.0-2' }}
              </td>
            </ng-container>
            <ng-container matColumnDef="note">
              <th mat-header-cell *matHeaderCellDef>Note</th>
              <td mat-cell *matCellDef="let r" class="num rating">★ {{ r.avgRating | number:'1.0-2' }}</td>
            </ng-container>
            <ng-container matColumnDef="km">
              <th mat-header-cell *matHeaderCellDef>Km analysés</th>
              <td mat-cell *matCellDef="let r" class="num">{{ r.totalKmAnalyzed | number }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="terrainColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: terrainColumns;"></tr>
          </table>
        </div>
        <p class="table-note">En vert : meilleur score de la colonne</p>
      </section>
      }

      <!-- COUVERTURE RÉGIONALE -->
      @if (regionCoverage.length) {
      <section class="admin-section">
        <h3 class="section-title">Couverture Michelin par région</h3>
        <p class="section-sub">
          Classées par taux d'équipement croissant — les régions en rouge sont prioritaires.
        </p>
        <div class="regions-list">
          @for (region of regionCoverage; track region.region) {
            <div class="region-row" [class.priority]="region.coveragePct < 35">
              <div class="region-name">
                <span>{{ region.region }}</span>
                @if (region.coveragePct < 35) {
                  <app-badge variant="danger">Prioritaire</app-badge>
                }
              </div>
              <div class="region-bar">
                <app-progress-track
                  [value]="region.coveragePct"
                  [variant]="region.coveragePct >= 50 ? 'green' : region.coveragePct >= 35 ? 'blue' : 'red'"
                  [height]="10"
                />
              </div>
              <div class="region-stats">
                <span class="cov-pct">{{ region.coveragePct | number:'1.0-2' }}%</span>
                <span class="cov-users">{{ region.michelinUsers | number }} / {{ region.totalCyclists | number }}</span>
                <span class="cov-growth" [class.positive]="region.growthPct > 0">
                  +{{ region.growthPct | number:'1.0-2' }}%
                </span>
              </div>
            </div>
          }
        </div>
      </section>
      }

      <!-- RÉGIONS SOUS-REPRÉSENTÉES -->
      @if (undercovered.length) {
      <section class="admin-section">
        <h3 class="section-title">Actions prioritaires — régions sous-équipées</h3>
        <div class="actions-grid">
          @for (region of undercovered; track region.region) {
            <div class="action-card">
              <div class="action-header">
                <mat-icon class="action-warn">warning</mat-icon>
                <strong>{{ region.region }}</strong>
              </div>
              <p class="action-coverage">{{ region.coveragePct | number:'1.0-2' }}% d'équipement Michelin</p>
              <p class="action-desc">
                {{ region.totalCyclists - region.michelinUsers | number }} cyclistes non équipés
                — potentiel de {{ (100 - region.coveragePct) | number:'1.0-2' }}% de progression
              </p>
              <div class="action-footer">
                <span class="action-growth">Croissance MoM : +{{ region.growthPct | number:'1.0-2' }}%</span>
              </div>
            </div>
          }
        </div>
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

    .page-header { padding-top: $space-6; padding-bottom: $space-5; }
    .page-desc { font-size: $text-small; color: $text-secondary; margin-top: $space-2; max-width: 60ch; }
    .admin-section {
      padding-block: $space-6;
      & + .admin-section { border-top: 1px solid $border-subtle; }
    }
    .section-title { margin-bottom: $space-3; }
    .section-sub { font-size: $text-small; color: $text-secondary; margin-bottom: $space-5; }

    // KPI GRID
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-3;
      @include from-sm { grid-template-columns: repeat(4, 1fr); }
    }
    .kpi-tile {
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-4;
      box-shadow: $elevation-1;
      display: flex;
      gap: $space-3;
      align-items: flex-start;
    }
    .kpi-icon {
      width: 40px; height: 40px; flex-shrink: 0;
      border-radius: $radius-md;
      background: $color-blue-100;
      color: $color-blue-700;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }
    .kpi-body { display: flex; flex-direction: column; gap: $space-1; }
    .kpi-value { font-family: $font-display; font-weight: $weight-black; font-size: 1.1rem; color: $text-primary; }
    .kpi-label { font-size: $text-caption; color: $text-secondary; }
    .kpi-delta {
      font-size: $text-caption; font-weight: $weight-semibold;
      &.positive { color: $color-green; }
      &.negative { color: $color-danger; }
    }

    // TERRAIN BEST
    .terrain-best-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-3;
      @include from-sm { grid-template-columns: repeat(4, 1fr); }
    }
    .terrain-card {
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-4;
      box-shadow: $elevation-1;
      display: flex;
      flex-direction: column;
      gap: $space-3;
      &--mountain { border-top: 3px solid #7C7C7C; }
      &--coastal  { border-top: 3px solid #0087C5; }
      &--plain    { border-top: 3px solid $color-green; }
      &--wet      { border-top: 3px solid #455A96; }
    }
    .terrain-icon {
      width: 40px; height: 40px;
      border-radius: $radius-md;
      background: $color-grey-100;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 20px; width: 20px; height: 20px; color: $text-secondary; }
    }
    .terrain-type { font-size: $text-caption; color: $text-secondary; }
    .terrain-tire { font-size: $text-small; font-weight: $weight-bold; margin-block: $space-1; }
    .terrain-score {
      font-family: $font-display; font-weight: $weight-black;
      font-size: 1.2rem; color: $color-blue-700;
    }

    // TABLES
    .table-wrap { overflow-x: auto; border-radius: $radius-lg; border: 1px solid $border-subtle; }
    .admin-table { width: 100%; min-width: 580px; }
    .num { font-family: $font-display; font-weight: $weight-bold; }
    .best { color: $color-green; background: rgba($color-green, 0.08); font-weight: $weight-black !important; }
    .rating { color: $color-yellow; }
    .table-note { font-size: $text-caption; color: $text-secondary; margin-top: $space-2; }

    // REGION COVERAGE
    .regions-list { display: flex; flex-direction: column; gap: $space-3; }
    .region-row {
      display: grid;
      grid-template-columns: 1fr 2fr auto;
      align-items: center;
      gap: $space-4;
      padding: $space-3 $space-4;
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      box-shadow: $elevation-1;
      &.priority { border-left: 4px solid $color-danger; }
    }
    .region-name {
      display: flex; align-items: center; gap: $space-2;
      flex-wrap: wrap;
      font-weight: $weight-semibold; font-size: $text-small;
    }
    .region-stats {
      display: flex; flex-direction: column; align-items: flex-end; gap: 2px; min-width: 80px;
    }
    .cov-pct  { font-family: $font-display; font-weight: $weight-black; font-size: 1rem; color: $text-primary; }
    .cov-users { font-size: $text-caption; color: $text-secondary; }
    .cov-growth { font-size: $text-caption; color: $text-secondary; &.positive { color: $color-green; } }

    // ACTION CARDS
    .actions-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $space-3;
      @include from-sm { grid-template-columns: repeat(2, 1fr); }
      @include from-md { grid-template-columns: repeat(4, 1fr); }
    }
    .action-card {
      background: #FFF5F5;
      border: 1px solid #FECDD3;
      border-radius: $radius-lg;
      padding: $space-4;
      display: flex; flex-direction: column; gap: $space-2;
    }
    .action-header {
      display: flex; align-items: center; gap: $space-2;
      font-size: $text-small;
    }
    .action-warn { color: $color-danger; font-size: 20px; width: 20px; height: 20px; }
    .action-coverage { font-family: $font-display; font-weight: $weight-black; font-size: 1.5rem; color: $color-danger; }
    .action-desc { font-size: $text-caption; color: $text-secondary; }
    .action-footer { margin-top: auto; padding-top: $space-2; border-top: 1px solid #FECDD3; }
    .action-growth { font-size: $text-caption; font-weight: $weight-semibold; color: $color-green; }
  `]
})
export class AdminComponent implements OnInit {
  kpis: AdminKpi[] = [];
  terrainPerf: TireTerrainPerf[] = [];
  regionCoverage: RegionMichelinCoverage[] = [];
  undercovered: RegionMichelinCoverage[] = [];

  terrainColumns = ['pneu', 'montagne', 'cotier', 'plaine', 'pluie', 'note', 'km'];
  terrains = [
    { key: 'mountain' as const, label: 'Montagne',  icon: 'terrain'        },
    { key: 'coastal'  as const, label: 'Côtier',    icon: 'waves'          },
    { key: 'plain'    as const, label: 'Plaine',    icon: 'landscape'      },
    { key: 'wet'      as const, label: 'Temps pluie', icon: 'water_drop'   },
  ];
  maxScores = { mountain: 0, coastal: 0, plain: 0, wet: 0 };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    forkJoin({
      kpis: this.adminService.getKpis(),
      terrain: this.adminService.getTireTerrainPerformance(),
      regions: this.adminService.getRegionCoverage(),
      undercovered: this.adminService.getUndercoveredRegions(),
    }).subscribe(({ kpis, terrain, regions, undercovered }) => {
      this.kpis = kpis;
      this.terrainPerf = terrain;
      this.regionCoverage = regions;
      this.undercovered = undercovered;
      this.maxScores = {
        mountain: Math.max(...terrain.map(t => t.mountain)),
        coastal:  Math.max(...terrain.map(t => t.coastal)),
        plain:    Math.max(...terrain.map(t => t.plain)),
        wet:      Math.max(...terrain.map(t => t.wet)),
      };
    });
  }

  getBest(terrain: 'mountain' | 'coastal' | 'plain' | 'wet'): TireTerrainPerf {
    return this.terrainPerf.reduce((best, t) =>
      t[terrain] > best[terrain] ? t : best,
      this.terrainPerf[0] ?? ({} as TireTerrainPerf)
    );
  }
}
