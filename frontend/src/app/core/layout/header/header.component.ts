import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatBadgeModule, MatMenuModule],
  template: `
    <header class="app-header">
      <div class="mich-container header-inner">
        <a routerLink="/accueil" class="brand" aria-label="Michelin Performance — Accueil">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-text">MICHELIN <span class="brand-sub">Performance</span></span>
        </a>
        <div class="header-actions">
          @if (auth.isLoggedIn()) {
            <button mat-icon-button aria-label="Notifications" class="notif-btn">
              <mat-icon [matBadge]="'3'" matBadgeColor="warn" matBadgeSize="small">notifications_none</mat-icon>
            </button>
            <button [matMenuTriggerFor]="userMenu" class="header-avatar" [attr.aria-label]="'Mon compte — ' + (auth.currentUser()?.firstName ?? '')">
              {{ auth.initials() }}
            </button>
            <mat-menu #userMenu="matMenu" xPosition="before">
              <button mat-menu-item routerLink="/profil">
                <mat-icon>person</mat-icon>
                <span>Mon profil</span>
              </button>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Se déconnecter</span>
              </button>
            </mat-menu>
          } @else {
            <button mat-stroked-button routerLink="/login" class="login-btn">
              <mat-icon>login</mat-icon> Se connecter
            </button>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .app-header {
      position: sticky;
      top: 0;
      z-index: 40;
      background: $surface-card;
      border-bottom: 1px solid $border-subtle;
      height: $header-h;
      display: flex;
      align-items: center;
      box-shadow: $elevation-1;
    }
    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: $space-2;
      font-family: $font-display;
      font-weight: $weight-black;
      font-size: 1.05rem;
      color: $color-blue-700;
      letter-spacing: -0.01em;
      text-decoration: none;
    }
    .brand-mark {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: $color-blue-700;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;

      &::before {
        content: '';
        position: absolute;
        inset: 3px;
        border-radius: 50%;
        background-image: repeating-conic-gradient(
          #{$color-yellow} 0deg 8deg,
          transparent 8deg 24deg
        );
      }
      &::after {
        content: '';
        position: absolute;
        inset: 9px;
        border-radius: 50%;
        background: $color-blue-700;
      }
    }
    .brand-sub {
      color: #2A2C30;
      font-weight: $weight-semibold;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: $space-2;
    }
    .notif-btn {
      color: #2A2C30 !important;
    }
    .header-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: $color-blue-100;
      color: $color-blue-700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: $weight-bold;
      font-size: $text-small;
      border: 2px solid $color-blue-200;
      text-decoration: none;
      font-family: $font-display;
      cursor: pointer;
      transition: border-color 140ms ease;

      &:hover { border-color: $color-blue-700; }
    }
    .login-btn {
      font-weight: $weight-semibold !important;
      font-size: $text-small !important;
      border-color: $color-blue-700 !important;
      color: $color-blue-700 !important;
    }
  `]
})
export class HeaderComponent {
  constructor(protected auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/accueil']);
  }
}
