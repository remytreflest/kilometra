-- =============================================================================
-- KILOMETRA — Données de test (seed)
-- Compatible PostgreSQL 14+
-- Prérequis : \i database/schema.sql
-- Usage     : \i database/seed.sql
-- =============================================================================

-- =============================================================================
-- PRODUIT — Catalogue de pneus (15 références)
-- =============================================================================
INSERT INTO produit (id, marque, modele, type_usage, prix, est_michelin) VALUES
-- Michelin (éligibles aux récompenses)
('11111111-0001-0001-0001-000000000001', 'Michelin', 'Power Cup Competition TLR',    'route',  89.99, TRUE),
('11111111-0001-0001-0001-000000000002', 'Michelin', 'Power Road TLR',               'route',  69.99, TRUE),
('11111111-0001-0001-0001-000000000003', 'Michelin', 'Power Gravel Competition',      'gravel', 79.99, TRUE),
('11111111-0001-0001-0001-000000000004', 'Michelin', 'Country Race''r',              'gravel', 39.99, TRUE),
-- Continental
('11111111-0001-0001-0001-000000000005', 'Continental', 'Grand Prix 5000 S TR',       'route',  74.99, FALSE),
('11111111-0001-0001-0001-000000000006', 'Continental', 'Terra Speed ProTection',     'gravel', 69.99, FALSE),
-- Schwalbe
('11111111-0001-0001-0001-000000000007', 'Schwalbe', 'One TLE V-Guard',              'route',  62.99, FALSE),
('11111111-0001-0001-0001-000000000008', 'Schwalbe', 'G-One Allround TLE',           'gravel', 59.99, FALSE),
-- Vittoria
('11111111-0001-0001-0001-000000000009', 'Vittoria', 'Corsa Pro TLR',                'route',  84.99, FALSE),
('11111111-0001-0001-0001-000000000010', 'Vittoria', 'Terreno Dry TLR',              'gravel', 64.99, FALSE),
-- Maxxis
('11111111-0001-0001-0001-000000000011', 'Maxxis',   'Padrone TR',                   'route',  54.99, FALSE),
-- Pirelli
('11111111-0001-0001-0001-000000000012', 'Pirelli',  'P Zero Race TLR',              'route',  79.99, FALSE),
-- Michelin VTT (éligibles)
('11111111-0001-0001-0001-000000000013', 'Michelin', 'Wild Enduro Front Magi-X',     'vtt',    54.99, TRUE),
-- Maxxis VTT
('11111111-0001-0001-0001-000000000014', 'Maxxis',   'Minion DHF TR EXO',            'vtt',    59.99, FALSE),
-- Schwalbe VTT
('11111111-0001-0001-0001-000000000015', 'Schwalbe', 'Magic Mary Super Gravity',     'vtt',    74.99, FALSE);

-- =============================================================================
-- CLUB — 5 clubs cyclistes régionaux
-- =============================================================================
INSERT INTO club (id, nom, departement, region, ville) VALUES
('22222222-0002-0002-0002-000000000001', 'VC Nantes',         '44', 'Pays de la Loire',  'Nantes'),
('22222222-0002-0002-0002-000000000002', 'VC Rennais',        '35', 'Bretagne',          'Rennes'),
('22222222-0002-0002-0002-000000000003', 'Gravel 44',         '44', 'Pays de la Loire',  'Saint-Nazaire'),
('22222222-0002-0002-0002-000000000004', 'Paris Vélo Club',   '75', 'Île-de-France',     'Paris'),
('22222222-0002-0002-0002-000000000005', 'Lyon Cyclisme',     '69', 'Auvergne-Rhône-Alpes', 'Lyon');

