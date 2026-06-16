# Architecture Backend — Node.js / Express / Prisma

## Vue d'ensemble

Le backend est une **API REST Express** écrite en TypeScript, exposée sur le port `3000`, préfixée `/api/`.
Il communique avec une base PostgreSQL via **Prisma ORM**. Toutes les routes sont préfixées `/api/`.

---

## Structure des dossiers

```
backend/src/
├── main.ts                     # Bootstrap serveur (port, listen)
├── app.ts                      # Factory Express (middlewares, routes)
├── config/
│   ├── env.ts                  # Validation et export des variables d'env
│   └── database.ts             # Client Prisma singleton
├── modules/                    # Feature modules
│   └── [feature]/
│       ├── [feature].routes.ts     # Express Router
│       ├── [feature].controller.ts # Handlers (req, res) — pas de logique métier
│       └── [feature].service.ts    # Logique métier + appels Prisma
├── middlewares/
│   ├── error.middleware.ts     # Handler global d'erreurs (404, 500)
│   ├── auth.middleware.ts      # Vérification JWT
│   └── validate.middleware.ts  # Validation des body (zod ou joi)
└── utils/
    ├── response.ts             # Helpers formatResponse(), formatError()
    └── logger.ts               # Logger (console structuré ou pino)
```

---

## Format de réponse standardisé

**Toutes** les réponses de l'API respectent ce format :

```typescript
// Succès
{ success: true, data: <payload> }

// Erreur
{ success: false, error: { message: string, code?: string } }
```

Utiliser les helpers `formatResponse(data)` et `formatError(message, code?)` de `utils/response.ts`.

---

## Conventions de modules

Chaque feature suit ce pattern :

```typescript
// todos.routes.ts
import { Router } from 'express';
import { TodoController } from './todos.controller';

const router = Router();
router.get('/', TodoController.getAll);
router.post('/', TodoController.create);
router.delete('/:id', TodoController.delete);
export default router;
```

```typescript
// todos.controller.ts — uniquement req/res, délègue au service
export class TodoController {
  static async getAll(req: Request, res: Response) {
    const todos = await TodoService.findAll();
    res.json(formatResponse(todos));
  }
}
```

```typescript
// todos.service.ts — logique métier + Prisma
export class TodoService {
  static async findAll() {
    return prisma.todo.findMany();
  }
}
```

---

## Prisma

Le schéma est dans `prisma/schema.prisma`. Règles :
- Un model par feature, avec `id` en `@id @default(cuid())`
- Toujours inclure `createdAt` et `updatedAt` sur les models métier
- Les migrations sont versionnées dans `prisma/migrations/`

```prisma
model Todo {
  id        String   @id @default(cuid())
  title     String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Commandes :
```bash
npx prisma migrate dev --name <nom>   # En développement
npx prisma migrate deploy             # En production (CI/CD)
npx prisma studio                     # Interface admin locale
```

---

## Variables d'environnement

Toujours accéder via `config/env.ts` (jamais `process.env.X` directement dans le code) :

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@postgres:5432/app_db
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:4200
```

---

## Middlewares

| Middleware            | Rôle                                              |
|-----------------------|---------------------------------------------------|
| `cors`                | Autorise les requêtes depuis `FRONTEND_URL`       |
| `express.json()`      | Parse les body JSON                               |
| `auth.middleware`     | Vérifie le JWT Bearer sur les routes protégées    |
| `validate.middleware` | Valide le body via un schéma Zod                  |
| `error.middleware`    | Catch global — transforme les erreurs en JSON     |

---

## Health Check

```
GET /api/health → 200 { success: true, data: { status: "ok", uptime: <seconds> } }
```

Ce endpoint est utilisé par Docker Compose pour le `healthcheck` du container `api`.

---

## Docker

```dockerfile
# Multi-stage build
# Stage 1 : compile TypeScript → dist/
# Stage 2 : image légère node:20-alpine, copie dist/ + node_modules + prisma/
CMD ["node", "dist/main.js"]
```

La migration Prisma est lancée automatiquement en CI/CD après le déploiement :
```bash
docker exec api npx prisma migrate deploy
```

---

## Documentation Swagger / OpenAPI

L'API expose sa documentation Swagger sur `/api/docs` (Swagger UI). **Toute nouvelle route ou modification d'une route doit impérativement être répercutée et mise à jour dans la documentation Swagger.** Ne pas laisser la documentation obsolète.

Le fichier source de la documentation se trouve dans `src/swagger.json` ou un générateur OpenAPI équivalent.

---

## Tests unitaires & couverture

Le projet utilise `jest` + `ts-jest` pour les tests unitaires. **Toute nouvelle ligne de code ajoutée dans le backend doit être accompagnée d'un test unitaire couvrant ce comportement.** Les tests sont exécutés via `npm test` et une couverture minimale est attendue dans les PRs.

Ajouter des tests pour les helpers, services et contrôleurs créés. Les tests peuvent se trouver sous `src/**/__tests__/`.

