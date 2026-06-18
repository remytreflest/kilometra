-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TireCategory" AS ENUM ('route', 'competition', 'endurance', 'gravel');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('available', 'limited', 'order');

-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('user', 'influencer');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "memberSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" TEXT NOT NULL DEFAULT 'Débutant',
    "stravaConnected" BOOLEAN NOT NULL DEFAULT false,
    "clubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "totalKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyKmDelta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL,
    "rankDelta" INTEGER NOT NULL DEFAULT 0,
    "michelinEquipmentPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "badges" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tire" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT 'Michelin',
    "category" "TireCategory" NOT NULL,
    "adhesion" DOUBLE PRECISION NOT NULL,
    "efficiency" DOUBLE PRECISION NOT NULL,
    "comfort" DOUBLE PRECISION NOT NULL,
    "punctureResistance" DOUBLE PRECISION NOT NULL,
    "durability" DOUBLE PRECISION NOT NULL,
    "avgScore" DOUBLE PRECISION NOT NULL,
    "communityKm" INTEGER NOT NULL DEFAULT 0,
    "punctureReductionPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recommendedFor" TEXT[],
    "priceEur" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TireWear" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tireId" TEXT NOT NULL,
    "tireRef" TEXT NOT NULL,
    "tireName" TEXT NOT NULL,
    "installedAt" TIMESTAMP(3) NOT NULL,
    "currentKm" DOUBLE PRECISION NOT NULL,
    "estimatedMaxKm" DOUBLE PRECISION NOT NULL,
    "wearPct" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TireWear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "elevationM" DOUBLE PRECISION NOT NULL,
    "avgSpeedKmh" DOUBLE PRECISION NOT NULL,
    "maxSpeedKmh" DOUBLE PRECISION NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "mpiImpact" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "openingTime" TEXT NOT NULL,
    "closingTime" TEXT NOT NULL,
    "acceptsCoupon" BOOLEAN NOT NULL DEFAULT false,
    "stockStatus" "StockStatus" NOT NULL DEFAULT 'available',
    "phone" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorInitials" TEXT NOT NULL,
    "kmWithTire" DOUBLE PRECISION NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "ReviewType" NOT NULL DEFAULT 'user',
    "tireRef" TEXT NOT NULL,
    "sponsoredContent" TEXT,
    "followerCount" INTEGER,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceIndex" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "level" TEXT NOT NULL,
    "monthlyDelta" DOUBLE PRECISION NOT NULL,
    "weeklyKm" DOUBLE PRECISION NOT NULL,
    "nationalRank" INTEGER NOT NULL,
    "percentileBeat" DOUBLE PRECISION NOT NULL,
    "history" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformanceIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TesterProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentKm" DOUBLE PRECISION NOT NULL,
    "nextMilestoneKm" DOUBLE PRECISION NOT NULL,
    "progressPct" DOUBLE PRECISION NOT NULL,
    "couponCode" TEXT NOT NULL,
    "couponExpiry" TIMESTAMP(3) NOT NULL,
    "totalTesters" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TesterProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TesterReward" (
    "id" TEXT NOT NULL,
    "testerProgressId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3),

    CONSTRAINT "TesterReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionCoverage" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "totalCyclists" INTEGER NOT NULL,
    "michelinUsers" INTEGER NOT NULL,
    "coveragePct" DOUBLE PRECISION NOT NULL,
    "growthPct" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RegionCoverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TireTerrainPerf" (
    "id" TEXT NOT NULL,
    "tireRef" TEXT NOT NULL,
    "tireName" TEXT NOT NULL,
    "tireId" TEXT,
    "mountain" DOUBLE PRECISION NOT NULL,
    "coastal" DOUBLE PRECISION NOT NULL,
    "plain" DOUBLE PRECISION NOT NULL,
    "wet" DOUBLE PRECISION NOT NULL,
    "avgRating" DOUBLE PRECISION NOT NULL,
    "totalKmAnalyzed" INTEGER NOT NULL,

    CONSTRAINT "TireTerrainPerf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminKpi" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "delta" TEXT NOT NULL,
    "deltaPositive" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT NOT NULL,

    CONSTRAINT "AdminKpi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "Reward_code_key" ON "Reward"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Tire_reference_key" ON "Tire"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceIndex_userId_key" ON "PerformanceIndex"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TesterProgress_userId_key" ON "TesterProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TireTerrainPerf_tireRef_key" ON "TireTerrainPerf"("tireRef");

-- CreateIndex
CREATE UNIQUE INDEX "TireTerrainPerf_tireId_key" ON "TireTerrainPerf"("tireId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TireWear" ADD CONSTRAINT "TireWear_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TireWear" ADD CONSTRAINT "TireWear_tireId_fkey" FOREIGN KEY ("tireId") REFERENCES "Tire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceIndex" ADD CONSTRAINT "PerformanceIndex_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TesterProgress" ADD CONSTRAINT "TesterProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TesterReward" ADD CONSTRAINT "TesterReward_testerProgressId_fkey" FOREIGN KEY ("testerProgressId") REFERENCES "TesterProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TireTerrainPerf" ADD CONSTRAINT "TireTerrainPerf_tireId_fkey" FOREIGN KEY ("tireId") REFERENCES "Tire"("id") ON DELETE SET NULL ON UPDATE CASCADE;
