# Kilometra

Application de suivi de pneumatiques vélo pour cyclistes, développée lors d'un hackathon Michelin.
Permet de suivre l'usure des pneus, comparer les performances, rejoindre des clubs et consulter un programme testeur.

**Production** : https://michelin.qwaklab.fr

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Angular 18 SPA │────▶│ Express/Node API  │────▶│  PostgreSQL  │
│  Nginx (static) │     │ (port 3000 /api/) │     │  (Prisma 5)  │
└─────────────────┘     └──────────────────┘     └──────────────┘
         │                       │
    Lazy routing            JWT + bcrypt
    Tailwind + Material     12 modules métier
    Intercepteur HTTP       Format { success, data, error }
```

**Stack** : Angular 18 · Express 4 · Prisma 5 · PostgreSQL 15 · Docker Swarm · GitHub Actions

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

### Structure du projet

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
│   ├── prisma/              # Schéma, migrations, seed
│   └── docker-entrypoint.sh # migrate deploy + seed conditionnel + node dist/main.js
├── frontend/
│   └── src/app/
│       ├── core/            # Guards, intercepteur Bearer token, services HTTP
│       ├── features/        # 11 pages lazy-loaded
│       └── shared/          # Composants réutilisables + modèles TypeScript
├── deploy/nginx/            # Vhosts Nginx (init HTTP-only + final HTTPS)
├── docs/                    # Architecture détaillée (api.md, front.md)
├── docker-compose.yml       # Dev / local
└── docker-compose.prod.yml  # Production (Docker Swarm)
```

### Pattern backend

Chaque module suit un pattern 3 fichiers :

```
modules/<name>/
├── <name>.routes.ts      # Routes Express
├── <name>.controller.ts  # Extraction req/res, appel service
└── <name>.service.ts     # Logique métier + requêtes Prisma
```

Toutes les réponses API respectent le format :

```json
{ "success": true, "data": {} }
{ "success": false, "error": { "message": "...", "code": "..." } }
```

Swagger disponible sur `/api/docs`.

---

## Installation

### Développement local (sans Docker)

**Prérequis** : Node.js 20, PostgreSQL local.

```bash
# 1. Variables d'environnement
cp backend/.env.example backend/.env
# → Renseigner DATABASE_URL, JWT_SECRET, FRONTEND_URL

# 2. Backend (port 3000)
cd backend
npm install
npx prisma migrate dev
npm run dev

# 3. Frontend (port 4200)
cd frontend
npm install
ng serve
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| API | http://localhost:3000/api/ |
| Swagger | http://localhost:3000/api/docs |

### Docker Compose (dev complet)

**Prérequis** : Docker + Docker Compose.

```bash
# 1. Variables d'environnement
cp backend/.env.example backend/.env
# → Renseigner JWT_SECRET (DATABASE_URL est préconfiguré pour le container postgres)

# 2. Premier lancement — migrations + seed automatiques
docker-compose up --build

# Relance sans rebuild
docker-compose up -d

# Rebuild sans cache (si dépendances ou Dockerfile changés)
docker-compose build --no-cache api && docker-compose up -d

# Forcer un reseed complet
docker-compose exec postgres psql -U postgres -c "DROP DATABASE app_db; CREATE DATABASE app_db;"
docker-compose restart api
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| API | http://localhost:3000/api/ |
| Swagger | http://localhost:3000/api/docs |

> Le container `api` exécute `docker-entrypoint.sh` à chaque démarrage : `prisma migrate deploy` (idempotent) → seed conditionnel (DB vide détectée) → `node dist/main.js`. Il attend que `postgres` soit healthy avant de démarrer.

**Credentials de test**

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@michelin.fr` | `Michelin123!` |
| Utilisateur | voir `backend/prisma/seed.js` | `Michelin123!` |

### Tests

```bash
cd backend  && npm test
cd frontend && npm run test:coverage
```

Backend : Jest + mock Prisma. Frontend : Jest 29 + jest-preset-angular 14. Couverture minimale requise : 80 % statements/branches sur les services et composants critiques.

---

## Déploiement

### Vue d'ensemble

Le CI/CD repose sur deux workflows GitHub Actions :

| Workflow | Déclencheur | Rôle |
|----------|-------------|------|
| `test.yml` | Push / PR → `main` | Tests unitaires backend + frontend |
| `deploy.yml` | Push → `main` | Build images → GHCR → Deploy Docker Swarm sur VPS |

### Infrastructure VPS

```
Internet (HTTPS 443)
      │
   Nginx (systemd, VPS)          → vhost michelin.qwaklab.fr
      │ proxy_pass :8080
      ▼
