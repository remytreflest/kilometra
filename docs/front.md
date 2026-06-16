# Architecture Frontend — Angular 18

## Vue d'ensemble

L'application frontend est une **Single Page Application (SPA)** Angular 18 servie par Nginx sous forme de fichiers statiques compilés.
Elle communique exclusivement avec le backend via des requêtes HTTP vers le préfixe `/api/`.

---

## Structure des dossiers

```
frontend/src/
├── main.ts                     # Bootstrap Angular
├── app/
│   ├── app.component.ts        # Root component
│   ├── app.routes.ts           # Routing principal (lazy loading)
│   ├── core/
│   │   ├── interceptors/       # HTTP interceptors (auth, errors)
│   │   ├── guards/             # Route guards (auth)
│   │   └── services/           # Services globaux (AuthService, ApiService)
│   ├── features/               # Feature modules lazy-loaded
│   │   └── [feature]/
│   │       ├── [feature].routes.ts
│   │       ├── [feature].component.ts
│   │       └── [feature].service.ts
│   └── shared/
│       ├── components/         # Composants réutilisables (buttons, cards...)
│       └── models/             # Interfaces TypeScript partagées
├── environments/
│   ├── environment.ts          # Dev (apiUrl: 'http://localhost:3000')
│   └── environment.prod.ts     # Prod (apiUrl: '/api')
└── assets/
```

---

## Conventions de nommage

| Élément           | Convention            | Exemple                        |
|-------------------|-----------------------|--------------------------------|
| Composant         | PascalCase            | `UserProfileComponent`         |
| Service           | PascalCase + Service  | `AuthService`                  |
| Fichier           | kebab-case            | `user-profile.component.ts`    |
| Route (URL)       | kebab-case            | `/user-profile`                |
| Interface         | PascalCase (pas de I) | `UserProfile`                  |
| Observable        | suffixe `$`           | `users$`                       |

---

## Routing & Lazy Loading

Toutes les features sont lazy-loadées :

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'todos',
    loadChildren: () => import('./features/todos/todos.routes')
  },
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: '**', redirectTo: 'todos' }
];
```

---

## HTTP Interceptor

Un intercepteur global `ApiInterceptor` est configuré dans `core/interceptors/` :
- Ajoute le header `Authorization: Bearer <token>` si un token JWT est présent dans le localStorage
- Redirige vers `/login` en cas de réponse `401`

---

## Communication avec l'API

Utiliser `ApiService` (dans `core/services/`) pour toutes les requêtes. Ne jamais appeler `HttpClient` directement dans les composants.

```typescript
// Exemple dans un feature service
constructor(private api: ApiService) {}

getTodos() {
  return this.api.get<Todo[]>('/todos');
}
```

---

## Styling — TailwindCSS

- Utiliser exclusivement les classes Tailwind utility-first
- Pas de CSS custom sauf pour des animations ou cas impossibles avec Tailwind
- Responsive par défaut : mobile-first (`sm:`, `md:`, `lg:`)
- Palette de couleurs définie dans `tailwind.config.js`

---

## Build & Docker

```bash
# Build prod (génère dist/app/)
npm run build

# Dockerfile : multi-stage
# Stage 1 : npm run build → dist/
# Stage 2 : Nginx sert dist/ en static
```

Le `nginx.conf` est configuré avec `try_files $uri /index.html` pour le routing Angular côté client.
