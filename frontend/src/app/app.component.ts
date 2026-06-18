import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './core/layout/header/header.component';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { BottomNavComponent } from './core/layout/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, BottomNavComponent],
  template: `
    @if (showShell) {
      <div class="app-shell">
        <app-header />
        <app-sidebar class="sidebar-desktop" />
        <main class="main-content">
          <router-outlet />
        </main>
        <app-bottom-nav class="bottom-nav-mobile" />
      </div>
    } @else {
      <router-outlet />
    }
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      padding-bottom: calc(var(--bottom-nav-h) + 2rem);
      animation: fadeIn 0.32s ease;
    }
    @media (min-width: 960px) {
      .main-content {
        padding-left: var(--sidebar-w);
        padding-bottom: 3rem;
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AppComponent {
  showShell = !window.location.pathname.startsWith('/login');

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e) => {
      const nav = e as NavigationEnd;
      this.showShell = !nav.urlAfterRedirects.startsWith('/login');
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    });
  }
}