-- =============================================================================
-- UTILISATEUR — 10 cyclistes français
-- Mots de passe : tous '$2b$10$placeholder' (bcrypt simulé pour les seeds)
-- =============================================================================
INSERT INTO utilisateur (id, prenom, nom, email, mot_de_passe_hash, departement, region) VALUES
('33333333-0003-0003-0003-000000000001', 'Lucas',    'Moreau',    'lucas.moreau@example.com',    '$2b$10$placeholder', '44', 'Pays de la Loire'),
('33333333-0003-0003-0003-000000000002', 'Emma',     'Dupont',    'emma.dupont@example.com',     '$2b$10$placeholder', '44', 'Pays de la Loire'),
('33333333-0003-0003-0003-000000000003', 'Thomas',   'Bernard',   'thomas.bernard@example.com',  '$2b$10$placeholder', '35', 'Bretagne'),
('33333333-0003-0003-0003-000000000004', 'Chloé',    'Leroy',     'chloe.leroy@example.com',     '$2b$10$placeholder', '35', 'Bretagne'),
('33333333-0003-0003-0003-000000000005', 'Nicolas',  'Petit',     'nicolas.petit@example.com',   '$2b$10$placeholder', '75', 'Île-de-France'),
('33333333-0003-0003-0003-000000000006', 'Julie',    'Martin',    'julie.martin@example.com',    '$2b$10$placeholder', '75', 'Île-de-France'),
('33333333-0003-0003-0003-000000000007', 'Antoine',  'Dubois',    'antoine.dubois@example.com',  '$2b$10$placeholder', '69', 'Auvergne-Rhône-Alpes'),
('33333333-0003-0003-0003-000000000008', 'Sarah',    'Thomas',    'sarah.thomas@example.com',    '$2b$10$placeholder', '69', 'Auvergne-Rhône-Alpes'),
('33333333-0003-0003-0003-000000000009', 'Mathieu',  'Robert',    'mathieu.robert@example.com',  '$2b$10$placeholder', '44', 'Pays de la Loire'),
('33333333-0003-0003-0003-000000000010', 'Camille',  'Simon',     'camille.simon@example.com',   '$2b$10$placeholder', '35', 'Bretagne');

-- =============================================================================
-- MEMBRE_CLUB — affiliations
-- =============================================================================
INSERT INTO membre_club (utilisateur_id, club_id, role) VALUES
-- VC Nantes
('33333333-0003-0003-0003-000000000001', '22222222-0002-0002-0002-000000000001', 'admin'),
('33333333-0003-0003-0003-000000000002', '22222222-0002-0002-0002-000000000001', 'membre'),
('33333333-0003-0003-0003-000000000009', '22222222-0002-0002-0002-000000000001', 'membre'),
-- VC Rennais
('33333333-0003-0003-0003-000000000003', '22222222-0002-0002-0002-000000000002', 'admin'),
('33333333-0003-0003-0003-000000000004', '22222222-0002-0002-0002-000000000002', 'membre'),
('33333333-0003-0003-0003-000000000010', '22222222-0002-0002-0002-000000000002', 'membre'),
-- Gravel 44
('33333333-0003-0003-0003-000000000001', '22222222-0002-0002-0002-000000000003', 'membre'),
('33333333-0003-0003-0003-000000000002', '22222222-0002-0002-0002-000000000003', 'membre'),
-- Paris Vélo Club
('33333333-0003-0003-0003-000000000005', '22222222-0002-0002-0002-000000000004', 'admin'),
('33333333-0003-0003-0003-000000000006', '22222222-0002-0002-0002-000000000004', 'membre'),
-- Lyon Cyclisme
('33333333-0003-0003-0003-000000000007', '22222222-0002-0002-0002-000000000005', 'admin'),
('33333333-0003-0003-0003-000000000008', '22222222-0002-0002-0002-000000000005', 'membre');

