import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { PerformanceService } from '../../core/services/performance.service';
import { TesterService } from '../../core/services/tester.service';
import { AuthService } from '../../core/services/auth.service';

import { SectionEyebrowComponent } from '../../shared/components/section-eyebrow/section-eyebrow.component';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { MpiRingComponent } from '../../shared/components/mpi-ring/mpi-ring.component';
import { TreadlineComponent } from '../../shared/components/treadline/treadline.component';
import { ProgressTrackComponent } from '../../shared/components/progress-track/progress-track.component';

import { PerformanceIndex } from '../../shared/models/performance.model';
import { TesterProgress } from '../../shared/models/tester.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule,
    SectionEyebrowComponent, KpiCardComponent, MpiRingComponent,
    TreadlineComponent, ProgressTrackComponent,
  ],
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="tread-bg" aria-hidden="true"></div>
      <div class="mich-container hero-inner">
        <app-section-eyebrow [onDark]="true">Performance cycliste — données réelles</app-section-eyebrow>
        <h1 class="hero-title">Chaque kilomètre devient une donnée de performance.</h1>
        <p class="hero-sub">
          Connectez votre activité, mesurez l'usure réelle de vos pneus, comparez vos performances
          à la communauté — et roulez sur ce que la donnée recommande pour vous.
        </p>
        <div class="hero-cta-row">
          @if (auth.isLoggedIn()) {
            <button mat-raised-button color="accent" routerLink="/dashboard" class="hero-cta">
              <mat-icon>dashboard</mat-icon> Mon tableau de bord
            </button>
          } @else {
            <button mat-raised-button color="accent" routerLink="/login" class="hero-cta">
              <mat-icon>login</mat-icon> Se connecter
            </button>
          }
          <button mat-stroked-button routerLink="/benchmark" class="hero-ghost">
            Voir le benchmark
          </button>
        </div>
        <app-treadline maxWidth="240px" />
      </div>
    </section>

    <div class="mich-container">

      <!-- MPI PREVIEW — uniquement si connecté -->
      @if (auth.isLoggedIn() && perf) {
      <section class="section">
        <app-section-eyebrow>Indice propriétaire</app-section-eyebrow>
        <div class="mpi-preview-card">
          <div class="tread-bg" aria-hidden="true"></div>
          <div class="mpi-preview-grid">
            <div>
              <p class="mpi-subtitle">Michelin Performance Index</p>
              <h2 class="on-dark">Votre score, basé sur vos données réelles</h2>
              <p class="mpi-desc">
                Régularité, puissance estimée, gestion de l'effort et comportement pneu :
                un score unique sur 1000, mis à jour à chaque sortie.
              </p>
            </div>
            <div class="mpi-ring-wrap" aria-hidden="true">
              <app-mpi-ring [score]="perf.score" [size]="140" />
            </div>
          </div>
        </div>
      </section>
      }

      <!-- INVITE CONNEXION — si non connecté, à la place du MPI -->
      @if (!auth.isLoggedIn()) {
      <section class="section">
        <div class="connect-invite">
          <div class="tread-bg" aria-hidden="true"></div>
          <div class="connect-invite-inner">
            <div>
              <p class="mpi-subtitle" style="color:rgba(212,231,250,0.9)">Michelin Performance Index</p>
              <h2 class="on-dark">Connectez-vous pour voir votre score</h2>
              <p class="mpi-desc">
                Régularité, puissance estimée, gestion de l'effort et comportement pneu :
                un score unique sur 1000, mis à jour à chaque sortie.
              </p>
              <button mat-raised-button color="accent" routerLink="/login" style="margin-top:1rem">
                <mat-icon>login</mat-icon> Se connecter
              </button>
            </div>
            <div class="mpi-ring-wrap" aria-hidden="true">
              <app-mpi-ring [score]="0" [size]="140" />
            </div>
          </div>
        </div>
      </section>
      }

      <!-- TESTEUR PROMO — uniquement si connecté -->
      @if (auth.isLoggedIn() && tester) {
      <section class="section">
        <div class="section-header">
          <div>
            <app-section-eyebrow>Programme testeurs Michelin</app-section-eyebrow>
            <h2>Roulez avant tout le monde</h2>
          </div>
        </div>
        <div class="tester-promo-card">
          <div class="tester-promo-text">
            <h3>Devenez testeur officiel</h3>
            <p class="text-secondary" style="margin-top:0.5rem; font-size:0.875rem;">
              Accumulez des kilomètres validés pour débloquer l'accès aux Michelin Labs,
              des prototypes en avant-première et un coupon de −50% sur votre prochain train de pneus.
            </p>
            <div class="tester-progress">
              <div class="tester-progress-labels">
                <span>{{ tester.currentKm | number }} km</span>
                <span>{{ tester.nextMilestoneKm | number }} km</span>
              </div>
              <app-progress-track [value]="tester.progressPct" variant="yellow" [height]="8" />
            </div>
            <button mat-stroked-button color="primary" routerLink="/testeurs" style="margin-top:1rem;">
              Découvrir le programme
            </button>
          </div>
          <div class="tester-promo-visual" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#D4E7FA" stroke-width="10"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#27509B" stroke-width="10"
                stroke-linecap="round" stroke-dasharray="264"
                [attr.stroke-dashoffset]="264 * (1 - tester.progressPct / 100)"
                transform="rotate(-90 50 50)"/>
            </svg>
          </div>
        </div>
      </section>
      }

      <!-- KPI COMMUNAUTÉ — toujours visible -->
      @if (community) {
      <section class="section">
        <div class="section-header">
          <div>
            <app-section-eyebrow>La communauté en chiffres</app-section-eyebrow>
            <h2>Une performance collective</h2>
          </div>
        </div>
        <div class="kpi-grid">
          <app-kpi-card value="25 000" label="Cyclistes actifs" delta="+8% ce mois" [deltaPositive]="true" />
          <app-kpi-card value="320" label="Clubs inscrits" delta="+14 ce mois" [deltaPositive]="true" />
          <app-kpi-card value="1,8M km" label="Km analysés" delta="+62k cette semaine" [deltaPositive]="true" />
          <app-kpi-card value="31%" label="Crevaisons en moins*" note="*utilisateurs Michelin" />
        </div>
      </section>
      }

    </div>

    <!-- FOOTER -->
    <footer class="app-footer">
      <div class="mich-container">
        <div class="footer-brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span style="font-family: Montserrat, sans-serif; font-weight:900; color:#fff;">MICHELIN</span>
          <span style="color:rgba(255,255,255,0.7); font-weight:600;"> Performance</span>
        </div>
        <div class="footer-grid">
          <div class="footer-col">
            <h4>Produit</h4>
            <a routerLink="/dashboard">Tableau de bord</a>
            <a routerLink="/benchmark">Benchmark pneus</a>
            <a routerLink="/clubs">Classements</a>
          </div>
          <div class="footer-col">
            <h4>Programme</h4>
            <a routerLink="/testeurs">Devenir testeur</a>
            <a routerLink="/avis">Avis certifiés</a>
            <a routerLink="/revendeurs">Trouver un revendeur</a>
          </div>
          <div class="footer-col">
            <h4>Ressources</h4>
            <a href="#">Méthodologie de l'indice</a>
            <a href="#">Documentation API Strava</a>
            <a href="#">Centre d'aide</a>
          </div>
          <div class="footer-col">
            <h4>Légal</h4>
            <a href="#">Mentions légales</a>
            <a href="#">Confidentialité des données</a>
            <a href="#">CGU</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Compagnie Générale des Établissements Michelin</span>
          <span>Données mockées — démonstration hackathon</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;
    @use 'styles/design-tokens/breakpoints' as *;

    // HERO
    .hero {
      position: relative;
      background: linear-gradient(160deg, #{$color-midnight} 0%, #{$color-dark-blue} 55%, #{$color-blue-700} 100%);
      color: #fff;
      padding: $space-10 0 $space-12;
      overflow: hidden;
    }
    .tread-bg {
      position: absolute; inset: 0;
      background-image: repeating-linear-gradient(
        115deg,
        rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px,
        transparent 2px, transparent 16px
      );
      pointer-events: none;
    }
    .hero-inner { position: relative; z-index: 1; max-width: 680px; }
    .hero-title {
      font-family: $font-display;
      font-weight: $weight-black;
      font-size: 2.25rem;
      line-height: 1.08;
      letter-spacing: -0.015em;
      margin-bottom: $space-4;
      @include from-md { font-size: 3rem; }
    }
    .hero-sub {
      font-size: $text-body;
      color: rgba(255,255,255,0.78);
      max-width: 46ch;
      margin-bottom: $space-6;
    }
    .hero-cta-row {
      display: flex;
      flex-wrap: wrap;
      gap: $space-3;
      margin-bottom: $space-8;
    }
    .hero-cta  { font-weight: $weight-bold !important; }
    .hero-ghost {
      border-color: rgba(255,255,255,0.35) !important;
      color: #fff !important;
      &:hover { background: rgba(255,255,255,0.1) !important; }
    }

    // SECTION
    .section {
      padding-block: $space-8;
      & + .section { border-top: 1px solid $border-subtle; }
    }
    .section-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: $space-4;
      margin-bottom: $space-5;
    }

    // MPI PREVIEW CARD
    .mpi-preview-card, .connect-invite {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #{$color-blue-700}, #{$color-dark-blue});
      border-radius: $radius-xl;
      padding: $space-6;
      box-shadow: $elevation-brand;
    }
    .mpi-preview-grid, .connect-invite-inner {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: $space-6;
      @include from-sm { flex-direction: row; align-items: center; justify-content: space-between; }
    }
    .mpi-ring-wrap { align-self: center; }
    .mpi-subtitle { color: rgba(212,231,250,0.9); font-weight: $weight-semibold; font-size: $text-small; margin-bottom: $space-1; }
    .on-dark { color: #fff !important; }
    .mpi-desc { font-size: $text-small; color: rgba(255,255,255,0.75); max-width: 36ch; margin-top: $space-2; }

    // TESTEUR PROMO
    .tester-promo-card {
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-xl;
      padding: $space-6;
      display: flex;
      align-items: center;
      gap: $space-6;
      box-shadow: $elevation-1;
      flex-wrap: wrap;
    }
    .tester-promo-text { flex: 1; min-width: 260px; }
    .tester-promo-visual {
      width: 84px;
      flex-shrink: 0;
      display: none;
      @include from-sm { display: block; }
    }
    .tester-progress { margin-top: $space-4; }
    .tester-progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: $text-caption;
      color: $text-secondary;
      margin-bottom: $space-1;
    }

    // KPI GRID
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-3;
      @include from-sm { grid-template-columns: repeat(3, 1fr); }
      @include from-md { grid-template-columns: repeat(4, 1fr); gap: $space-4; }
    }

    // FOOTER
    .app-footer {
      background: $color-midnight;
      color: rgba(255,255,255,0.7);
      padding: $space-10 0 calc(#{$bottom-nav-h} + #{$space-6});
      margin-top: $space-12;
      @include from-md { padding-bottom: $space-10; }
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: $space-2;
      margin-bottom: $space-4;
    }
    .brand-mark {
      width: 30px; height: 30px;
      border-radius: 50%;
      background: $color-blue-700;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
      &::before {
        content: '';
        position: absolute; inset: 3px; border-radius: 50%;
        background-image: repeating-conic-gradient(#{$color-yellow} 0deg 8deg, transparent 8deg 24deg);
      }
      &::after { content: ''; position: absolute; inset: 9px; border-radius: 50%; background: $color-blue-700; }
    }
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-6;
      margin-bottom: $space-8;
      @include from-sm { grid-template-columns: repeat(4, 1fr); }
    }
    .footer-col {
      h4 { color: #fff; font-size: $text-small; margin-bottom: $space-3; }
      a  { display: block; font-size: $text-small; padding: $space-1 0; color: rgba(255,255,255,0.65); transition: color 140ms ease; }
      a:hover { color: #fff; }
    }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.12);
      padding-top: $space-5;
      font-size: $text-caption;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: $space-2;
    }
  `]
})
export class LandingComponent implements OnInit {
  perf: PerformanceIndex | null = null;
  tester: TesterProgress | null = null;
  community: object | null = null;

  constructor(
    protected auth: AuthService,
    private perfService: PerformanceService,
    private testerService: TesterService,
  ) {}

  ngOnInit() {
    // Les KPIs communauté sont publics — toujours chargés
    this.perfService.getCommunityKpis().subscribe(community => {
      this.community = community;
    });

    // Les données personnalisées ne sont chargées que si l'utilisateur est connecté
    if (this.auth.isLoggedIn()) {
      forkJoin({
        perf: this.perfService.getIndex(),
        tester: this.testerService.getProgress(),
      }).subscribe(({ perf, tester }) => {
        this.perf = perf;
        this.tester = tester;
      });
    }
  }
}
