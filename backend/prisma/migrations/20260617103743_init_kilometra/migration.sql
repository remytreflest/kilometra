-- CreateTable
CREATE TABLE "utilisateur" (
    "id" UUID NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "motDePasseHash" VARCHAR(255) NOT NULL,
    "stravaId" VARCHAR(100),
    "stravaToken" TEXT,
    "stravaRefreshToken" TEXT,
    "stravaTokenExpiresAt" TIMESTAMP(3),
    "departement" VARCHAR(3) NOT NULL,
    "region" VARCHAR(100) NOT NULL,
    "profile" VARCHAR(20) NOT NULL DEFAULT 'regulier',
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "departement" VARCHAR(3) NOT NULL,
    "region" VARCHAR(100) NOT NULL,
    "ville" VARCHAR(100) NOT NULL,
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membre_club" (
    "utilisateurId" UUID NOT NULL,
    "clubId" UUID NOT NULL,
    "dateAdhesion" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR(20) NOT NULL DEFAULT 'membre',

    CONSTRAINT "membre_club_pkey" PRIMARY KEY ("utilisateurId","clubId")
);

-- CreateTable
CREATE TABLE "velo" (
    "id" UUID NOT NULL,
    "utilisateurId" UUID NOT NULL,
    "marque" VARCHAR(100) NOT NULL,
    "modele" VARCHAR(100) NOT NULL,
    "annee" INTEGER NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "valeurAchat" DECIMAL(8,2),
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "velo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produit" (
    "id" UUID NOT NULL,
    "marque" VARCHAR(100) NOT NULL,
    "modele" VARCHAR(150) NOT NULL,
    "typeUsage" VARCHAR(20) NOT NULL,
    "prix" DECIMAL(8,2),
    "estMichelin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materiel" (
    "id" UUID NOT NULL,
    "veloId" UUID NOT NULL,
    "produitId" UUID NOT NULL,
    "dateInstallation" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kmParcourus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avisDemande" BOOLEAN NOT NULL DEFAULT false,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "materiel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avis" (
    "id" UUID NOT NULL,
    "utilisateurId" UUID NOT NULL,
    "produitId" UUID NOT NULL,
    "materielId" UUID NOT NULL,
    "noteAdherence" INTEGER NOT NULL,
    "noteConfort" INTEGER NOT NULL,
    "noteLongevite" INTEGER NOT NULL,
    "notePrixPerf" INTEGER NOT NULL,
    "noteRendement" INTEGER,
    "noteGripMouille" INTEGER,
    "conditionsTest" TEXT[],
    "commentaire" TEXT NOT NULL,
    "kmAuMoment" DOUBLE PRECISION NOT NULL,
    "dateAvis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valide" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "avis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classement_mensuel" (
    "id" UUID NOT NULL,
    "utilisateurId" UUID NOT NULL,
    "clubId" UUID,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "scope" VARCHAR(20) NOT NULL,
    "totalKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "gagnant" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "classement_mensuel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recompense" (
    "id" UUID NOT NULL,
    "classementId" UUID NOT NULL,
    "produitId" UUID NOT NULL,
    "statut" VARCHAR(20) NOT NULL DEFAULT 'attribuee',
    "dateAttribution" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateExpedition" TIMESTAMP(3),
    "adresseLivraison" TEXT NOT NULL,

    CONSTRAINT "recompense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sortie" (
    "id" UUID NOT NULL,
    "utilisateurId" UUID NOT NULL,
    "materielId" UUID,
    "stravaActivityId" VARCHAR(100),
    "dateSortie" DATE NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "elevationM" INTEGER NOT NULL DEFAULT 0,
    "terrain" VARCHAR(20) NOT NULL,
    "surface" VARCHAR(20) NOT NULL,
    "pluie" BOOLEAN NOT NULL DEFAULT false,
    "conditionKey" VARCHAR(20) NOT NULL,
    "crevaison" BOOLEAN NOT NULL DEFAULT false,
    "satisfaction" DECIMAL(3,1),
    "scoreAdherence" DECIMAL(3,1),
    "scoreRendement" DECIMAL(3,1),
    "scoreDurabilite" DECIMAL(3,1),
    "scoreConfort" DECIMAL(3,1),
    "tyreBrand" VARCHAR(100),
    "tyreModel" VARCHAR(150),
    "tyreWidth" INTEGER,
    "replacementIntent" VARCHAR(20),
    "profileRider" VARCHAR(20),
    "bikeValue" DECIMAL(8,2),
    "annualKm" INTEGER,
    "region" VARCHAR(100),

    CONSTRAINT "sortie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_email_key" ON "utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_stravaId_key" ON "utilisateur"("stravaId");

-- CreateIndex
CREATE UNIQUE INDEX "avis_materielId_key" ON "avis"("materielId");

-- CreateIndex
CREATE UNIQUE INDEX "classement_mensuel_utilisateurId_mois_annee_scope_key" ON "classement_mensuel"("utilisateurId", "mois", "annee", "scope");

-- CreateIndex
CREATE UNIQUE INDEX "recompense_classementId_key" ON "recompense"("classementId");

-- CreateIndex
CREATE UNIQUE INDEX "sortie_stravaActivityId_key" ON "sortie"("stravaActivityId");

-- AddForeignKey
ALTER TABLE "membre_club" ADD CONSTRAINT "membre_club_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membre_club" ADD CONSTRAINT "membre_club_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "velo" ADD CONSTRAINT "velo_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiel" ADD CONSTRAINT "materiel_veloId_fkey" FOREIGN KEY ("veloId") REFERENCES "velo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiel" ADD CONSTRAINT "materiel_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_materielId_fkey" FOREIGN KEY ("materielId") REFERENCES "materiel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classement_mensuel" ADD CONSTRAINT "classement_mensuel_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classement_mensuel" ADD CONSTRAINT "classement_mensuel_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recompense" ADD CONSTRAINT "recompense_classementId_fkey" FOREIGN KEY ("classementId") REFERENCES "classement_mensuel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recompense" ADD CONSTRAINT "recompense_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sortie" ADD CONSTRAINT "sortie_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sortie" ADD CONSTRAINT "sortie_materielId_fkey" FOREIGN KEY ("materielId") REFERENCES "materiel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
