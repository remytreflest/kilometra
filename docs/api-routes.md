# Routes API nécessaires — Inventaire des mocks frontend

Ce document liste toutes les routes backend à implémenter pour remplacer les données mockées du frontend.
Il est généré à partir de l'analyse des services Angular (`frontend/src/app/features/*/`).

---

## Synthèse des domaines fonctionnels

| Domaine        | Service frontend         | Nb entités mockées |
|----------------|--------------------------|-------------------|
| Pneus          | `tire.service.ts`        | 11 pneus, 11 stats terrain, 2 usures |
| Clubs          | `club.service.ts`        | 50 clubs, 55 coureurs (leaderboard) |
| Performance    | `performance.service.ts` | 1 profil perf, 1 KPI communauté |
| Activités      | `activity.service.ts`    | 12 activités |
| Revendeurs     | `dealer.service.ts`      | 15 revendeurs |
| Avis           | `review.service.ts`      | 18 avis, 1 KPI |
| Utilisateur    | `user.service.ts`        | 1 profil user, 4 badges, 1 coupon |
| Testeur        | `tester.service.ts`      | 1 progression, 4 récompenses |
| Admin          | `admin.service.ts`       | 13 régions, 7 perfs terrain, 8 KPIs |

---

## Routes détaillées par module

---

### 1. Module `/api/tires` — Catalogue pneus

#### Modèle Prisma attendu : `Tire`
```
id, reference, name, brand, category,
scores: { adhesion, efficiency, comfort, punctureResistance, durability },
avgScore, communityKm, punctureReductionPct, recommendedFor[], priceEur
```

| Méthode | Route | Description | Paramètres |
|---------|-------|-------------|------------|
| `GET` | `/api/tires` | Liste du catalogue complet | `?category=route\|competition\|endurance\|gravel` `?brand=michelin` |
| `GET` | `/api/tires/michelin` | Pneus Michelin uniquement | — |
| `GET` | `/api/tires/:id` | Détail d'un pneu | `id` (string) |
| `GET` | `/api/tires/:id/benchmark` | Données de benchmark vs compétiteurs | `id` du pneu de référence |
| `GET` | `/api/tires/terrain-stats` | Performances par terrain (tous pneus) | — |
| `GET` | `/api/tires/:id/terrain-stats` | Performances terrain d'un pneu | `id` |

---

### 2. Module `/api/wear` — Usure pneus utilisateur

#### Modèle Prisma attendu : `TireWear`
```
id, userId, tireId, tireRef, tireName,
installedAt, currentKm, estimatedMaxKm, wearPct, status
```

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/wear` | Usure des pneus de l'utilisateur connecté |
| `POST` | `/api/wear` | Déclarer un nouveau pneu monté |
| `PATCH` | `/api/wear/:id` | Mettre à jour les km d'un pneu |

---

### 3. Module `/api/clubs` — Clubs cyclistes

#### Modèle Prisma attendu : `Club`
```
id, name, region, department,
memberCount, totalKm, monthlyKm, monthlyKmDelta,
rank, rankDelta, michelinEquipmentPct,
badges[]: { id, label, icon, color, unlocked }
```

| Méthode | Route | Description | Paramètres |
|---------|-------|-------------|------------|
| `GET` | `/api/clubs` | Liste de tous les clubs | `?region=` `?department=` |
| `GET` | `/api/clubs/me` | Club de l'utilisateur connecté | — (JWT) |
| `GET` | `/api/clubs/:id` | Détail d'un club | `id` |
| `GET` | `/api/clubs/ranking` | Classement des clubs | `?scale=departmental\|regional\|national\|interclub` `?region=` |

---

### 4. Module `/api/leaderboard` — Classement coureurs

#### Modèle Prisma attendu : `RaceResult` / vue agrégée
```
rank, userId, riderName, club, region,
totalKm, mpiScore, level, michelinUser
```

| Méthode | Route | Description | Paramètres |
|---------|-------|-------------|------------|
| `GET` | `/api/leaderboard/national` | Classement national | `?limit=` |
| `GET` | `/api/leaderboard/regional` | Classement régional filtré | `?region=` |

---

### 5. Module `/api/performance` — Indice de performance (MPI)

#### Modèle Prisma attendu : `PerformanceIndex`
```
userId, score, level, monthlyDelta,
weeklyKm, nationalRank, percentileBeat,
history[]: { month, score }
```

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/performance/me` | Indice MPI de l'utilisateur connecté |
| `GET` | `/api/performance/community` | KPIs communautaires (stats globales) |

