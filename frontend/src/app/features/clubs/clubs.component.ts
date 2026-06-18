import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { ClubService } from '../../core/services/club.service';
import { SectionEyebrowComponent } from '../../shared/components/section-eyebrow/section-eyebrow.component';
import { FilterBarComponent, FilterChip } from '../../shared/components/filter-bar/filter-bar.component';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

import { Club, RaceResult } from '../../shared/models/club.model';

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule, MatTableModule,
    SectionEyebrowComponent, FilterBarComponent, MetricCardComponent, BadgeComponent,
  ],
  template: `
    <div class="mich-container">
      <section class="page-header">
        <app-section-eyebrow>Compétition collective</app-section-eyebrow>
        <h1>Classements clubs</h1>
        <p class="page-desc">
          Cumulez les kilomètres de votre club et grimpez les échelons
          départemental, régional et national.
        </p>
      </section>

      <section class="clubs-section">
        <app-filter-bar
          [chips]="filters"
          [activeValue]="activeFilter"
          ariaLabel="Échelle de classement"
          (filterChange)="onFilterChange($event)"
        />
      </section>

      <!-- CARTE MON CLUB -->
      @if (myClub) {
      <section class="clubs-section">
        <app-metric-card>
          <div class="club-rank-inner">
            <div class="rank-number">#{{ myClub.rank }}</div>
            <div>
              <p class="rank-sub">Votre club — {{ myClub.region }}</p>
              <h3 class="club-name">{{ myClub.name }}</h3>
              <div class="rank-delta" [class.positive]="myClub.rankDelta > 0">
                <mat-icon>{{ myClub.rankDelta > 0 ? 'trending_up' : myClub.rankDelta < 0 ? 'trending_down' : 'trending_flat' }}</mat-icon>
                {{ myClub.rankDelta > 0 ? '+' : '' }}{{ myClub.rankDelta }} places cette semaine
              </div>
            </div>
          </div>
          <div class="club-stats">
            <div><span class="stat-val">{{ myClub.memberCount | number }}</span><span class="stat-lbl">membres</span></div>
            <div><span class="stat-val">{{ myClub.totalKm | number }} km</span><span class="stat-lbl">total cumulé</span></div>
            <div><span class="stat-val">{{ myClub.monthlyKm | number }} km</span><span class="stat-lbl">ce mois</span></div>
            <div><span class="stat-val">{{ myClub.michelinEquipmentPct }}%</span><span class="stat-lbl">équipés Michelin</span></div>
          </div>
        </app-metric-card>
      </section>
      }

      <!-- CLASSEMENT TABLEAU -->
      @if (ranking.length) {
      <section class="clubs-section">
        <h3 class="section-title">Classement {{ scaleLabel }}</h3>
        <div class="table-wrap">
          <table mat-table [dataSource]="ranking" class="clubs-table">
            <ng-container matColumnDef="rang">
              <th mat-header-cell *matHeaderCellDef>Rang</th>
              <td mat-cell *matCellDef="let club" class="num rank-cell">
                <span class="rank-badge" [class.podium]="club.rank <= 3">{{ club.rank }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="club">
              <th mat-header-cell *matHeaderCellDef>Club</th>
              <td mat-cell *matCellDef="let club">{{ club.name }}</td>
            </ng-container>
            <ng-container matColumnDef="membres">
              <th mat-header-cell *matHeaderCellDef>Membres</th>
              <td mat-cell *matCellDef="let club" class="num">{{ club.memberCount }}</td>
            </ng-container>
            <ng-container matColumnDef="km">
              <th mat-header-cell *matHeaderCellDef>Km cumulés</th>
              <td mat-cell *matCellDef="let club" class="num">{{ club.totalKm | number }} km</td>
            </ng-container>
            <ng-container matColumnDef="michelin">
              <th mat-header-cell *matHeaderCellDef>Équipés Michelin</th>
              <td mat-cell *matCellDef="let club" class="num">{{ club.michelinEquipmentPct }}%</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" [class.my-club]="row.id === 'c03'"></tr>
          </table>
        </div>
      </section>
      }

      <!-- CLASSEMENT INDIVIDUEL -->
      @if (activeFilter === 'national' && leaderboard.length) {
      <section class="clubs-section">
        <h3 class="section-title">Classement individuel national (50 premiers)</h3>
        <div class="table-wrap">
          <table mat-table [dataSource]="leaderboard" class="clubs-table">
            <ng-container matColumnDef="rang">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let r" class="num">{{ r.rank }}</td>
            </ng-container>
            <ng-container matColumnDef="rider">
              <th mat-header-cell *matHeaderCellDef>Cycliste</th>
              <td mat-cell *matCellDef="let r">
                {{ r.riderName }}
                @if (r.michelinUser) { <mat-icon class="michelin-icon" title="Équipé Michelin">verified</mat-icon> }
              </td>
            </ng-container>
            <ng-container matColumnDef="club">
              <th mat-header-cell *matHeaderCellDef>Club</th>
              <td mat-cell *matCellDef="let r">{{ r.club }}</td>
            </ng-container>
            <ng-container matColumnDef="km">
              <th mat-header-cell *matHeaderCellDef>Km</th>
              <td mat-cell *matCellDef="let r" class="num">{{ r.totalKm | number }}</td>
            </ng-container>
            <ng-container matColumnDef="mpi">
              <th mat-header-cell *matHeaderCellDef>MPI</th>
              <td mat-cell *matCellDef="let r" class="num mpi-col">{{ r.mpiScore }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="leaderboardColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: leaderboardColumns;" [class.my-row]="row.riderName === 'Camille Dubreuil'"></tr>
          </table>
        </div>
      </section>
      }

      <!-- BADGES DU CLUB -->
      @if (myClub?.badges?.length) {
      <section class="clubs-section">
        <h3 class="section-title">Badges du club</h3>
        <div class="badges-grid">
          @for (badge of myClub!.badges; track badge.id) {
            <div class="club-badge-tile" [class.locked]="!badge.unlocked">
              <mat-icon [style.color]="badge.unlocked ? badge.color : '#C9CCD1'">{{ badge.icon }}</mat-icon>
              <span>{{ badge.label }}</span>
            </div>
          }
        </div>
      </section>
      }

      <section class="clubs-section" style="text-align:center;">
        <button mat-raised-button color="accent">
          <mat-icon>person_add</mat-icon> Inviter mon club
        </button>
      </section>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;
    @use 'styles/design-tokens/breakpoints' as *;

    .page-header { padding-top: $space-6; padding-bottom: $space-5; }
    .page-desc   { font-size: $text-small; color: $text-secondary; margin-top: $space-2; max-width: 56ch; }
    .clubs-section {
      padding-block: $space-6;
      & + .clubs-section { border-top: 1px solid $border-subtle; }
    }
    .section-title { margin-bottom: $space-4; }

    // CLUB RANK CARD
    .club-rank-inner { display: flex; align-items: center; gap: $space-5; margin-bottom: $space-4; }
    .rank-number {
      font-family: $font-display; font-weight: $weight-black;
      font-size: 3rem; color: $color-yellow; line-height: 1; flex-shrink: 0;
    }
    .rank-sub  { color: rgba(196,214,239,0.9); font-weight: $weight-semibold; font-size: $text-small; }
    .club-name { color: #fff; }
    .rank-delta {
      display: inline-flex; align-items: center; gap: $space-1;
      font-size: $text-small; color: rgba(255,255,255,0.7);
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &.positive { color: $color-yellow; }
    }
    .club-stats {
      display: flex; gap: $space-5; flex-wrap: wrap;
      padding-top: $space-3; border-top: 1px solid rgba(255,255,255,0.15);
    }
    .stat-val { display: block; font-family: $font-display; font-weight: $weight-black; font-size: 1rem; color: #fff; }
    .stat-lbl { display: block; font-size: $text-caption; color: rgba(212,231,250,0.8); }

    /* TABLE */
    .table-wrap { overflow-x: auto; border-radius: $radius-lg; border: 1px solid $border-subtle; }
    .clubs-table { width: 100%; min-width: 480px; }
    .num { font-family: $font-display; font-weight: $weight-bold; }
    .mpi-col { color: $color-blue-700; }
    .rank-badge {
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: 50%;
      background: $color-grey-100; font-family: $font-display; font-weight: $weight-bold;
      &.podium { background: $color-yellow; color: $color-midnight; }
    }
    .my-club { background: $color-blue-100; font-weight: $weight-bold; }
    .my-row  { background: $color-yellow-100; }
    .michelin-icon { font-size: 14px; width: 14px; height: 14px; color: $color-blue-700; vertical-align: middle; margin-left: 4px; }

    /* BADGES */
    .badges-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-3;
      @include from-sm { grid-template-columns: repeat(4, 1fr); }
    }
    .club-badge-tile {
      display: flex; flex-direction: column; align-items: center;
      text-align: center; gap: $space-2;
      background: $surface-card; border: 1px solid $border-subtle;
      border-radius: $radius-lg; padding: $space-4;
      box-shadow: $elevation-1;
      font-size: $text-caption; font-weight: $weight-bold; color: $text-secondary;
      mat-icon { font-size: 30px; width: 30px; height: 30px; }
      &.locked { opacity: 0.45; }
    }
  `]
})
export class ClubsComponent implements OnInit {
  myClub: Club | null = null;
  ranking: Club[] = [];
  leaderboard: RaceResult[] = [];

  filters: FilterChip[] = [
    { label: 'Départemental', value: 'departmental' },
    { label: 'Régional',      value: 'regional'     },
    { label: 'National',      value: 'national'     },
    { label: 'Interclubs',    value: 'interclub'    },
  ];
  activeFilter = 'regional';
  scaleLabel = 'régional';

  displayedColumns = ['rang', 'club', 'membres', 'km', 'michelin'];
  leaderboardColumns = ['rang', 'rider', 'club', 'km', 'mpi'];

  constructor(private clubService: ClubService) {}

  ngOnInit() {
    this.clubService.getMyClub().subscribe(c => this.myClub = c);
    this.loadRanking('regional');
    this.clubService.getNationalLeaderboard().subscribe(r => this.leaderboard = r);
  }

  onFilterChange(value: string) {
    this.activeFilter = value;
    const labels: Record<string, string> = {
      departmental: 'départemental', regional: 'régional',
      national: 'national', interclub: 'interclubs'
    };
    this.scaleLabel = labels[value] ?? '';
    this.loadRanking(value as any);
  }

  private loadRanking(scale: any) {
    this.clubService.getRanking(scale).subscribe(r => this.ranking = r);
  }
}
