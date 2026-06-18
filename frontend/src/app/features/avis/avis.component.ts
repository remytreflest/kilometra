import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { ReviewService } from '../../core/services/review.service';
import { SectionEyebrowComponent } from '../../shared/components/section-eyebrow/section-eyebrow.component';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { FilterBarComponent, FilterChip } from '../../shared/components/filter-bar/filter-bar.component';
import { ReviewCardComponent } from '../../shared/components/review-card/review-card.component';

import { Review, ReviewKpis } from '../../shared/models/review.model';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule,
    SectionEyebrowComponent, KpiCardComponent, FilterBarComponent, ReviewCardComponent,
  ],
  template: `
    <div class="mich-container">
      <section class="page-header">
        <app-section-eyebrow>Preuve terrain</app-section-eyebrow>
        <h1>Avis certifiés</h1>
        <p class="page-desc">
          Des retours vérifiés, issus de cyclistes ayant réellement parcouru des kilomètres
          avec leurs pneus Michelin.
        </p>
      </section>

      <!-- KPI -->
      @if (kpis) {
      <section class="avis-section">
        <div class="kpi-grid">
          <app-kpi-card
            [value]="kpis.avgRating + ' / 5'"
            label="Note moyenne certifiée"
          />
          <app-kpi-card
            [value]="kpis.totalReviews"
            label="Avis vérifiés"
          />
          <app-kpi-card
            [value]="kpis.recommendationPct + '%'"
            label="Recommandent le produit"
          />
          <app-kpi-card
            [value]="kpis.verifiedPct + '%'"
            label="Achats vérifiés"
          />
        </div>
      </section>
      }

      <!-- FILTRES -->
      <section class="avis-section">
        <app-filter-bar
          [chips]="filters"
          [activeValue]="activeFilter"
          ariaLabel="Filtres avis"
          (filterChange)="onFilterChange($event)"
        />
      </section>

      <!-- AVIS UTILISATEURS -->
      @if (userReviews.length && (activeFilter === 'all' || activeFilter === 'user')) {
      <section class="avis-section">
        <h3 class="section-title">Retours terrain</h3>
        <div class="reviews-stack">
          @for (review of userReviews; track review.id) {
            <app-review-card [review]="review" />
          }
        </div>
      </section>
      }

      <!-- AVIS INFLUENCEURS -->
      @if (influencerReviews.length && (activeFilter === 'all' || activeFilter === 'influencer')) {
      <section class="avis-section">
        <h3 class="section-title">Tests influenceurs</h3>
        <div class="influencer-grid">
          @for (review of influencerReviews; track review.id) {
            <div class="influencer-card">
              <div class="influencer-avatar" aria-hidden="true">
                <mat-icon>person</mat-icon>
              </div>
              <h4>{{ review.authorName }}</h4>
              <p class="influencer-meta">
                Test sur {{ review.kmWithTire | number }} km
                @if (review.platform) { · {{ review.platform }} }
                @if (review.followerCount) { · {{ review.followerCount | number }} abonnés }
              </p>
              <p class="influencer-quote">« {{ review.comment }} »</p>
              @if (review.sponsoredContent) {
                <span class="sponsored-badge">Contenu sponsorisé</span>
              }
            </div>
          }
        </div>
      </section>
      }

      <section class="avis-section" style="text-align:center;">
        <button mat-raised-button color="primary">
          <mat-icon>rate_review</mat-icon> Laisser un avis
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
    .avis-section {
      padding-block: $space-6;
      & + .avis-section { border-top: 1px solid $border-subtle; }
    }
    .section-title { margin-bottom: $space-4; }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-3;
      @include from-sm { grid-template-columns: repeat(4, 1fr); }
    }
    .reviews-stack { display: flex; flex-direction: column; gap: $space-3; }

    .influencer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $space-4;
      @include from-sm { grid-template-columns: repeat(2, 1fr); }
      @include from-md { grid-template-columns: repeat(3, 1fr); }
    }
    .influencer-card {
      background: $surface-card;
      border: 1px solid $border-subtle;
      border-radius: $radius-lg;
      padding: $space-5;
      box-shadow: $elevation-1;
      display: flex;
      flex-direction: column;
      gap: $space-2;
    }
    .influencer-avatar {
      width: 48px; height: 48px;
      border-radius: 50%;
      background: $color-midnight;
      color: $color-yellow;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }
    h4 { font-size: $text-body; }
    .influencer-meta { font-size: $text-caption; color: $text-secondary; }
    .influencer-quote {
      font-size: $text-small;
      color: $text-primary;
      font-style: italic;
      border-left: 3px solid $color-yellow;
      padding-left: $space-3;
      margin-top: $space-1;
    }
    .sponsored-badge {
      display: inline-block;
      padding: $space-1 $space-3;
      background: $color-blue-100;
      color: $color-blue-700;
      border-radius: $radius-pill;
      font-size: $text-caption;
      font-weight: $weight-bold;
      margin-top: $space-1;
    }
  `]
})
export class AvisComponent implements OnInit {
  kpis: ReviewKpis | null = null;
  userReviews: Review[] = [];
  influencerReviews: Review[] = [];

  filters: FilterChip[] = [
    { label: 'Tous les avis', value: 'all'        },
    { label: '5 étoiles',     value: 'five'       },
    { label: 'Tests terrain', value: 'user'       },
    { label: 'Influenceurs',  value: 'influencer' },
  ];
  activeFilter = 'all';

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    forkJoin({
      kpis: this.reviewService.getKpis(),
      user: this.reviewService.getReviews('user'),
      influencer: this.reviewService.getReviews('influencer'),
    }).subscribe(({ kpis, user, influencer }) => {
      this.kpis = kpis;
      this.userReviews = user;
      this.influencerReviews = influencer;
    });
  }

  onFilterChange(value: string) {
    this.activeFilter = value;
    if (value === 'five') {
      this.reviewService.getReviews('user').subscribe(r => {
        this.userReviews = r.filter(review => review.rating === 5);
      });
    } else {
      forkJoin({
        user: this.reviewService.getReviews('user'),
        influencer: this.reviewService.getReviews('influencer'),
      }).subscribe(({ user, influencer }) => {
        this.userReviews = user;
        this.influencerReviews = influencer;
      });
    }
  }
}