> KPIs communauté : `activeCyclists`, `registeredClubs`, `analyzedKm`, `punctureReductionPct`, `weeklyKmGrowth`, `monthlyUserGrowth`, `monthlyClubGrowth`

---

### 6. Module `/api/activities` — Sorties vélo

#### Modèle Prisma attendu : `Activity`
```
id, userId, name, date, distanceKm, elevationM,
avgSpeedKmh, maxSpeedKmh, durationMin,
type (route|gravel|vtt|fractionné|sortie longue),
location, mpiImpact
```

| Méthode | Route | Description | Paramètres |
|---------|-------|-------------|------------|
| `GET` | `/api/activities` | Toutes les activités de l'utilisateur | `?limit=` |
| `GET` | `/api/activities/recent` | Activités récentes | `?limit=5` |
| `POST` | `/api/activities` | Créer une activité | — |
| `GET` | `/api/activities/:id` | Détail d'une activité | `id` |

---

### 7. Module `/api/dealers` — Revendeurs

#### Modèle Prisma attendu : `Dealer`
```
id, name, address, city, postalCode,
distanceKm (calculé), isOpen, openingTime, closingTime,
acceptsCoupon, stockStatus (available|limited|order),
phone, lat, lng
```

| Méthode | Route | Description | Paramètres |
|---------|-------|-------------|------------|
| `GET` | `/api/dealers` | Liste des revendeurs proches | `?lat=` `?lng=` `?coupon=true` `?open=true` `?stock=available\|limited` |
| `GET` | `/api/dealers/:id` | Détail d'un revendeur | `id` |

---

### 8. Module `/api/reviews` — Avis utilisateurs

#### Modèle Prisma attendu : `Review`
```
id, authorId, authorName, authorInitials,
kmWithTire, rating (1-5), comment,
isVerified, date, type (user|influencer),
tireRef,
[influencer]: sponsoredContent, followerCount, platform
```

| Méthode | Route | Description | Paramètres |
|---------|-------|-------------|------------|
| `GET` | `/api/reviews` | Liste des avis | `?type=user\|influencer` `?tireRef=` `?rating=5` |
| `GET` | `/api/reviews/kpis` | KPIs des avis (avg rating, total, etc.) | — |
| `POST` | `/api/reviews` | Poster un avis | — (auth) |
| `GET` | `/api/reviews/:id` | Détail d'un avis | `id` |

---

### 9. Module `/api/users` — Profil utilisateur

#### Modèle Prisma attendu : `User`
```
id, firstName, lastName, initials, email,
club (relation), memberSince, level,
stravaConnected,
badges[]: { id, label, icon, color, earnedAt },
rewards[]: { id, type, code, validUntil, usedAt? }
```

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/users/me` | Profil de l'utilisateur connecté |
| `PATCH` | `/api/users/me` | Mettre à jour le profil |
| `GET` | `/api/users/me/badges` | Badges de l'utilisateur |
| `GET` | `/api/users/me/rewards` | Récompenses / coupons |

---

### 10. Module `/api/tester` — Programme testeur officiel

#### Modèle Prisma attendu : `TesterProgress`
```
userId, currentKm, nextMilestoneKm, progressPct,
couponCode, couponExpiry, totalTesters, rank,
rewards[]: { id, label, description, status (unlocked|in-progress|locked), unlockedAt? }
```

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/tester/me` | Progression du testeur connecté |
| `GET` | `/api/tester/me/rewards` | Récompenses du programme testeur |

---

### 11. Module `/api/admin` — Dashboard administrateur

> Routes protégées par rôle `ADMIN`

#### Modèles Prisma attendus :
```
RegionCoverage: region, department, totalCyclists, michelinUsers, coveragePct, growthPct
TireTerrainPerf: tireRef, tireName, mountain, coastal, plain, wet, avgRating, totalKmAnalyzed
AdminKpi: label, value, delta, deltaPositive, icon
```

| Méthode | Route | Description | Paramètres |
|---------|-------|-------------|------------|
| `GET` | `/api/admin/regions` | Couverture Michelin par région | — |
| `GET` | `/api/admin/regions/undercovered` | Régions < 40% de couverture | — |
| `GET` | `/api/admin/tires/terrain-performance` | Performance pneus par terrain | — |
| `GET` | `/api/admin/tires/terrain-performance/best` | Meilleur pneu pour un terrain | `?terrain=mountain\|coastal\|plain\|wet` |
| `GET` | `/api/admin/kpis` | KPIs globaux admin (8 indicateurs) | — |

---

### 12. Module `/api/auth` — Authentification

> Requis pour sécuriser toutes les routes ci-dessus

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/login` | Connexion (email + password → JWT) |
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/logout` | Déconnexion |
| `GET` | `/api/auth/me` | Vérification du token courant |

