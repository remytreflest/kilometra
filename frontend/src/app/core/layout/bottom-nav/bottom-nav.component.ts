import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <nav class="bottom-nav" aria-label="Navigation principale mobile">
      <a routerLink="/accueil"    routerLinkActive="active" class="nav-item" aria-label="Accueil">
        <mat-icon>home</mat-icon><span>Accueil</span>
      </a>
      <a routerLink="/dashboard"  routerLinkActive="active" class="nav-item" aria-label="Tableau de bord">
        <mat-icon>dashboard</mat-icon><span>Bilan</span>
      </a>
      <a routerLink="/benchmark"  routerLinkActive="active" class="nav-item" aria-label="Benchmark">
        <mat-icon>compare</mat-icon><span>Comparer</span>
      </a>
      <a routerLink="/clubs"      routerLinkActive="active" class="nav-item" aria-label="Clubs">
        <mat-icon>emoji_events</mat-icon><span>Clubs</span>
      </a>
      <a routerLink="/profil"     routerLinkActive="active" class="nav-item" aria-label="Profil">
        <mat-icon>person</mat-icon><span>Profil</span>
      </a>
    </nav>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;

    :host {
      display: block;
      @media (min-width: 960px) { display: none; }
    }
    .bottom-nav {
      position: fixed;
      left: 0; right: 0; bottom: 0;
      z-index: 50;
      height: var(--bottom-nav-h);
      background: $surface-card;
      border-top: 1px solid $border-subtle;
      display: flex;
      padding-bottom: env(safe-area-inset-bottom, 0);
      box-shadow: 0 -4px 16px rgba(0,12,52,0.06);
    }
    .nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      color: $color-grey-400;
      font-size: 0.6875rem;
      font-weight: $weight-semibold;
      min-height: 48px;
      position: relative;
      text-decoration: none;
      transition: color 140ms ease;

      mat-icon { font-size: 22px; width: 22px; height: 22px; }
      span { font-size: 0.6875rem; }

      &.active {
        color: $color-blue-700;
        &::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 28px; height: 3px;
          border-radius: 0 0 4px 4px;
          background: $color-yellow;
        }
      }
    }
  `]
})
export class BottomNavComponent {}
