import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TesterService } from '../../core/services/tester.service';
import { SectionEyebrowComponent } from '../../shared/components/section-eyebrow/section-eyebrow.component';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { ProgressTrackComponent } from '../../shared/components/progress-track/progress-track.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { RewardCardComponent } from '../../shared/components/reward-card/reward-card.component';
import { TesterProgress } from '../../shared/models/tester.model';

@Component({
  selector: 'app-testeurs',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule,
    SectionEyebrowComponent, MetricCardComponent, ProgressTrackComponent,
    BadgeComponent, RewardCardComponent,
  ],
  template: `
    <div class="mich-container">
      <section class="page-header">
        <app-section-eyebrow>Programme testeurs Michelin</app-section-eyebrow>
        <h1>Roulez avant tout le monde</h1>
        <p class="page-desc">
          Validez des kilomètres réels pour débloquer des récompenses exclusives
          et accéder aux prototypes Michelin Labs.
        </p>
      </section>

      @if (tester) {
      <!-- PROGRESSION -->
      <section class="test-section">
        <app-metric-card>
          <div class="progress-content">
            <div class="progress-labels">
              <p class="progress-title">Progression vers le palier suivant</p>
              <app-badge variant="yellow">{{ tester.currentKm | number }} / {{ tester.nextMilestoneKm | number }} km</app-badge>
            </div>
            <app-progress-track
              [value]="tester.progressPct"
              variant="yellow"
              [height]="16"
              [tread]="true"
            />
            <p class="progress-note">
              {{ tester.nextMilestoneKm - tester.currentKm | number }} km restants pour débloquer l'accès Michelin Labs
            </p>
            <div class="tester-stats">
              <div>
                <span class="stat-val">{{ tester.totalTesters | number }}</span>
                <span class="stat-lbl">testeurs actifs</span>
              </div>
              <div>
                <span class="stat-val">#{{ tester.rank | number }}</span>
                <span class="stat-lbl">votre rang</span>
              </div>
              <div>
                <span class="stat-val">{{ tester.couponCode }}</span>
                <span class="stat-lbl">votre coupon</span>
              </div>
            </div>
          </div>
        </app-metric-card>
      </section>

      <!-- RÉCOMPENSES -->
      <section class="test-section">
        <h3 class="section-title">Récompenses du programme</h3>
        <div class="rewards-grid">
          @for (reward of tester.rewards; track reward.id) {
            <app-reward-card [reward]="reward" />
          }
        </div>
      </section>

      <!-- COMMENT ÇA MARCHE -->
      <section class="test-section">
        <h3 class="section-title">Comment ça marche ?</h3>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-num">1</div>
            <h4>Connectez Strava</h4>
            <p>Synchronisez vos activités en temps réel pour valider automatiquement vos kilomètres.</p>
          </div>
          <div class="step-card">
            <div class="step-num">2</div>
            <h4>Roulez régulièrement</h4>
            <p>Chaque sortie compte. Plus vous êtes régulier, plus vous progressez dans le programme.</p>
          </div>
          <div class="step-card">
            <div class="step-num">3</div>
            <h4>Débloquez des récompenses</h4>
            <p>Coupons, accès Labs, prototypes : des avantages exclusifs réservés aux testeurs actifs.</p>
          </div>
        </div>
      </section>

      <section class="test-section" style="text-align:center;">
        <button mat-raised-button color="primary" routerLink="/dashboard">
          Voir ma progression complète
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

    .page-header { padding-top: $space-6; padding-bottom: $space-5; }
    .page-desc   { font-size: $text-small; color: $text-secondary; margin-top: $space-2; max-width: 56ch; }
    .test-section {
      padding-block: $space-8;
      & + .test-section { border-top: 1px solid $border-subtle; }
    }
    .section-title { margin-bottom: $space-4; }

    /* PROGRESS */
    .progress-content { display: flex; flex-direction: column; gap: $space-3; }
    .progress-labels {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $space-3;
    }
    .progress-title { color: rgba(196,214,239,0.9); font-weight: $weight-semibold; font-size: $text-small; }
    .progress-note  { font-size: $text-caption; color: rgba(255,255,255,0.65); }
    .tester-stats {
      display: flex;
      gap: $space-6;
      flex-wrap: wrap;
      padding-top: $space-3;
      border-top: 1px solid rgba(255,255,255,0.15);
    }
    .stat-val { display: block; font-family: $font-display; font-weight: $weight-black; font-size: 1.1rem; color: #fff; }
    .stat-lbl { display: block; font-size: $text-caption; color: rgba(212,231,250,0.8); }

    /* REWARDS */
    .rewards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $space-4;
      @include from-sm { grid-template-columns: repeat(2, 1fr); }
      @include from-md { grid-template-columns: repeat(4, 1fr); }
    }

    /* STEPS */
    .steps-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $space-4;
      @include from-sm { grid-template-columns: repeat(3, 1fr); }
    }
    .step-card {
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-5;
      box-shadow: $elevation-1;
    }
    .step-num {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: $color-blue-700;
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-family: $font-display;
      font-weight: $weight-black;
      font-size: 1rem;
      margin-bottom: $space-3;
    }
    h4  { margin-bottom: $space-2; }
    p   { font-size: $text-small; color: $text-secondary; }
  `]
})
export class TesteursComponent implements OnInit {
  tester: TesterProgress | null = null;

  constructor(private testerService: TesterService) {}

  ngOnInit() {
    this.testerService.getProgress().subscribe(t => this.tester = t);
  }
}