-- =============================================================================
-- VELO — un ou deux vélos par utilisateur
-- =============================================================================
INSERT INTO velo (id, utilisateur_id, marque, modele, annee, type) VALUES
('44444444-0004-0004-0004-000000000001', '33333333-0003-0003-0003-000000000001', 'Trek',       'Domane SL 6',        2022, 'route'),
('44444444-0004-0004-0004-000000000002', '33333333-0003-0003-0003-000000000001', 'Trek',       'Checkpoint ALR 5',   2023, 'gravel'),
('44444444-0004-0004-0004-000000000003', '33333333-0003-0003-0003-000000000002', 'Specialized', 'Roubaix Expert',    2021, 'route'),
('44444444-0004-0004-0004-000000000004', '33333333-0003-0003-0003-000000000003', 'Canyon',     'Endurace CF 7',      2023, 'route'),
('44444444-0004-0004-0004-000000000005', '33333333-0003-0003-0003-000000000004', 'Orbea',      'Terra M30',          2022, 'gravel'),
('44444444-0004-0004-0004-000000000006', '33333333-0003-0003-0003-000000000005', 'Giant',      'TCR Advanced 1',     2022, 'route'),
('44444444-0004-0004-0004-000000000007', '33333333-0003-0003-0003-000000000006', 'Cannondale', 'Synapse Carbon 3',   2021, 'route'),
('44444444-0004-0004-0004-000000000008', '33333333-0003-0003-0003-000000000007', 'Scott',      'Addict RC 30',       2023, 'route'),
('44444444-0004-0004-0004-000000000009', '33333333-0003-0003-0003-000000000008', 'Bianchi',    'Oltre XR4',          2022, 'route'),
('44444444-0004-0004-0004-000000000010', '33333333-0003-0003-0003-000000000009', 'Ridley',     'Kanzo Fast',         2023, 'gravel'),
('44444444-0004-0004-0004-000000000011', '33333333-0003-0003-0003-000000000010', 'Merida',     'Reacto 5000',        2022, 'route');

-- =============================================================================
-- MATERIEL — pneus montés (certains > 500 km pour débloquer les avis)
-- =============================================================================
INSERT INTO materiel (id, velo_id, produit_id, date_installation, km_parcourus, avis_demande, actif) VALUES
-- Lucas (velo route) — 720 km Michelin Power Cup → avis débloqué
('55555555-0005-0005-0005-000000000001', '44444444-0004-0004-0004-000000000001', '11111111-0001-0001-0001-000000000001', '2025-01-10', 720.0, TRUE,  TRUE),
-- Lucas (velo gravel) — 310 km en cours
('55555555-0005-0005-0005-000000000002', '44444444-0004-0004-0004-000000000002', '11111111-0001-0001-0001-000000000003', '2025-03-05', 310.0, FALSE, TRUE),
-- Emma (velo route) — 615 km Michelin Power Road → avis débloqué
('55555555-0005-0005-0005-000000000003', '44444444-0004-0004-0004-000000000003', '11111111-0001-0001-0001-000000000002', '2025-02-14', 615.0, TRUE,  TRUE),
-- Thomas (velo route) — 890 km Continental GP5000 → avis débloqué
('55555555-0005-0005-0005-000000000004', '44444444-0004-0004-0004-000000000004', '11111111-0001-0001-0001-000000000005', '2024-11-01', 890.0, TRUE,  TRUE),
-- Chloé (velo gravel) — 120 km Schwalbe G-One, pas encore débloqué
('55555555-0005-0005-0005-000000000005', '44444444-0004-0004-0004-000000000005', '11111111-0001-0001-0001-000000000008', '2025-04-20', 120.0, FALSE, TRUE),
-- Nicolas (velo route) — 540 km Vittoria Corsa Pro → avis débloqué
('55555555-0005-0005-0005-000000000006', '44444444-0004-0004-0004-000000000006', '11111111-0001-0001-0001-000000000009', '2025-01-20', 540.0, TRUE,  TRUE),
-- Julie — 200 km Pirelli P Zero
('55555555-0005-0005-0005-000000000007', '44444444-0004-0004-0004-000000000007', '11111111-0001-0001-0001-000000000012', '2025-03-15', 200.0, FALSE, TRUE),
-- Antoine — 1050 km Michelin Power Cup → avis débloqué
('55555555-0005-0005-0005-000000000008', '44444444-0004-0004-0004-000000000008', '11111111-0001-0001-0001-000000000001', '2024-09-01', 1050.0, TRUE, TRUE),
-- Sarah — 380 km Maxxis Padrone
('55555555-0005-0005-0005-000000000009', '44444444-0004-0004-0004-000000000009', '11111111-0001-0001-0001-000000000011', '2025-02-28', 380.0, FALSE, TRUE),
-- Mathieu — 750 km Michelin Power Gravel → avis débloqué
('55555555-0005-0005-0005-000000000010', '44444444-0004-0004-0004-000000000010', '11111111-0001-0001-0001-000000000003', '2024-12-01', 750.0, TRUE,  TRUE),
-- Camille — 450 km Continental Terra Speed
('55555555-0005-0005-0005-000000000011', '44444444-0004-0004-0004-000000000011', '11111111-0001-0001-0001-000000000006', '2025-03-01', 450.0, FALSE, TRUE);

