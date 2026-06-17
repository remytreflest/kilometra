-- =============================================================================
-- KILOMETRA — Schema PostgreSQL
-- Compatible PostgreSQL 14+
-- Usage : \i database/schema.sql
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLE : UTILISATEUR
-- Compte cycliste inscrit sur la plateforme Kilometra.
-- Peut être connecté à Strava pour la synchronisation des activités.
-- =============================================================================
CREATE TABLE utilisateur (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prenom                  VARCHAR(100) NOT NULL,
    nom                     VARCHAR(100) NOT NULL,
    email                   VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe_hash       VARCHAR(255) NOT NULL,
    strava_id               VARCHAR(100) UNIQUE,
    strava_token            TEXT,
    strava_refresh_token    TEXT,
    strava_token_expires_at TIMESTAMP,
    departement             VARCHAR(3) NOT NULL,
    region                  VARCHAR(100) NOT NULL,
    date_inscription        TIMESTAMP NOT NULL DEFAULT NOW(),
    actif                   BOOLEAN NOT NULL DEFAULT TRUE
);

-- =============================================================================
-- TABLE : CLUB
-- Club cycliste régional. Les utilisateurs peuvent adhérer à plusieurs clubs.
-- =============================================================================
CREATE TABLE club (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom              VARCHAR(255) NOT NULL,
    departement      VARCHAR(3) NOT NULL,
    region           VARCHAR(100) NOT NULL,
    ville            VARCHAR(100) NOT NULL,
    date_inscription TIMESTAMP NOT NULL DEFAULT NOW(),
    actif            BOOLEAN NOT NULL DEFAULT TRUE
);

-- =============================================================================
-- TABLE : MEMBRE_CLUB
-- Table de liaison N:N entre utilisateur et club.
-- Un utilisateur peut être membre ou admin d'un club.
-- =============================================================================
CREATE TABLE membre_club (
    utilisateur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    club_id        UUID NOT NULL REFERENCES club(id) ON DELETE CASCADE,
    date_adhesion  DATE NOT NULL DEFAULT CURRENT_DATE,
    role           VARCHAR(20) NOT NULL DEFAULT 'membre' CHECK (role IN ('membre', 'admin')),
    PRIMARY KEY (utilisateur_id, club_id)
);

-- =============================================================================
-- TABLE : VELO
-- Vélo appartenant à un utilisateur. Un utilisateur peut avoir plusieurs vélos.
-- =============================================================================
CREATE TABLE velo (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    marque         VARCHAR(100) NOT NULL,
    modele         VARCHAR(100) NOT NULL,
    annee          INT NOT NULL CHECK (annee BETWEEN 1990 AND 2030),
    type           VARCHAR(20) NOT NULL CHECK (type IN ('route', 'gravel', 'vtt', 'city')),
    actif          BOOLEAN NOT NULL DEFAULT TRUE
);

-- =============================================================================
-- TABLE : PRODUIT
-- Catalogue de pneus toutes marques.
-- est_michelin distingue les produits éligibles aux récompenses.
-- =============================================================================
CREATE TABLE produit (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    marque      VARCHAR(100) NOT NULL,
    modele      VARCHAR(150) NOT NULL,
    type_usage  VARCHAR(20) NOT NULL CHECK (type_usage IN ('route', 'gravel', 'vtt')),
    prix        DECIMAL(8, 2),
    est_michelin BOOLEAN NOT NULL DEFAULT FALSE
);

-- =============================================================================
-- TABLE : MATERIEL
-- Pneu physiquement monté sur un vélo d'un utilisateur.
-- km_parcourus est mis à jour par l'API Strava.
-- avis_demande passe automatiquement à TRUE à 500 km (via trigger).
-- =============================================================================
CREATE TABLE materiel (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    velo_id           UUID NOT NULL REFERENCES velo(id) ON DELETE CASCADE,
    produit_id        UUID NOT NULL REFERENCES produit(id),
    date_installation DATE NOT NULL DEFAULT CURRENT_DATE,
    km_parcourus      FLOAT NOT NULL DEFAULT 0,
    avis_demande      BOOLEAN NOT NULL DEFAULT FALSE,
    actif             BOOLEAN NOT NULL DEFAULT TRUE
);

-- =============================================================================
-- TABLE : AVIS
-- Avis laissé par un utilisateur sur un produit via un matériel précis.
-- Un seul avis par matériel (UNIQUE sur materiel_id).
-- Débloqué uniquement si km_parcourus >= 500 (vérifié par trigger).
-- =============================================================================
CREATE TABLE avis (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    produit_id     UUID NOT NULL REFERENCES produit(id),
    materiel_id    UUID NOT NULL REFERENCES materiel(id) UNIQUE,
    note_adherence INT NOT NULL CHECK (note_adherence BETWEEN 1 AND 5),
    note_confort   INT NOT NULL CHECK (note_confort BETWEEN 1 AND 5),
    note_longevite INT NOT NULL CHECK (note_longevite BETWEEN 1 AND 5),
    note_prix_perf INT NOT NULL CHECK (note_prix_perf BETWEEN 1 AND 5),
    commentaire    TEXT NOT NULL,
    km_au_moment   FLOAT NOT NULL,
    date_avis      TIMESTAMP NOT NULL DEFAULT NOW(),
    valide         BOOLEAN NOT NULL DEFAULT FALSE
);

