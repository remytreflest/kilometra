-- Fix discordances frontend ↔ backend (issues 2-9 de docs/missing-routes.md)

-- #2 TireWear: ajout du champ position
ALTER TABLE "TireWear" ADD COLUMN "position" TEXT NOT NULL DEFAULT 'front';

-- #3 Reward: ajout title et description
ALTER TABLE "Reward" ADD COLUMN "title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Reward" ADD COLUMN "description" TEXT NOT NULL DEFAULT '';

-- #4 TesterReward: ajout requiredKm et icon
ALTER TABLE "TesterReward" ADD COLUMN "requiredKm" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "TesterReward" ADD COLUMN "icon" TEXT NOT NULL DEFAULT 'star';

-- #6 TireTerrainPerf: ajout avgPunctureRate
ALTER TABLE "TireTerrainPerf" ADD COLUMN "avgPunctureRate" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- #7 Review: ajout recommended pour un recommendationPct sémantiquement correct
ALTER TABLE "Review" ADD COLUMN "recommended" BOOLEAN NOT NULL DEFAULT false;