---

## Récapitulatif complet des routes

| # | Méthode | Route | Auth | Module |
|---|---------|-------|------|--------|
| 1 | GET | `/api/health` | Non | Infra |
| 2 | POST | `/api/auth/login` | Non | Auth |
| 3 | POST | `/api/auth/register` | Non | Auth |
| 4 | POST | `/api/auth/logout` | JWT | Auth |
| 5 | GET | `/api/auth/me` | JWT | Auth |
| 6 | GET | `/api/users/me` | JWT | Users |
| 7 | PATCH | `/api/users/me` | JWT | Users |
| 8 | GET | `/api/users/me/badges` | JWT | Users |
| 9 | GET | `/api/users/me/rewards` | JWT | Users |
| 10 | GET | `/api/tires` | Non | Tires |
| 11 | GET | `/api/tires/michelin` | Non | Tires |
| 12 | GET | `/api/tires/:id` | Non | Tires |
| 13 | GET | `/api/tires/:id/benchmark` | Non | Tires |
| 14 | GET | `/api/tires/terrain-stats` | Non | Tires |
| 15 | GET | `/api/tires/:id/terrain-stats` | Non | Tires |
| 16 | GET | `/api/wear` | JWT | Wear |
| 17 | POST | `/api/wear` | JWT | Wear |
| 18 | PATCH | `/api/wear/:id` | JWT | Wear |
| 19 | GET | `/api/activities` | JWT | Activities |
| 20 | GET | `/api/activities/recent` | JWT | Activities |
| 21 | GET | `/api/activities/:id` | JWT | Activities |
| 22 | POST | `/api/activities` | JWT | Activities |
| 23 | GET | `/api/clubs` | Non | Clubs |
| 24 | GET | `/api/clubs/me` | JWT | Clubs |
| 25 | GET | `/api/clubs/:id` | Non | Clubs |
| 26 | GET | `/api/clubs/ranking` | Non | Clubs |
| 27 | GET | `/api/leaderboard/national` | Non | Leaderboard |
| 28 | GET | `/api/leaderboard/regional` | Non | Leaderboard |
| 29 | GET | `/api/performance/me` | JWT | Performance |
| 30 | GET | `/api/performance/community` | Non | Performance |
| 31 | GET | `/api/dealers` | Non | Dealers |
| 32 | GET | `/api/dealers/:id` | Non | Dealers |
| 33 | GET | `/api/reviews` | Non | Reviews |
| 34 | GET | `/api/reviews/kpis` | Non | Reviews |
| 35 | GET | `/api/reviews/:id` | Non | Reviews |
| 36 | POST | `/api/reviews` | JWT | Reviews |
| 37 | GET | `/api/tester/me` | JWT | Tester |
| 38 | GET | `/api/tester/me/rewards` | JWT | Tester |
| 39 | GET | `/api/admin/regions` | JWT+ADMIN | Admin |
| 40 | GET | `/api/admin/regions/undercovered` | JWT+ADMIN | Admin |
| 41 | GET | `/api/admin/tires/terrain-performance` | JWT+ADMIN | Admin |
| 42 | GET | `/api/admin/tires/terrain-performance/best` | JWT+ADMIN | Admin |
| 43 | GET | `/api/admin/kpis` | JWT+ADMIN | Admin |

**Total : 43 routes** réparties sur **12 modules**.

---

## Notes d'implémentation

### Authentification
- Toutes les routes `JWT` nécessitent le header `Authorization: Bearer <token>`
- Les routes `JWT+ADMIN` nécessitent en plus le rôle `ADMIN` dans le payload JWT
- L'utilisateur courant est toujours déduit du JWT (pas de `userId` dans l'URL)

### Géolocalisation dealers
- La distance `distanceKm` est calculée côté backend à partir des coordonnées `lat`/`lng` du revendeur et de la position envoyée en query param
- Formule Haversine recommandée

### Données temps réel vs statiques
- Les KPIs communauté (`/api/performance/community`) et admin (`/api/admin/kpis`) peuvent être mis en cache (Redis, TTL ~5min) car ils sont coûteux à calculer
- Le classement (`/api/leaderboard/*`) peut aussi bénéficier d'un cache court terme

### Niveaux cyclistes (niveau MPI)
Les niveaux sont calculés à partir du score MPI :
- < 400 : `Débutant`
- 400-549 : `Intermédiaire`
- 550-649 : `Passionné`
- 650-749 : `Expert`
- 750-849 : `Compétiteur Expert`
- ≥ 850 : `Élite`
