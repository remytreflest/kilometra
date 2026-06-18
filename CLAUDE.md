# CLAUDE.md — Guide de navigation du projet

Ce fichier est le point d'entrée pour toute intervention de Claude Code sur ce projet.
Lis ce fichier en premier, puis consulte le document correspondant à ta tâche.

---

## 🗺️ Navigation par contexte

### Tu travailles sur le **frontend** (Angular, composants, routing, styles) ?
→ Lis le fichier **`docs/front.md`** avant de commencer.
Il contient l'architecture Angular, les conventions de nommage, les modules lazy-loaded, les services HTTP et les patterns UI à respecter.

### Tu travailles sur le **backend / API** (Express, routes, services, Prisma) ?
→ Lis le fichier **`docs/api.md`** avant de commencer.
Il contient la structure des modules, les conventions de réponse JSON, le schéma Prisma, les middlewares et les règles de sécurité.

### Tu travailles sur les **incompatibilités frontend/backend** (modèles, routes manquantes) ?
→ Lis le fichier **`docs/missing-routes.md`**.
Toutes les discordances listées ont été corrigées (2026-06-18). Ce fichier sert de référence historique et de guide si de nouvelles incompatibilités apparaissent.

### Tu travailles sur le **Docker / CI/CD / infrastructure** ?
→ Lis ce fichier jusqu'au bout, puis consulte `docker-compose.yml` et `.github/workflows/`.
Les Dockerfiles sont dans `backend/Dockerfile` et `frontend/Dockerfile` (Nginx est intégré en multi-stage dans ce dernier, pas de `nginx/Dockerfile` séparé).

---

## 📐 Règles générales (toujours applicables)

- Tout le code est en **TypeScript strict** (pas de `any` sans justification)
- Les variables d'environnement viennent toujours du fichier **`.env`** (jamais hardcodées)
- Les secrets ne sont **jamais** commités dans le repo
- Toute nouvelle feature backend doit avoir sa route sous le préfixe **`/api/`**
- Les réponses API respectent le format standardisé `{success: bool, data: ?, error: ?}`
- Les migrations Prisma se lancent avec `npx prisma migrate dev` en local (dev uniquement — génère la migration depuis le schéma)
- En production / Docker, `migrate deploy` est **automatisé** via `backend/docker-entrypoint.sh` au démarrage du container
- Le seed est automatique au premier démarrage (DB vide détectée), puis ignoré aux redémarrages suivants

---

Optimisation : ne cherche pas la solution la plus rapide, mais la solution la plus propre en terme d'architecture.

---

## 🚦 Workflow de développement

```bash
# Backend (port 3000)
cd backend && npm run dev

# Frontend (port 4200)
cd frontend && ng serve

# Docker Compose complet — premier lancement (migrations + seed automatiques)
docker-compose up --build

# Relance sans rebuild
docker-compose up -d

# Rebuild sans cache (si dépendances ou Dockerfile changés)
docker-compose build --no-cache api && docker-compose up -d

# Forcer un reseed (réinitialisation complète des données)
docker-compose exec postgres psql -U postgres -c "DROP DATABASE app_db; CREATE DATABASE app_db;"
docker-compose restart api
```


## 🔄 Démarrage automatique du container API

Le container `api` exécute `backend/docker-entrypoint.sh` à chaque démarrage :

1. **`prisma migrate deploy`** — applique les migrations en attente (idempotent)
2. **Détection DB vide** — compte les utilisateurs ; si 0, lance le seed
3. **`node dist/main.js`** — démarre l'application

Le container `api` attend que `postgres` soit healthy (`condition: service_healthy` dans `docker-compose.yml`) avant de démarrer.

> Pour ajouter une migration : `cd backend && npx prisma migrate dev --name <nom>`, commitez le fichier généré dans `prisma/migrations/`. Elle sera appliquée automatiquement au prochain `docker-compose up`.

---

## 🔑 Credentials de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@michelin.fr` | `Michelin123!` |
| Utilisateur | voir seed `backend/prisma/seed.js` | `Michelin123!` |

Le token JWT expire après **24h**.
