# Architecture Frontend — Angular 18

## Vue d'ensemble

L'application frontend est une **Single Page Application (SPA)** Angular 18 servie par Nginx sous forme de fichiers statiques compilés.
Elle communique exclusivement avec le backend via des requêtes HTTP vers le préfixe `/api/`.

---

## Structure des dossiers

```
frontend/src/
├── main.ts                     # Bootstrap Angular (provideHttpClient + authInterceptor)
├── app/
│   ├── app.component.ts        # Root component
│   ├── app.routes.ts           # Routing principal (lazy loading)
│   ├── core/
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts   # Ajoute Bearer token sur chaque requête
│   │   ├── layout/             # Header, Sidebar, BottomNav
│   │   └── services/
│   │       ├── api.service.ts        # Wrapper HttpClient — préfixe /api, désencapsule {success, data}
│   │       ├── auth.service.ts       # Login, logout, getToken(), isLoggedIn()
│   │       ├── activity.service.ts
│   │       ├── admin.service.ts
│   │       ├── club.service.ts
│   │       ├── dealer.service.ts
│   │       ├── performance.service.ts
│   │       ├── review.service.ts
│   │       ├── tester.service.ts
│   │       ├── tire.service.ts       # Inclut adaptateur adhesion→scores.grip
│   │       └── user.service.ts
│   ├── features/               # Composants lazy-loaded
│   │   ├── accueil/            # Landing page (/)
│   │   ├── dashboard/
│   │   ├── benchmark/
│   │   ├── testeurs/
│   │   ├── revendeurs/
│   │   ├── clubs/
│   │   ├── avis/
│   │   ├── profil/
│   │   └── admin/
│   └── shared/
│       ├── components/         # Composants réutilisables (buttons, cards...)
│       └── models/             # Interfaces TypeScript partagées
└── assets/
```

> Pas de répertoire `environments/` — l'URL de l'API est simplement `/api` (relatif), proxyfié par nginx vers le backend.

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

## Tests unitaires — Jest

Le frontend utilise **Jest 29.7.0** avec **jest-preset-angular 14.5.0** pour tester les composants et services Angular 18.

### Configuration

- **jest.config.js** : Configuration d'entrée avec preset `jest-preset-angular`
- **setup-jest.ts** : Initialisation du test environment (Zone.js + Angular compiler)
- **tsconfig.spec.json** : Configuration TypeScript spécifique aux tests (module: commonjs, esModuleInterop: true)

### Scripts de test

```bash
npm test              # Lance les tests une fois
npm run test:watch   # Lance les tests en mode watch
npm run test:coverage # Génère un rapport de couverture
```

### Bonnes pratiques

1. **Mocks HTTP** : Utiliser `jest.fn()` avec `of()` de RxJS pour retourner des Observables
   ```typescript
   (httpClientSpy.get as jest.Mock).mockReturnValue(of({ success: true, data: [...] }));
   ```

2. **Instanciation directe** : Les composants et services se testent directement (pas de TestBed pour injections simples)
   ```typescript
   service = new TodoService(httpClientSpy);
   component = new TodoComponent(serviceSpy);
   ```

3. **Mocks de services** : Mocquer les dépendances avec `jest.Mocked<ServiceType>`
   ```typescript
   const serviceSpy: jest.Mocked<TodoService> = {
     findAll: jest.fn().mockReturnValue(of([]))
   } as jest.Mocked<TodoService>;
   ```

4. **Assertions Observable** : S'abonner au Observable et vérifier les valeurs émises
   ```typescript
   service.findAll().subscribe((todos) => {
     expect(todos).toEqual([mockTodo]);
   });
   ```

### Règle de merge

**Tous les composants et services critiques doivent être accompagnés d'un test unitaire avant d'être mergés.**
Couverture minimale requise : 80% de statements et branches pour les fichiers principaux (services, composants critiques).

---

## Communication avec l'API

Utiliser `ApiService` (dans `core/services/`) pour toutes les requêtes. Ne jamais appeler `HttpClient` directement dans les composants.

`ApiService` préfixe automatiquement `/api` et désencapsule le format `{success: bool, data: T}` du backend.

```typescript
// Exemple dans un feature service
constructor(private api: ApiService) {}

getTodos() {
  return this.api.get<Todo[]>('/todos');             // GET /api/todos
}

createTodo(data: Partial<Todo>) {
  return this.api.post<Todo>('/todos', data);        // POST /api/todos
}
```

Pour les routes protégées, le `AuthInterceptor` (branché dans `main.ts`) ajoute automatiquement le header `Authorization: Bearer <token>` si un token est présent dans le `localStorage`.

Pour l'authentification :
```typescript
constructor(private auth: AuthService) {}

login() {
  this.auth.login('email', 'password').subscribe(() => { /* redirige */ });
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
