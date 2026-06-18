# Kilometra

Application de suivi de pneumatiques vélo pour cyclistes, développée lors d'un hackathon Michelin. Permet de suivre l'usure des pneus, comparer les performances, rejoindre des clubs et consulter un programme testeur.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Angular 18 SPA │────▶│ Express/Node API  │────▶│  PostgreSQL  │
│   (port 4200)   │     │ (port 3000 /api/) │     │  (Prisma 5)  │
└─────────────────┘     └──────────────────┘     └──────────────┘
         │                       │
    Lazy routing            JWT + bcrypt
    Tailwind + Material     12 modules métier
    Intercepteur HTTP       Format { success, data, error }
```

**Stack** : Angular 18 · Express 4 · Prisma 5 · PostgreSQL 15 · Docker · GitHub Actions

### Fonctionnalités

| Module | Description |
|--------|-------------|
| Dashboard | Indice MPI, usure prédictive, activités récentes |
| Benchmark | Comparaison de pneus par catégorie |
| Clubs | Gestion de clubs et classements |
| Revendeurs | Localisation par géolocalisation |
| Testeurs | Programme testeur officiel Michelin |
| Avis | Avis utilisateurs et influenceurs |
| Admin | Dashboard administrateur (régions, KPIs) |

---

## Démarrage rapide (Docker)

```bash
# 1. Copier et remplir les variables d'environnement
cp .env.example .env

# 2. Lancer tous les services — migrations et seed sont automatiques
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| API | http://localhost:3000/api/ |
| Swagger | http://localhost:3000/api/docs |

**Credentials de test**

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@michelin.fr` | `Michelin123!` |
| Utilisateur | voir `backend/prisma/seed.js` | `Michelin123!` |

---

## Développement local (sans Docker)

**Backend** (port 3000)
```bash
cd backend && npm install && npm run dev
```

**Frontend** (port 4200)
```bash
cd frontend && npm install && ng serve
```

> Requiert PostgreSQL local. Configurer `DATABASE_URL` dans `.env` puis `npx prisma migrate dev`.

---

## Structure du projet

```
kilometra/
├── backend/
│   ├── src/
│   │   ├── modules/         # 12 modules : auth, users, tires, wear, clubs,
│   │   │                    #   leaderboard, performance, dealers, reviews,
│   │   │                    #   tester, admin, activities
│   │   ├── middlewares/     # JWT (authMiddleware), admin role, error handler
│   │   ├── config/          # Env validé, singleton Prisma
│   │   └── utils/           # formatResponse / formatError
│   └── prisma/              # Schéma (modèles), migrations, seed
├── frontend/
│   └── src/app/
│       ├── core/            # Guards, intercepteur Bearer token, services HTTP
│       ├── features/        # 11 pages lazy-loaded
│       └── shared/          # Composants réutilisables + modèles TypeScript
├── docs/                    # Architecture détaillée (api.md, front.md)
└── docker-compose.yml
```

### Pattern backend

Chaque module suit un pattern 3 fichiers :

```
modules/<name>/
├── <name>.routes.ts      # Définition des routes Express
├── <name>.controller.ts  # Extraction req/res, appel service
└── <name>.service.ts     # Logique métier + requêtes Prisma
```

Toutes les réponses API respectent le format :
```json
{ "success": true, "data": {} }
{ "success": false, "error": { "message": "...", "code": "..." } }
```

---

## Tests

```bash
cd backend  && npm test
cd frontend && npm run test:coverage
```

Les services backend sont testés avec Jest + mock Prisma. Les composants Angular avec jest-preset-angular.

---

## CI/CD

- **`.github/workflows/test.yml`** — tests automatiques sur push/PR vers `main`
- **`.github/workflows/deploy.yml`** — build Docker → push GHCR → deploy Docker Swarm sur VPS

Secrets GitHub requis : `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `DEPLOY_PATH`

**Variables d'environnement** (`.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `JWT_SECRET` | Clé de signature des tokens JWT |
| `PORT` | Port de l'API (défaut : `3000`) |
| `FRONTEND_URL` | URL du frontend pour CORS |
