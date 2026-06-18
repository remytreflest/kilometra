import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { UserService } from '../../core/services/user.service';
import { PerformanceService } from '../../core/services/performance.service';
import { SectionEyebrowComponent } from '../../shared/components/section-eyebrow/section-eyebrow.component';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { MpiRingComponent } from '../../shared/components/mpi-ring/mpi-ring.component';
import { LineChartComponent, LineDataset } from '../../shared/components/line-chart/line-chart.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { CouponCardComponent } from '../../shared/components/coupon-card/coupon-card.component';

import { UserProfile } from '../../shared/models/user.model';
import { PerformanceIndex } from '../../shared/models/performance.model';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule,
    SectionEyebrowComponent, MetricCardComponent, MpiRingComponent,
    LineChartComponent, BadgeComponent, CouponCardComponent,
  ],
  template: `
    <div class="mich-container">

      <!-- HEADER PROFIL -->
      @if (user) {
      <section class="profil-header">
        <div class="avatar" aria-hidden="true">{{ user.initials }}</div>
        <div class="header-info">
          <app-section-eyebrow>Mon profil</app-section-eyebrow>
          <h1>{{ user.firstName }} {{ user.lastName }}</h1>
          <div class="header-meta">
            <mat-icon>groups</mat-icon>
            <span>{{ user.club }}</span>
            <mat-icon>calendar_today</mat-icon>
            <span>Membre depuis {{ user.memberSince | date:'MMMM yyyy' }}</span>
          </div>
          <div class="header-badges">
            <app-badge variant="blue">{{ user.level }}</app-badge>
            @if (user.stravaConnected) {
              <app-badge variant="success">
                <mat-icon style="font-size:14px;width:14px;height:14px;vertical-align:middle">link</mat-icon>
                Strava connecté
              </app-badge>
            }
          </div>
        </div>
      </section>
      }

      <!-- MPI -->
      @if (perf) {
      <section class="profil-section">
        <app-metric-card>
          <div class="mpi-row">
            <app-mpi-ring [score]="perf.score" [size]="160" />
            <div class="mpi-details">
              <h3 class="mpi-title">Michelin Performance Index</h3>
              <div class="mpi-stats">
                <div>
                  <span class="stat-val">+{{ perf.monthlyDelta }}</span>
                  <span class="stat-lbl">pts ce mois</span>
                </div>
                <div>
                  <span class="stat-val">{{ perf.weeklyKm }} km</span>
                  <span class="stat-lbl">cette semaine</span>
                </div>
                <div>
                  <span class="stat-val">#{{ perf.nationalRank }}</span>
                  <span class="stat-lbl">national</span>
                </div>
                <div>
                  <span class="stat-val">{{ perf.percentileBeat }}%</span>
                  <span class="stat-lbl">cyclistes dépassés</span>
                </div>
              </div>
            </div>
          </div>
        </app-metric-card>
      </section>

      <!-- ÉVOLUTION 6 MOIS -->
      <section class="profil-section">
        <h3 class="section-title">Évolution de mon MPI — 6 mois</h3>
        <div class="chart-card">
          <app-line-chart
            [labels]="chartLabels"
            [datasets]="chartDatasets"
            yLabel="Score MPI"
          />
        </div>
      </section>
      }

      <!-- BADGES -->
      @if (user) {
      <section class="profil-section">
        <h3 class="section-title">Mes badges</h3>
        <div class="badges-grid">
          @for (badge of user.badges; track badge.id) {
            <div class="badge-tile" [class.locked]="!badge.unlocked">
              <div class="badge-icon" [style.background]="badge.unlocked ? badge.color + '20' : '#F2F3F5'"
                                     [style.border-color]="badge.unlocked ? badge.color : '#C9CCD1'">
                <mat-icon [style.color]="badge.unlocked ? badge.color : '#C9CCD1'">{{ badge.icon }}</mat-icon>
              </div>
              <p class="badge-label">{{ badge.label }}</p>
              @if (!badge.unlocked) {
                <span class="badge-locked">Verrouillé</span>
              }
            </div>
          }
        </div>
      </section>

      <!-- RÉCOMPENSES -->
      @if (user.rewards.length) {
      <section class="profil-section">
        <h3 class="section-title">Mes récompenses actives</h3>
        @for (reward of user.rewards; track reward.id) {
          @if (reward.type === 'coupon' && reward.couponCode) {
            <app-coupon-card [code]="reward.couponCode" />
            <p class="reward-validity">
              <mat-icon style="font-size:14px;width:14px;height:14px;vertical-align:middle">schedule</mat-icon>
              Valable jusqu'au {{ reward.validUntil | date:'d MMMM yyyy' }}
            </p>
          }
        }
      </section>
      }

      <!-- CONNEXION STRAVA -->
      <section class="profil-section">
        <div class="strava-card" [class.connected]="user.stravaConnected">
          <div class="strava-icon" aria-hidden="true">
            <mat-icon>directions_bike</mat-icon>
          </div>
          <div>
            <h4>Strava</h4>
            @if (user.stravaConnected) {
              <p>Vos activités sont synchronisées automatiquement.</p>
              <app-badge variant="success">Connecté</app-badge>
            } @else {
              <p>Connectez Strava pour valider vos kilomètres en temps réel.</p>
              <button mat-raised-button color="accent" style="margin-top: 8px;">
                Connecter Strava
              </button>
            }
          </div>
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

    /* HEADER */
    .profil-header {
      display: flex;
      flex-direction: column;
      gap: $space-4;
      padding-block: $space-6;
      @include from-sm { flex-direction: row; align-items: flex-start; gap: $space-6; }
    }
    .avatar {
      width: 88px; height: 88px; flex-shrink: 0;
      border-radius: 50%;
      background: linear-gradient(135deg, $color-blue-700, $color-midnight);
      color: $color-yellow;
      display: flex; align-items: center; justify-content: center;
      font-family: $font-display;
      font-weight: $weight-black;
      font-size: 2rem;
      box-shadow: $elevation-3;
    }
    .header-info { display: flex; flex-direction: column; gap: $space-2; }
    .header-meta {
      display: flex; align-items: center; flex-wrap: wrap; gap: $space-1 $space-2;
      font-size: $text-small; color: $text-secondary;
      mat-icon { font-size: 16px; width: 16px; height: 16px; vertical-align: middle; }
    }
    .header-badges { display: flex; flex-wrap: wrap; gap: $space-2; margin-top: $space-1; }

    /* SECTIONS */
    .profil-section {
      padding-block: $space-6;
      & + .profil-section { border-top: 1px solid $border-subtle; }
    }
    .section-title { margin-bottom: $space-4; }

    /* MPI ROW */
    .mpi-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-5;
      @include from-sm { flex-direction: row; align-items: center; }
    }
    .mpi-title { color: rgba(196,214,239,0.9); margin-bottom: $space-4; }
    .mpi-details { flex: 1; }
    .mpi-stats {
      display: flex; flex-wrap: wrap; gap: $space-5;
      padding-top: $space-4;
      border-top: 1px solid rgba(255,255,255,0.15);
    }
    .stat-val { display: block; font-family: $font-display; font-weight: $weight-black; font-size: 1.1rem; color: #fff; }
    .stat-lbl { display: block; font-size: $text-caption; color: rgba(212,231,250,0.8); }

    /* CHART */
    .chart-card {
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      box-shadow: $elevation-1;
      padding: $space-5;
      height: 240px;
    }

    /* BADGES */
    .badges-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-3;
      @include from-sm { grid-template-columns: repeat(4, 1fr); }
    }
    .badge-tile {
      display: flex; flex-direction: column; align-items: center;
      text-align: center; gap: $space-2;
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-5;
      box-shadow: $elevation-1;
      &.locked { opacity: 0.5; }
    }
    .badge-icon {
      width: 56px; height: 56px;
      border-radius: 50%;
      border: 2px solid;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 28px; width: 28px; height: 28px; }
    }
    .badge-label { font-size: $text-small; font-weight: $weight-semibold; color: $text-primary; }
    .badge-locked { font-size: $text-caption; color: $text-secondary; }

    /* REWARD */
    .reward-validity {
      font-size: $text-caption; color: $text-secondary;
      margin-top: $space-2;
      display: flex; align-items: center; gap: $space-1;
    }

    /* STRAVA */
    .strava-card {
      display: flex; align-items: flex-start; gap: $space-4;
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-5;
      box-shadow: $elevation-1;
      h4 { margin-bottom: $space-2; }
      p  { font-size: $text-small; color: $text-secondary; }
    }
    .strava-card.connected { border-color: $color-green; }
    .strava-icon {
      width: 48px; height: 48px; flex-shrink: 0;
      border-radius: 50%;
      background: #FC4C02;
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }
  `]
})
export class ProfilComponent implements OnInit {
  user: UserProfile | null = null;
  perf: PerformanceIndex | null = null;
  chartLabels: string[] = [];
  chartDatasets: LineDataset[] = [];

  constructor(
    private userService: UserService,
    private perfService: PerformanceService,
  ) {}

  ngOnInit() {
    forkJoin({
      user: this.userService.getProfile(),
      perf: this.perfService.getIndex(),
    }).subscribe(({ user, perf }) => {
      this.user = user;
      this.perf = perf;
      this.chartLabels = perf.history.map(h => h.month);
      this.chartDatasets = [{
        label: 'MPI',
        data: perf.history.map(h => h.score),
        color: '#FCE500',
      }];
    });
  }
}
