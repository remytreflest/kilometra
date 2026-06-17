-- =============================================================================
-- KILOMETRA — Migration v2
-- Appliquer après schema.sql : \i database/migration_v2.sql
-- Contient uniquement les ajouts — ne touche pas à l'existant.
-- =============================================================================

-- =============================================================================
-- 1. COLONNES AJOUTÉES SUR LES TABLES EXISTANTES
-- =============================================================================

-- UTILISATEUR : profil d'usage du cycliste
ALTER TABLE utilisateur
    ADD COLUMN IF NOT EXISTS profile VARCHAR(20) NOT NULL DEFAULT 'regulier'
        CHECK (profile IN ('occasionnel', 'regulier', 'intensif'));

-- VELO : valeur d'achat du vélo
ALTER TABLE velo
    ADD COLUMN IF NOT EXISTS valeur_achat DECIMAL(8, 2);

-- AVIS : notes supplémentaires + conditions de test
ALTER TABLE avis
    ADD COLUMN IF NOT EXISTS note_rendement   INT CHECK (note_rendement BETWEEN 1 AND 5),
    ADD COLUMN IF NOT EXISTS note_grip_mouille INT CHECK (note_grip_mouille BETWEEN 1 AND 5),
    ADD COLUMN IF NOT EXISTS conditions_test  TEXT[];

-- =============================================================================
-- 2. TABLE : SORTIE
-- Activité Strava ou saisie manuelle liée à un matériel.
-- Permet de calculer les scores par conditions météo/terrain.
-- =============================================================================
CREATE TABLE IF NOT EXISTS sortie (
    id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id    UUID          NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    materiel_id       UUID          REFERENCES materiel(id) ON DELETE SET NULL,
    strava_activity_id VARCHAR(100) UNIQUE,
    date_sortie       DATE          NOT NULL,
    distance_km       FLOAT         NOT NULL CHECK (distance_km > 0),
    elevation_m       INT           NOT NULL DEFAULT 0,
    terrain           VARCHAR(20)   NOT NULL CHECK (terrain IN ('route', 'gravel', 'mixte', 'paves')),
    surface           VARCHAR(20)   NOT NULL CHECK (surface IN ('sec', 'humide', 'boueux')),
    pluie             BOOLEAN       NOT NULL DEFAULT FALSE,
    condition_key     VARCHAR(20)   NOT NULL CHECK (condition_key IN ('sec', 'pluie', 'gravel', 'montagne')),
    crevaison         BOOLEAN       NOT NULL DEFAULT FALSE,
    satisfaction      DECIMAL(3, 1) CHECK (satisfaction BETWEEN 1 AND 10),
    score_adherence   DECIMAL(3, 1) CHECK (score_adherence BETWEEN 1 AND 10),
    score_rendement   DECIMAL(3, 1) CHECK (score_rendement BETWEEN 1 AND 10),
    score_durabilite  DECIMAL(3, 1) CHECK (score_durabilite BETWEEN 1 AND 10),
    score_confort     DECIMAL(3, 1) CHECK (score_confort BETWEEN 1 AND 10),
    tyre_brand        VARCHAR(100),
    tyre_model        VARCHAR(150),
    tyre_width        INT,
    replacement_intent VARCHAR(20)  CHECK (replacement_intent IN ('<1 mois', '1-3 mois', '3-6 mois', '>6 mois')),
    profile_rider     VARCHAR(20)   CHECK (profile_rider IN ('occasionnel', 'regulier', 'intensif')),
    bike_value        DECIMAL(8, 2),
    annual_km         INT,
    region            VARCHAR(100)
);

-- =============================================================================
-- 3. INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_user_profile       ON utilisateur(profile);
CREATE INDEX IF NOT EXISTS idx_sortie_user        ON sortie(utilisateur_id);
CREATE INDEX IF NOT EXISTS idx_sortie_date        ON sortie(date_sortie);
CREATE INDEX IF NOT EXISTS idx_sortie_brand       ON sortie(tyre_brand);
CREATE INDEX IF NOT EXISTS idx_sortie_condition   ON sortie(condition_key);
CREATE INDEX IF NOT EXISTS idx_sortie_brand_cond  ON sortie(tyre_brand, condition_key);

-- =============================================================================
-- 4. TRIGGER : update_km_from_sortie
-- Après INSERT sur SORTIE : met à jour km_parcourus du matériel lié.
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_update_km_from_sortie()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.materiel_id IS NOT NULL THEN
        UPDATE materiel
        SET km_parcourus = km_parcourus + NEW.distance_km
        WHERE id = NEW.materiel_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_km_from_sortie
AFTER INSERT ON sortie
FOR EACH ROW
EXECUTE FUNCTION fn_update_km_from_sortie();

-- =============================================================================
-- 5. VUES
-- =============================================================================

-- Score moyen par pneu et par condition météo/terrain
CREATE OR REPLACE VIEW v_scores_par_condition AS
SELECT
    tyre_brand,
    tyre_model,
    condition_key,
    ROUND(AVG(satisfaction)::numeric,    2) AS score_global,
    ROUND(AVG(score_adherence)::numeric, 2) AS score_adherence,
    ROUND(AVG(score_rendement)::numeric, 2) AS score_rendement,
    ROUND(AVG(score_durabilite)::numeric,2) AS score_durabilite,
    ROUND(AVG(score_confort)::numeric,   2) AS score_confort,
    COUNT(*)                                AS nb_sorties,
    ROUND(AVG(crevaison::int) * 100,     2) AS taux_crevaison_pct
FROM sortie
WHERE satisfaction IS NOT NULL
GROUP BY tyre_brand, tyre_model, condition_key;

-- Top 5 des pneus par condition (classé par score global)
CREATE OR REPLACE VIEW v_top5_par_condition AS
SELECT
    *,
    RANK() OVER (PARTITION BY condition_key ORDER BY score_global DESC) AS rang
FROM v_scores_par_condition;

-- Kilomètres parcourus par utilisateur sur le mois en cours
CREATE OR REPLACE VIEW v_km_mois_courant AS
SELECT
    utilisateur_id,
    SUM(distance_km) AS total_km_mois,
    COUNT(*)         AS nb_sorties_mois
FROM sortie
WHERE date_sortie >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY utilisateur_id;
