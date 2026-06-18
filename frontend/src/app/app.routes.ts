import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'accueil',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent)
  },
  // Routes publiques
  {
    path: 'accueil',
    loadComponent: () =>
      import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'benchmark',
    loadComponent: () =>
      import('./features/benchmark/benchmark.component').then(m => m.BenchmarkComponent)
  },
  {
    path: 'testeurs',
    loadComponent: () =>
      import('./features/testeurs/testeurs.component').then(m => m.TesteursComponent)
  },
  {
    path: 'revendeurs',
    loadComponent: () =>
      import('./features/revendeurs/revendeurs.component').then(m => m.RevendeursComponent)
  },
  {
    path: 'clubs',
    loadComponent: () =>
      import('./features/clubs/clubs.component').then(m => m.ClubsComponent)
  },
  {
    path: 'avis',
    loadComponent: () =>
      import('./features/avis/avis.component').then(m => m.AvisComponent)
  },
  // Routes protégées (authentification requise)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profil/profil.component').then(m => m.ProfilComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: '**',
    redirectTo: 'accueil'
  }
];
