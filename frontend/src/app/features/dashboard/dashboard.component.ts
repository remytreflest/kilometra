import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { PerformanceService } from '../../core/services/performance.service';
import { TireService } from '../../core/services/tire.service';
import { ActivityService } from '../../core/services/activity.service';
import { TesterService } from '../../core/services/tester.service';

import { SectionEyebrowComponent } from '../../shared/components/section-eyebrow/section-eyebrow.component';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { MpiRingComponent } from '../../shared/components/mpi-ring/mpi-ring.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ActivityCardComponent } from '../../shared/components/activity-card/activity-card.component';
import { TireWearCardComponent } from '../../shared/components/tire-wear-card/tire-wear-card.component';
import { CouponCardComponent } from '../../shared/components/coupon-card/coupon-card.component';

import { PerformanceIndex } from '../../shared/models/performance.model';
import { TireWear, Tire } from '../../shared/models/tire.model';
import { Activity } from '../../shared/models/activity.model';
import { TesterProgress } from '../../shared/models/tester.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule,
    SectionEyebrowComponent, MetricCardComponent, MpiRingComponent,
    BadgeComponent, ActivityCardComponent, TireWearCardComponent, CouponCardComponent,
  ],
  template: `
    <div class="mich-container">

      <!-- HEADER SECTION -->
      <section class="page-header-section">
        <div class="section-header">
          <div>
            <app-section-eyebrow>Bonjour Camille</app-section-eyebrow>
            <h1>Votre tableau de bord</h1>
          </div>
          <app-badge variant="blue">Sortie de mardi importée</app-badge>
        </div>

        <!-- MPI CARD -->
        @if (perf) {
        <app-metric-card>
          <div class="mpi-grid">
            <app-mpi-ring [score]="perf.score" [size]="160" [strokeWidth]="14" />
            <div class="mpi-details">
              <app-badge variant="yellow">{{ perf.level }}</app-badge>
              <p class="mpi-desc">
                Vous progressez plus vite que <strong>{{ perf.percentileBeat }}%</strong>
                des cyclistes de votre catégorie sur les 30 derniers jours.
              </p>
              <div class="mpi-stats">
                <div class="mpi-stat">
                  <span class="stat-value">+{{ perf.monthlyDelta }}</span>
                  <span class="stat-label">pts ce mois</span>
                </div>
                <div class="mpi-stat">
                  <span class="stat-value">{{ perf.weeklyKm }} km</span>
                  <span class="stat-label">sur 7 jours</span>
                </div>
                <div class="mpi-stat">
                  <span class="stat-value">#{{ perf.nationalRank | number }}</span>
                  <span class="stat-label">classement national</span>
                </div>
              </div>
            </div>
          </div>
        </app-metric-card>
        }
      </section>

      <!-- USURE PNEUMATIQUES -->
      @if (wears.length > 0) {
      <section class="dashboard-section">
        <div class="section-header">
          <div>
            <app-section-eyebrow>Suivi matériel</app-section-eyebrow>
            <h2>Usure pneu prédictive</h2>
          </div>
        </div>
        <div class="grid-2">
          @for (wear of wears; track wear.tire.id) {
            <app-tire-wear-card [wear]="wear" />
          }
        </div>

        <!-- Recommandation produit -->
        @if (recoTire) {
        <div class="reco-card">
          <app-section-eyebrow>Recommandation produit</app-section-eyebrow>
          <div class="reco-product-row">
            <div class="reco-thumb" aria-hidden="true">
              <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="#000C34" stroke-width="7"/><circle cx="32" cy="32" r="28" fill="none" stroke="#FCE500" stroke-width="2" stroke-dasharray="3 5"/><circle cx="32" cy="32" r="13" fill="#fff" stroke="#E2E4E7" stroke-width="2"/></svg>
            </div>
            <div>
              <h4>{{ recoTire.name }}</h4>
              <p class="reco-sub">Adhérence supérieure pour vos sorties à fort dénivelé</p>
            </div>
          </div>
          <ul class="reco-reasons">
            <li>Profil d'usure compatible avec votre style de conduite</li>
            <li>+12% d'adhérence mesurée sur revêtement humide</li>
            <li>Recommandé pour les cyclistes "Compétiteur Expert"</li>
          </ul>
          <button mat-raised-button color="primary" routerLink="/benchmark">Comparer ce pneu</button>
        </div>
        }
      </section>
      }

      <!-- COUPON -->
      @if (tester?.couponCode) {
      <section class="dashboard-section">
        <app-coupon-card [code]="tester!.couponCode" />
      </section>
      }

      <!-- ACTIVITÉS RÉCENTES -->
      @if (activities.length > 0) {
      <section class="dashboard-section">
        <div class="section-header">
          <div>
            <app-section-eyebrow>Historique</app-section-eyebrow>
            <h2>Activités récentes</h2>
          </div>
          <button mat-button color="primary" routerLink="/profil">Voir tout</button>
        </div>
        <div class="activity-list">
          @for (act of activities; track act.id) {
            <app-activity-card [activity]="act" />
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

    .page-header-section {
      padding-top: $space-6;
      padding-bottom: $space-8;
    }
    .dashboard-section {
      padding-block: $space-8;
      border-top: 1px solid $border-subtle;
    }
    .section-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: $space-4;
      margin-bottom: $space-5;
      flex-wrap: wrap;
    }

    // MPI
    .mpi-grid {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: $space-5;
      @include from-sm { flex-direction: row; text-align: left; align-items: center; }
    }
    .mpi-details { flex: 1; display: flex; flex-direction: column; gap: $space-3; }
    .mpi-desc {
      font-size: $text-small;
      color: rgba(255,255,255,0.78);
      max-width: 34ch;
      strong { color: #fff; }
    }
    .mpi-stats {
      display: flex;
      gap: $space-5;
      flex-wrap: wrap;
      padding-top: $space-4;
      border-top: 1px solid rgba(255,255,255,0.15);
    }
    .mpi-stat { display: flex; flex-direction: column; gap: 2px; }
    .stat-value { font-family: $font-display; font-weight: $weight-black; font-size: 1.1rem; color: #fff; }
    .stat-label { font-size: $text-caption; color: rgba(212,231,250,0.8); }

    // GRIDS
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr;
      gap: $space-4;
      @include from-sm { grid-template-columns: repeat(2, 1fr); }
    }

    // RECO CARD
    .reco-card {
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-5;
      box-shadow: $elevation-1;
      margin-top: $space-4;
      display: flex;
      flex-direction: column;
      gap: $space-3;
    }
    .reco-product-row {
      display: flex;
      align-items: center;
      gap: $space-3;
    }
    .reco-thumb {
      width: 56px; height: 56px; flex-shrink: 0;
      svg { width: 100%; height: 100%; }
    }
    .reco-sub { font-size: $text-caption; color: $text-secondary; margin-top: $space-1; }
    .reco-reasons {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: $space-2;
      li {
        font-size: $text-small;
        color: $text-secondary;
        padding-left: $space-5;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: 0; top: 7px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: $color-green;
        }
      }
    }

    // ACTIVITIES
    .activity-list { display: flex; flex-direction: column; gap: $space-3; }
  `]
})
export class DashboardComponent implements OnInit {
  perf: PerformanceIndex | null = null;
  wears: TireWear[] = [];
  recoTire: Tire | null = null;
  activities: Activity[] = [];
  tester: TesterProgress | null = null;

  constructor(
    private perfService: PerformanceService,
    private tireService: TireService,
    private activityService: ActivityService,
    private testerService: TesterService,
  ) {}

  ngOnInit() {
    forkJoin({
      perf: this.perfService.getIndex(),
      wears: this.tireService.getUserWear(),
      activities: this.activityService.getRecentActivities(3),
      tester: this.testerService.getProgress(),
    }).subscribe(({ perf, wears, activities, tester }) => {
      this.perf = perf;
      this.wears = wears;
      this.activities = activities;
      this.tester = tester;
    });

    this.tireService.getTireById('m2').subscribe(tire => {
      if (tire) this.recoTire = tire;
    });
  }
}