-- =============================================================================
-- TABLE : CLASSEMENT_MENSUEL
-- Classement recalculé chaque nuit depuis les données Strava.
-- Scope permet de segmenter par département, région, national ou club.
-- Contrainte UNIQUE : 1 entrée par utilisateur/mois/année/scope.
-- =============================================================================
CREATE TABLE classement_mensuel (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    club_id        UUID REFERENCES club(id) ON DELETE SET NULL,
    mois           INT NOT NULL CHECK (mois BETWEEN 1 AND 12),
    annee          INT NOT NULL CHECK (annee >= 2024),
    scope          VARCHAR(20) NOT NULL CHECK (scope IN ('dept', 'region', 'national', 'club')),
    total_km       FLOAT NOT NULL DEFAULT 0,
    position       INT NOT NULL DEFAULT 0,
    gagnant        BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (utilisateur_id, mois, annee, scope)
);

-- =============================================================================
-- TABLE : RECOMPENSE
-- Créée uniquement si gagnant=TRUE ET produit est_michelin=TRUE.
-- Un seul classement peut générer une récompense (UNIQUE sur classement_id).
-- =============================================================================
CREATE TABLE recompense (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classement_id     UUID NOT NULL REFERENCES classement_mensuel(id) UNIQUE,
    produit_id        UUID NOT NULL REFERENCES produit(id),
    statut            VARCHAR(20) NOT NULL DEFAULT 'attribuee' CHECK (statut IN ('attribuee', 'expediee', 'recue')),
    date_attribution  TIMESTAMP NOT NULL DEFAULT NOW(),
    date_expedition   TIMESTAMP,
    adresse_livraison TEXT NOT NULL
);

-- =============================================================================
-- INDEXES — Performance
-- =============================================================================

-- UTILISATEUR
CREATE INDEX idx_utilisateur_email       ON utilisateur(email);
CREATE INDEX idx_utilisateur_strava_id   ON utilisateur(strava_id);
CREATE INDEX idx_utilisateur_departement ON utilisateur(departement);

-- MATERIEL
CREATE INDEX idx_materiel_velo_id        ON materiel(velo_id);
CREATE INDEX idx_materiel_km_parcourus   ON materiel(km_parcourus);

-- AVIS
CREATE INDEX idx_avis_produit_id         ON avis(produit_id);
CREATE INDEX idx_avis_valide             ON avis(valide);
CREATE INDEX idx_avis_date_avis          ON avis(date_avis);

-- CLASSEMENT_MENSUEL
CREATE INDEX idx_classement_periode      ON classement_mensuel(mois, annee, scope);
CREATE INDEX idx_classement_gagnant      ON classement_mensuel(gagnant, scope);

-- MEMBRE_CLUB
CREATE INDEX idx_membre_club_club_id     ON membre_club(club_id);

-- =============================================================================
-- TRIGGER 1 : auto_avis_demande
-- Après UPDATE sur MATERIEL : si km_parcourus passe le seuil de 500 km,
-- avis_demande est automatiquement mis à TRUE.
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_auto_avis_demande()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.km_parcourus >= 500 AND OLD.km_parcourus < 500 THEN
        NEW.avis_demande := TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_avis_demande
BEFORE UPDATE ON materiel
FOR EACH ROW
EXECUTE FUNCTION fn_auto_avis_demande();

-- =============================================================================
-- TRIGGER 2 : check_avis_km
-- Avant INSERT sur AVIS : vérifie que le MATERIEL lié a au moins 500 km.
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_check_avis_km()
RETURNS TRIGGER AS $$
DECLARE
    v_km FLOAT;
BEGIN
    SELECT km_parcourus INTO v_km
    FROM materiel
    WHERE id = NEW.materiel_id;

    IF v_km < 500 THEN
        RAISE EXCEPTION 'Minimum 500km requis pour déposer un avis';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_avis_km
BEFORE INSERT ON avis
FOR EACH ROW
EXECUTE FUNCTION fn_check_avis_km();

-- =============================================================================
-- TRIGGER 3 : check_recompense_michelin
-- Avant INSERT sur RECOMPENSE : vérifie que le produit est bien un produit Michelin.
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_check_recompense_michelin()
RETURNS TRIGGER AS $$
DECLARE
    v_est_michelin BOOLEAN;
BEGIN
    SELECT est_michelin INTO v_est_michelin
    FROM produit
    WHERE id = NEW.produit_id;

    IF NOT v_est_michelin THEN
        RAISE EXCEPTION 'Seuls les produits Michelin peuvent être attribués en récompense';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_recompense_michelin
BEFORE INSERT ON recompense
FOR EACH ROW
EXECUTE FUNCTION fn_check_recompense_michelin();
