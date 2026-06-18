import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule],
  template: `
    <div class="login-shell">
      <div class="login-card">

        <div class="login-brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-name">MICHELIN <span class="brand-sub">Performance</span></span>
        </div>

        <h1 class="login-title">Connexion</h1>
        <p class="login-subtitle">Accédez à votre tableau de bord cycliste</p>

        @if (error()) {
          <div class="login-error" role="alert">{{ error() }}</div>
        }

        <form (ngSubmit)="submit()" class="login-form" #loginForm="ngForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Adresse e-mail</mat-label>
            <input
              matInput
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              autocomplete="email"
              [disabled]="loading()"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mot de passe</mat-label>
            <input
              matInput
              [type]="showPwd ? 'text' : 'password'"
              [(ngModel)]="password"
              name="password"
              required
              autocomplete="current-password"
              [disabled]="loading()"
            />
            <button
              matSuffix
              mat-icon-button
              type="button"
              (click)="showPwd = !showPwd"
              [attr.aria-label]="showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            >
              <mat-icon>{{ showPwd ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="full-width submit-btn"
            [disabled]="loading() || !email || !password"
          >
            @if (loading()) { Connexion en cours… } @else { Se connecter }
          </button>
        </form>

        <div class="login-demo">
          <small>
            Démo : <code>admin&#64;michelin.fr</code> / <code>Michelin123!</code>
          </small>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .login-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(160deg, #{$color-midnight} 0%, #{$color-dark-blue} 55%, #{$color-blue-700} 100%);
      padding: $space-6;
    }

    .login-card {
      background: $surface-card;
      border-radius: $radius-xl;
      padding: $space-8;
      width: 100%;
      max-width: 420px;
      box-shadow: $elevation-3;
    }

    .login-brand {
      display: flex;
      align-items: center;
      gap: $space-2;
      font-family: $font-display;
      font-weight: $weight-black;
      font-size: 1.05rem;
      color: $color-blue-700;
      letter-spacing: -0.01em;
      margin-bottom: $space-6;
    }

    .brand-mark {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: $color-blue-700;
      display: inline-block;
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

    .login-title {
      font-family: $font-display;
      font-weight: $weight-black;
      font-size: 1.75rem;
      color: $text-primary;
      margin-bottom: $space-1;
    }

    .login-subtitle {
      font-size: $text-small;
      color: $text-secondary;
      margin-bottom: $space-6;
    }

    .login-error {
      background: #FEE2E2;
      border: 1px solid #FECACA;
      color: #991B1B;
      border-radius: $radius-md;
      padding: $space-3 $space-4;
      font-size: $text-small;
      margin-bottom: $space-4;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: $space-1;
    }

    .full-width {
      width: 100%;
    }

    .submit-btn {
      margin-top: $space-2;
      height: 44px;
      font-weight: $weight-bold !important;
      font-size: $text-body !important;
    }

    .login-demo {
      margin-top: $space-5;
      text-align: center;
      color: $text-secondary;
      font-size: $text-caption;

      code {
        background: $color-grey-50;
        padding: 2px 6px;
        border-radius: $radius-sm;
        font-family: monospace;
        font-size: 0.8rem;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  showPwd = false;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn()) {
      router.navigate(['/dashboard']);
    }
  }

  submit(): void {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.loading.set(false);
        this.error.set('Email ou mot de passe incorrect.');
      },
    });
  }
}
