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

### Tu travailles sur le **Docker / CI/CD / infrastructure** ?
→ Lis ce fichier jusqu'au bout, puis consulte `docker-compose.yml` et `.github/workflows/`.
Les Dockerfiles sont dans `backend/Dockerfile`, `frontend/Dockerfile` et `nginx/Dockerfile`.

---

## 📐 Règles générales (toujours applicables)

- Tout le code est en **TypeScript strict** (pas de `any` sans justification)
- Les variables d'environnement viennent toujours du fichier **`.env`** (jamais hardcodées)
- Les secrets ne sont **jamais** commités dans le repo
- Toute nouvelle feature backend doit avoir sa route sous le préfixe **`/api/`**
- Les réponses API respectent le format standardisé `{success: bool, data: ?, error: ?}`
- Les migrations Prisma se lancent avec `npx prisma migrate dev` en local, `prisma migrate deploy` en CI/CD

---

Optimisation : ne cherche pas la solution la plus rapide, mais la solution la plus propre en terme d'architecture.

---

## 🚦 Workflow de développement

```bash
# Backend (port 3000)
cd backend && npm run dev

# Frontend (port 4200)
cd frontend && ng serve

# Docker Compose complet
docker-compose up --build
```
