import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'accueil',
    pathMatch: 'full'
  },
  {
    path: 'accueil',
    loadComponent: () =>
      import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
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
  {
    path: 'profil',
    loadComponent: () =>
      import('./features/profil/profil.component').then(m => m.ProfilComponent)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: '**',
    redirectTo: 'accueil'
  }
];