-- =============================================================================
-- AVIS — 4 avis validés (uniquement pour les matériels >= 500 km)
-- =============================================================================
INSERT INTO avis (id, utilisateur_id, produit_id, materiel_id, note_adherence, note_confort, note_longevite, note_prix_perf, commentaire, km_au_moment, date_avis, valide) VALUES
-- Lucas → Michelin Power Cup Competition TLR
('66666666-0006-0006-0006-000000000001',
 '33333333-0003-0003-0003-000000000001',
 '11111111-0001-0001-0001-000000000001',
 '55555555-0005-0005-0005-000000000001',
 5, 5, 4, 4,
 'Excellent pneu de compétition. Adhérence impressionnante sur bitume mouillé, confort surprenant pour un slick tubeless. Je le recommande pour la saison sur route.',
 720.0,
 '2025-04-15 09:30:00',
 TRUE),
-- Emma → Michelin Power Road TLR
('66666666-0006-0006-0006-000000000002',
 '33333333-0003-0003-0003-000000000002',
 '11111111-0001-0001-0001-000000000002',
 '55555555-0005-0005-0005-000000000003',
 4, 5, 4, 5,
 'Très bon compromis entre performance et durabilité. Monte facilement sur les jantes, peu de crevaisons en 600 km. Idéal pour les longues sorties.',
 615.0,
 '2025-04-20 14:00:00',
 TRUE),
-- Thomas → Continental Grand Prix 5000 S TR
('66666666-0006-0006-0006-000000000003',
 '33333333-0003-0003-0003-000000000003',
 '11111111-0001-0001-0001-000000000005',
 '55555555-0005-0005-0005-000000000004',
 4, 4, 5, 4,
 'Incroyable longévité, ce pneu tient vraiment la distance. Excellent sur le plat, un peu ferme en descente sur pavés mouillés mais rien de rédhibitoire.',
 890.0,
 '2025-03-10 08:00:00',
 TRUE),
-- Antoine → Michelin Power Cup Competition TLR (2e avis)
('66666666-0006-0006-0006-000000000004',
 '33333333-0003-0003-0003-000000000007',
 '11111111-0001-0001-0001-000000000001',
 '55555555-0005-0005-0005-000000000008',
 5, 4, 5, 4,
 'Plus de 1000 km avec ce pneu et aucun souci. Idéal pour les cyclosportives et l'entraînement intensif. La bande de roulement tient très bien dans le temps.',
 1050.0,
 '2025-05-01 10:00:00',
 TRUE);