Docker Swarm (overlay network michelin_net)
  ├── frontend  ×2  (port 8080:80)   Nginx static + proxy /api/
  ├── api       ×2  (port 3000)      Express + Prisma
  └── postgres  ×1  (volume db_data)
```

Nginx tourne en service `systemd` sur le VPS (hors Docker). Il proxie vers le port 8080 exposé par le stack Swarm. Le certificat SSL est géré par Certbot + plugin `--nginx`.

### Pré-requis VPS (une seule fois)

1. VPS accessible en SSH en tant que `root`
2. Docker installé et fonctionnel
3. Nginx installé (`apt install nginx`)
4. Certbot installé (`apt install certbot python3-certbot-nginx`)
5. DNS `michelin.qwaklab.fr` → IP du VPS

### Secrets GitHub à configurer

> GitHub → Settings → Secrets → Actions

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | IP ou hostname du VPS |
| `VPS_SSH_PRIVATE_KEY` | Clé RSA privée complète |
| `DB_PASSWORD` | Mot de passe PostgreSQL production |
| `JWT_SECRET` | Clé de signature JWT |
| `CERTBOT_EMAIL` | Email pour Let's Encrypt |
| `GHCR_PAT` | GitHub PAT avec scope `read:packages` (pour pull des images depuis le VPS) |
| `VPS_NGINX_CONF_DIR` | Chemin du conf.d Nginx sur le VPS (ex : `/etc/nginx/conf.d`) — requis uniquement pour le setup initial |

### Premier déploiement (setup Nginx + SSL)

Déclencher manuellement via **Actions → Deploy → Run workflow** avec `setup_nginx = true`.

Ce mode effectue en plus :
1. Upload du vhost HTTP-only (`deploy/nginx/michelin.qwaklab.fr-init.conf`) pour le challenge ACME
2. Rechargement Nginx
3. Obtention du certificat Let's Encrypt via Certbot
4. Upload du vhost HTTPS final (`deploy/nginx/michelin.qwaklab.fr.conf`)
5. Rechargement Nginx avec HTTPS activé

### Déploiements suivants (automatiques)

Chaque push sur `main` déclenche `deploy.yml` :

1. **Build & push** — images `api` et `frontend` buildées et poussées sur GHCR avec tag `latest` + SHA du commit
2. **Déploiement** — `docker stack deploy` sur le VPS via SSH (rolling update, rollback automatique si health check échoue)
3. **Health check** — `GET /api/health` vérifié 30s après le déploiement

Le stack Swarm gère les rolling updates sans coupure :
- Frontend : 2 réplicas, `start-first` (nouvelle instance up avant l'ancienne down)
- API : 2 réplicas, `stop-first` (évite les migrations Prisma concurrentes)

### Variables d'environnement production

Générées et uploadées en `/opt/stacks/michelin/.env` par la CI (jamais stockées en clair) :

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL PostgreSQL interne au réseau Swarm |
| `JWT_SECRET` | Clé de signature des tokens (expire 24h) |
| `NODE_ENV` | `production` |
| `POSTGRES_USER / PASSWORD / DB` | Credentials PostgreSQL |
| `IMAGE_API` / `IMAGE_FRONTEND` | Images GHCR taguées avec le SHA du commit |

### Commandes utiles (VPS)

```bash
# État du stack
docker stack ps michelin

# Logs en temps réel
docker service logs -f michelin_api
docker service logs -f michelin_frontend

# Scaler les services
docker service scale michelin_api=3
docker service scale michelin_frontend=2

# Rollback manuel
docker service rollback michelin_api

# Forcer un reseed production (réinitialisation complète des données)
docker exec -it $(docker ps -q -f name=michelin_postgres) psql -U postgres -c "DROP DATABASE app_db; CREATE DATABASE app_db;"
docker service update --force michelin_api
```
