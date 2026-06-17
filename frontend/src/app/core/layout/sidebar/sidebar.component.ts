import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface NavLink {
  path: string;
  label: string;
  icon: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <nav class="sidebar" aria-label="Navigation principale">
      @for (link of navLinks; track link.path) {
        <a
          [routerLink]="link.path"
          routerLinkActive="active"
          class="sidebar-link"
          [ariaLabel]="link.ariaLabel"
        >
          <mat-icon>{{ link.icon }}</mat-icon>
          {{ link.label }}
        </a>
      }
      <div class="sidebar-footer">
        <a routerLink="/testeurs" class="coupon-cta">
          <span class="coupon-label">Mon coupon</span>
          <span class="coupon-value">−50%</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    :host {
      display: none;
      @media (min-width: 960px) { display: block; }
    }
    .sidebar {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: var(--header-h);
      left: 0;
      bottom: 0;
      width: var(--sidebar-w);
      background: $surface-card;
      border-right: 1px solid $border-subtle;
      padding: $space-6 $space-4;
      z-index: 30;
      gap: $space-1;
      overflow-y: auto;
    }
    .sidebar-link {
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-3 $space-4;
      border-radius: $radius-md;
      color: $text-secondary;
      font-weight: $weight-semibold;
      font-size: $text-small;
      text-decoration: none;
      transition: background 140ms ease, color 140ms ease;

      mat-icon { font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; }

      &:hover { background: $color-grey-50; color: $text-primary; }
      &.active {
        background: $color-blue-700;
        color: $color-white;
        box-shadow: $elevation-brand;
      }
    }
    .sidebar-footer {
      margin-top: auto;
      padding-top: $space-4;
      border-top: 1px solid $border-subtle;
    }
    .coupon-cta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-3 $space-4;
      background: $color-midnight;
      border: 1px dashed $color-yellow-600;
      border-radius: $radius-lg;
      text-decoration: none;
      transition: background 140ms ease;

      &:hover { background: $color-dark-blue; }
    }
    .coupon-label {
      font-size: $text-small;
      font-weight: $weight-semibold;
      color: rgba(255,255,255,0.85);
    }
    .coupon-value {
      font-family: $font-display;
      font-weight: $weight-black;
      font-size: 1.1rem;
      color: $color-yellow;
      letter-spacing: 0.04em;
    }
  `]
})
export class SidebarComponent {
  navLinks: NavLink[] = [
    { path: '/accueil',    label: 'Accueil',        icon: 'home',        ariaLabel: 'Accueil' },
    { path: '/dashboard',  label: 'Tableau de bord', icon: 'dashboard',   ariaLabel: 'Tableau de bord' },
    { path: '/benchmark',  label: 'Benchmark',       icon: 'compare',     ariaLabel: 'Benchmark pneus' },
    { path: '/testeurs',   label: 'Testeurs',        icon: 'layers',      ariaLabel: 'Programme testeurs' },
    { path: '/revendeurs', label: 'Revendeurs',      icon: 'store',       ariaLabel: 'Revendeurs Michelin' },
    { path: '/clubs',      label: 'Classements',     icon: 'emoji_events',ariaLabel: 'Classements clubs' },
    { path: '/avis',       label: 'Avis',            icon: 'star',        ariaLabel: 'Avis certifiés' },
    { path: '/profil',     label: 'Mon profil',      icon: 'person',      ariaLabel: 'Mon profil' },
    { path: '/admin',      label: 'Admin Michelin',  icon: 'admin_panel_settings', ariaLabel: 'Administration Michelin' },
  ];
}
