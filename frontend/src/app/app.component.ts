import { Component, OnInit } from '@angular/core';
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
    <div class="app-shell">
      <app-header />
      <app-sidebar class="sidebar-desktop" />
      <main class="main-content">
        <router-outlet />
      </main>
      <app-bottom-nav class="bottom-nav-mobile" />
    </div>
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
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }));
  }
}