-- =============================================================================
-- CLASSEMENT_MENSUEL — mai 2025
-- Lucas et Antoine sont gagnants dans leurs scopes respectifs
-- =============================================================================
INSERT INTO classement_mensuel (id, utilisateur_id, club_id, mois, annee, scope, total_km, position, gagnant) VALUES
-- Scope département 44 — Lucas gagnant
('77777777-0007-0007-0007-000000000001', '33333333-0003-0003-0003-000000000001', '22222222-0002-0002-0002-000000000001', 5, 2025, 'dept',     1243.5, 1, TRUE),
('77777777-0007-0007-0007-000000000002', '33333333-0003-0003-0003-000000000002', '22222222-0002-0002-0002-000000000001', 5, 2025, 'dept',     1105.0, 2, FALSE),
('77777777-0007-0007-0007-000000000003', '33333333-0003-0003-0003-000000000009', '22222222-0002-0002-0002-000000000001', 5, 2025, 'dept',      980.2, 3, FALSE),
-- Scope région Pays de la Loire — Lucas gagnant
('77777777-0007-0007-0007-000000000004', '33333333-0003-0003-0003-000000000001', '22222222-0002-0002-0002-000000000001', 5, 2025, 'region',   1243.5, 1, TRUE),
('77777777-0007-0007-0007-000000000005', '33333333-0003-0003-0003-000000000002', '22222222-0002-0002-0002-000000000001', 5, 2025, 'region',   1105.0, 2, FALSE),
-- Scope national — Antoine gagnant
('77777777-0007-0007-0007-000000000006', '33333333-0003-0003-0003-000000000007', '22222222-0002-0002-0002-000000000005', 5, 2025, 'national', 1890.0, 1, TRUE),
('77777777-0007-0007-0007-000000000007', '33333333-0003-0003-0003-000000000001', '22222222-0002-0002-0002-000000000001', 5, 2025, 'national', 1243.5, 2, FALSE),
('77777777-0007-0007-0007-000000000008', '33333333-0003-0003-0003-000000000005', '22222222-0002-0002-0002-000000000004', 5, 2025, 'national',  978.0, 3, FALSE),
-- Scope club VC Nantes — Lucas gagnant
('77777777-0007-0007-0007-000000000009', '33333333-0003-0003-0003-000000000001', '22222222-0002-0002-0002-000000000001', 5, 2025, 'club',     1243.5, 1, TRUE),
('77777777-0007-0007-0007-000000000010', '33333333-0003-0003-0003-000000000002', '22222222-0002-0002-0002-000000000001', 5, 2025, 'club',     1105.0, 2, FALSE),
-- Scope club Lyon Cyclisme — Antoine gagnant
('77777777-0007-0007-0007-000000000011', '33333333-0003-0003-0003-000000000007', '22222222-0002-0002-0002-000000000005', 5, 2025, 'club',     1890.0, 1, TRUE),
('77777777-0007-0007-0007-000000000012', '33333333-0003-0003-0003-000000000008', '22222222-0002-0002-0002-000000000005', 5, 2025, 'club',      654.0, 2, FALSE);

-- =============================================================================
-- RECOMPENSE — attribuées aux gagnants (produits Michelin uniquement)
-- Lucas : gagnant dept (récompense Michelin Power Cup Competition TLR)
-- Antoine : gagnant national (récompense Michelin Power Road TLR)
-- =============================================================================
INSERT INTO recompense (id, classement_id, produit_id, statut, date_attribution, date_expedition, adresse_livraison) VALUES
-- Lucas — gagnant département 44
('88888888-0008-0008-0008-000000000001',
 '77777777-0007-0007-0007-000000000001',
 '11111111-0001-0001-0001-000000000001',
 'expediee',
 '2025-06-01 08:00:00',
 '2025-06-03 14:00:00',
 '12 rue des Acaias, 44000 Nantes, France'),
-- Antoine — gagnant national
('88888888-0008-0008-0008-000000000002',
 '77777777-0007-0007-0007-000000000006',
 '11111111-0001-0001-0001-000000000002',
 'attribuee',
 '2025-06-01 08:00:00',
 NULL,
 '7 avenue Berthelot, 69007 Lyon, France');
