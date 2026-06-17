-- =============================================================================
-- KILOMETRA — Reset complet de la base de données
-- Supprime toutes les tables dans l'ordre inverse des FK,
-- puis recrée le schéma depuis schema.sql.
-- Usage : \i database/reset.sql
-- =============================================================================

-- Suppression des triggers et fonctions
DROP TRIGGER IF EXISTS check_recompense_michelin ON recompense;
DROP TRIGGER IF EXISTS check_avis_km             ON avis;
DROP TRIGGER IF EXISTS auto_avis_demande          ON materiel;

DROP FUNCTION IF EXISTS fn_check_recompense_michelin();
DROP FUNCTION IF EXISTS fn_check_avis_km();
DROP FUNCTION IF EXISTS fn_auto_avis_demande();

-- Suppression des tables dans l'ordre inverse des dépendances FK
DROP TABLE IF EXISTS recompense         CASCADE;
DROP TABLE IF EXISTS classement_mensuel CASCADE;
DROP TABLE IF EXISTS avis               CASCADE;
DROP TABLE IF EXISTS materiel           CASCADE;
DROP TABLE IF EXISTS velo               CASCADE;
DROP TABLE IF EXISTS membre_club        CASCADE;
DROP TABLE IF EXISTS produit            CASCADE;
DROP TABLE IF EXISTS club               CASCADE;
DROP TABLE IF EXISTS utilisateur        CASCADE;

-- Recréation depuis zéro
\i database/schema.sql
