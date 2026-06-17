import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ID = {
  produits: {
    michPowerCup:  'a0000001-0000-0000-0000-000000000001',
    michPowerRoad: 'a0000001-0000-0000-0000-000000000002',
    michGravel:    'a0000001-0000-0000-0000-000000000003',
    michCountry:   'a0000001-0000-0000-0000-000000000004',
    contGP5000:    'a0000001-0000-0000-0000-000000000005',
    contTerra:     'a0000001-0000-0000-0000-000000000006',
    schwOne:       'a0000001-0000-0000-0000-000000000007',
    vittCorsa:     'a0000001-0000-0000-0000-000000000008',
    pirelliPZero:  'a0000001-0000-0000-0000-000000000009',
  },
  clubs: {
    vcNantes:  'b0000001-0000-0000-0000-000000000001',
    vcRennes:  'b0000001-0000-0000-0000-000000000002',
    gravel44:  'b0000001-0000-0000-0000-000000000003',
    parisvelo: 'b0000001-0000-0000-0000-000000000004',
    lyonCyclo: 'b0000001-0000-0000-0000-000000000005',
  },
  users: {
    thomas:  'c0000001-0000-0000-0000-000000000001',
    sophie:  'c0000001-0000-0000-0000-000000000002',
    lucas:   'c0000001-0000-0000-0000-000000000003',
    camille: 'c0000001-0000-0000-0000-000000000004',
    antoine: 'c0000001-0000-0000-0000-000000000005',
  },
  velos: {
    v1: 'd0000001-0000-0000-0000-000000000001',
    v2: 'd0000001-0000-0000-0000-000000000002',
    v3: 'd0000001-0000-0000-0000-000000000003',
    v4: 'd0000001-0000-0000-0000-000000000004',
  },
  materiels: {
    m1: 'e0000001-0000-0000-0000-000000000001',
    m2: 'e0000001-0000-0000-0000-000000000002',
    m3: 'e0000001-0000-0000-0000-000000000003',
    m4: 'e0000001-0000-0000-0000-000000000004',
  },
  avis: {
    a1: 'f0000001-0000-0000-0000-000000000001',
    a2: 'f0000001-0000-0000-0000-000000000002',
    a3: 'f0000001-0000-0000-0000-000000000003',
  },
  classements: {
    c1: '10000001-0000-0000-0000-000000000001',
    c2: '10000001-0000-0000-0000-000000000002',
    c3: '10000001-0000-0000-0000-000000000003',
  },
};

async function main(): Promise<void> {
  console.log('Seeding Kilometra database...');

  // ─── PRODUITS ────────────────────────────────────────────────────────────────
  const produits = await Promise.all([
    prisma.produit.upsert({ where: { id: ID.produits.michPowerCup  }, update: {}, create: { id: ID.produits.michPowerCup,  marque: 'Michelin',    modele: 'Power Cup Competition TLR', typeUsage: 'route',  prix: 89.99, estMichelin: true  } }),
    prisma.produit.upsert({ where: { id: ID.produits.michPowerRoad }, update: {}, create: { id: ID.produits.michPowerRoad, marque: 'Michelin',    modele: 'Power Road TLR',            typeUsage: 'route',  prix: 69.99, estMichelin: true  } }),
    prisma.produit.upsert({ where: { id: ID.produits.michGravel    }, update: {}, create: { id: ID.produits.michGravel,    marque: 'Michelin',    modele: 'Power Gravel Competition',  typeUsage: 'gravel', prix: 79.99, estMichelin: true  } }),
    prisma.produit.upsert({ where: { id: ID.produits.michCountry   }, update: {}, create: { id: ID.produits.michCountry,   marque: 'Michelin',    modele: "Country Race'r",            typeUsage: 'gravel', prix: 39.99, estMichelin: true  } }),
    prisma.produit.upsert({ where: { id: ID.produits.contGP5000    }, update: {}, create: { id: ID.produits.contGP5000,    marque: 'Continental', modele: 'Grand Prix 5000 S TR',      typeUsage: 'route',  prix: 74.99, estMichelin: false } }),
    prisma.produit.upsert({ where: { id: ID.produits.contTerra     }, update: {}, create: { id: ID.produits.contTerra,     marque: 'Continental', modele: 'Terra Speed ProTection',    typeUsage: 'gravel', prix: 69.99, estMichelin: false } }),
    prisma.produit.upsert({ where: { id: ID.produits.schwOne       }, update: {}, create: { id: ID.produits.schwOne,       marque: 'Schwalbe',    modele: 'One TLE V-Guard',           typeUsage: 'route',  prix: 62.99, estMichelin: false } }),
    prisma.produit.upsert({ where: { id: ID.produits.vittCorsa     }, update: {}, create: { id: ID.produits.vittCorsa,     marque: 'Vittoria',    modele: 'Corsa Pro TLR',             typeUsage: 'route',  prix: 84.99, estMichelin: false } }),
    prisma.produit.upsert({ where: { id: ID.produits.pirelliPZero  }, update: {}, create: { id: ID.produits.pirelliPZero,  marque: 'Pirelli',     modele: 'P Zero Race TLR',           typeUsage: 'route',  prix: 79.99, estMichelin: false } }),
  ]);
  console.log(`✓ ${produits.length} produits`);

  // ─── CLUBS ───────────────────────────────────────────────────────────────────
  const clubs = await Promise.all([
    prisma.club.upsert({ where: { id: ID.clubs.vcNantes   }, update: {}, create: { id: ID.clubs.vcNantes,   nom: 'VC Nantais',      departement: '44', region: 'Pays de la Loire',      ville: 'Nantes',        actif: true } }),
    prisma.club.upsert({ where: { id: ID.clubs.vcRennes   }, update: {}, create: { id: ID.clubs.vcRennes,   nom: 'VC Rennais',      departement: '35', region: 'Bretagne',              ville: 'Rennes',        actif: true } }),
    prisma.club.upsert({ where: { id: ID.clubs.gravel44   }, update: {}, create: { id: ID.clubs.gravel44,   nom: 'Gravel 44',       departement: '44', region: 'Pays de la Loire',      ville: 'Saint-Nazaire', actif: true } }),
    prisma.club.upsert({ where: { id: ID.clubs.parisvelo  }, update: {}, create: { id: ID.clubs.parisvelo,  nom: 'Paris Vélo Club', departement: '75', region: 'Île-de-France',         ville: 'Paris',         actif: true } }),
    prisma.club.upsert({ where: { id: ID.clubs.lyonCyclo  }, update: {}, create: { id: ID.clubs.lyonCyclo,  nom: 'Lyon Cyclisme',   departement: '69', region: 'Auvergne-Rhône-Alpes', ville: 'Lyon',          actif: true } }),
  ]);
  console.log(`✓ ${clubs.length} clubs`);

  // ─── UTILISATEURS ────────────────────────────────────────────────────────────
  const utilisateurs = await Promise.all([
    prisma.utilisateur.upsert({ where: { email: 'thomas.martin@email.fr'  }, update: {}, create: { id: ID.users.thomas,  prenom: 'Thomas',  nom: 'Martin',  email: 'thomas.martin@email.fr',  motDePasseHash: '$2b$10$placeholder', departement: '44', region: 'Pays de la Loire',      profile: 'intensif',    actif: true } }),
    prisma.utilisateur.upsert({ where: { email: 'sophie.bernard@email.fr' }, update: {}, create: { id: ID.users.sophie,  prenom: 'Sophie',  nom: 'Bernard', email: 'sophie.bernard@email.fr', motDePasseHash: '$2b$10$placeholder', departement: '35', region: 'Bretagne',              profile: 'regulier',    actif: true } }),
    prisma.utilisateur.upsert({ where: { email: 'lucas.dupont@email.fr'   }, update: {}, create: { id: ID.users.lucas,   prenom: 'Lucas',   nom: 'Dupont',  email: 'lucas.dupont@email.fr',   motDePasseHash: '$2b$10$placeholder', departement: '44', region: 'Pays de la Loire',      profile: 'regulier',    actif: true } }),
    prisma.utilisateur.upsert({ where: { email: 'camille.leroy@email.fr'  }, update: {}, create: { id: ID.users.camille, prenom: 'Camille', nom: 'Leroy',   email: 'camille.leroy@email.fr',  motDePasseHash: '$2b$10$placeholder', departement: '75', region: 'Île-de-France',         profile: 'occasionnel', actif: true } }),
    prisma.utilisateur.upsert({ where: { email: 'antoine.moreau@email.fr' }, update: {}, create: { id: ID.users.antoine, prenom: 'Antoine', nom: 'Moreau',  email: 'antoine.moreau@email.fr', motDePasseHash: '$2b$10$placeholder', departement: '69', region: 'Auvergne-Rhône-Alpes', profile: 'intensif',    actif: true } }),
  ]);
  console.log(`✓ ${utilisateurs.length} utilisateurs`);

  // ─── VÉLOS ───────────────────────────────────────────────────────────────────
  const velos = await Promise.all([
    prisma.velo.upsert({ where: { id: ID.velos.v1 }, update: {}, create: { id: ID.velos.v1, utilisateurId: ID.users.thomas,  marque: 'Trek',        modele: 'Domane SL 6',         annee: 2023, type: 'route',  valeurAchat: 3200, actif: true } }),
    prisma.velo.upsert({ where: { id: ID.velos.v2 }, update: {}, create: { id: ID.velos.v2, utilisateurId: ID.users.sophie,  marque: 'Specialized', modele: 'Diverge Comp Carbon', annee: 2022, type: 'gravel', valeurAchat: 2800, actif: true } }),
    prisma.velo.upsert({ where: { id: ID.velos.v3 }, update: {}, create: { id: ID.velos.v3, utilisateurId: ID.users.lucas,   marque: 'Canyon',      modele: 'Endurace CF SL 7',    annee: 2023, type: 'route',  valeurAchat: 2400, actif: true } }),
    prisma.velo.upsert({ where: { id: ID.velos.v4 }, update: {}, create: { id: ID.velos.v4, utilisateurId: ID.users.antoine, marque: 'Cannondale',  modele: 'SuperSix EVO',        annee: 2021, type: 'route',  valeurAchat: 4100, actif: true } }),
  ]);
  console.log(`✓ ${velos.length} vélos`);

  // ─── MATÉRIELS ───────────────────────────────────────────────────────────────
  const materiels = await Promise.all([
    prisma.materiel.upsert({ where: { id: ID.materiels.m1 }, update: {}, create: { id: ID.materiels.m1, veloId: ID.velos.v1, produitId: ID.produits.michPowerCup,  kmParcourus: 620, avisDemande: true,  actif: true } }),
    prisma.materiel.upsert({ where: { id: ID.materiels.m2 }, update: {}, create: { id: ID.materiels.m2, veloId: ID.velos.v2, produitId: ID.produits.michGravel,    kmParcourus: 810, avisDemande: true,  actif: true } }),
    prisma.materiel.upsert({ where: { id: ID.materiels.m3 }, update: {}, create: { id: ID.materiels.m3, veloId: ID.velos.v3, produitId: ID.produits.contGP5000,    kmParcourus: 320, avisDemande: false, actif: true } }),
    prisma.materiel.upsert({ where: { id: ID.materiels.m4 }, update: {}, create: { id: ID.materiels.m4, veloId: ID.velos.v4, produitId: ID.produits.michPowerRoad, kmParcourus: 980, avisDemande: true,  actif: true } }),
  ]);
  console.log(`✓ ${materiels.length} matériels`);

  // ─── AVIS (uniquement pour matériels >= 500 km) ───────────────────────────────
  const avis = await Promise.all([
    prisma.avis.upsert({ where: { materielId: ID.materiels.m1 }, update: {}, create: { id: ID.avis.a1, utilisateurId: ID.users.thomas,  produitId: ID.produits.michPowerCup,  materielId: ID.materiels.m1, noteAdherence: 5, noteConfort: 4, noteLongevite: 4, notePrixPerf: 3, noteRendement: 5, noteGripMouille: 4, conditionsTest: ['sec', 'pluie'],     commentaire: 'Excellent pneu, très accrocheur même sous la pluie.',       kmAuMoment: 620, valide: true } }),
    prisma.avis.upsert({ where: { materielId: ID.materiels.m2 }, update: {}, create: { id: ID.avis.a2, utilisateurId: ID.users.sophie,  produitId: ID.produits.michGravel,    materielId: ID.materiels.m2, noteAdherence: 5, noteConfort: 5, noteLongevite: 4, notePrixPerf: 4, noteRendement: 4, noteGripMouille: 5, conditionsTest: ['gravel', 'boueux'], commentaire: 'Parfait pour les chemins mixtes, tient bien dans la boue.', kmAuMoment: 810, valide: true } }),
    prisma.avis.upsert({ where: { materielId: ID.materiels.m4 }, update: {}, create: { id: ID.avis.a3, utilisateurId: ID.users.antoine, produitId: ID.produits.michPowerRoad, materielId: ID.materiels.m4, noteAdherence: 4, noteConfort: 4, noteLongevite: 5, notePrixPerf: 4, noteRendement: 4, noteGripMouille: 3, conditionsTest: ['sec'],              commentaire: 'Très endurant, idéal pour les longues sorties.',            kmAuMoment: 980, valide: true } }),
  ]);
  console.log(`✓ ${avis.length} avis`);

  // ─── MEMBRES CLUBS ────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.membreClub.upsert({ where: { utilisateurId_clubId: { utilisateurId: ID.users.thomas,  clubId: ID.clubs.vcNantes  } }, update: {}, create: { utilisateurId: ID.users.thomas,  clubId: ID.clubs.vcNantes,  role: 'admin'  } }),
    prisma.membreClub.upsert({ where: { utilisateurId_clubId: { utilisateurId: ID.users.sophie,  clubId: ID.clubs.vcRennes  } }, update: {}, create: { utilisateurId: ID.users.sophie,  clubId: ID.clubs.vcRennes,  role: 'membre' } }),
    prisma.membreClub.upsert({ where: { utilisateurId_clubId: { utilisateurId: ID.users.lucas,   clubId: ID.clubs.vcNantes  } }, update: {}, create: { utilisateurId: ID.users.lucas,   clubId: ID.clubs.vcNantes,  role: 'membre' } }),
    prisma.membreClub.upsert({ where: { utilisateurId_clubId: { utilisateurId: ID.users.lucas,   clubId: ID.clubs.gravel44  } }, update: {}, create: { utilisateurId: ID.users.lucas,   clubId: ID.clubs.gravel44,  role: 'membre' } }),
    prisma.membreClub.upsert({ where: { utilisateurId_clubId: { utilisateurId: ID.users.antoine, clubId: ID.clubs.lyonCyclo } }, update: {}, create: { utilisateurId: ID.users.antoine, clubId: ID.clubs.lyonCyclo, role: 'admin'  } }),
  ]);
  console.log('✓ membres clubs');

  // ─── CLASSEMENTS ─────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.classementMensuel.upsert({ where: { utilisateurId_mois_annee_scope: { utilisateurId: ID.users.thomas,  mois: 5, annee: 2026, scope: 'dept'   } }, update: {}, create: { id: ID.classements.c1, utilisateurId: ID.users.thomas,  clubId: ID.clubs.vcNantes,  mois: 5, annee: 2026, scope: 'dept',   totalKm: 620, position: 1, gagnant: true  } }),
    prisma.classementMensuel.upsert({ where: { utilisateurId_mois_annee_scope: { utilisateurId: ID.users.antoine, mois: 5, annee: 2026, scope: 'region' } }, update: {}, create: { id: ID.classements.c2, utilisateurId: ID.users.antoine, clubId: ID.clubs.lyonCyclo, mois: 5, annee: 2026, scope: 'region', totalKm: 980, position: 1, gagnant: true  } }),
    prisma.classementMensuel.upsert({ where: { utilisateurId_mois_annee_scope: { utilisateurId: ID.users.sophie,  mois: 5, annee: 2026, scope: 'dept'   } }, update: {}, create: { id: ID.classements.c3, utilisateurId: ID.users.sophie,  clubId: ID.clubs.vcRennes,  mois: 5, annee: 2026, scope: 'dept',   totalKm: 810, position: 2, gagnant: false } }),
  ]);
  console.log('✓ classements');

  // ─── RÉCOMPENSES (gagnants avec produit Michelin uniquement) ──────────────────
  await Promise.all([
    prisma.recompense.upsert({ where: { classementId: ID.classements.c1 }, update: {}, create: { classementId: ID.classements.c1, produitId: ID.produits.michPowerCup,  statut: 'expediee',  adresseLivraison: '12 rue des Cyclistes, 44000 Nantes' } }),
    prisma.recompense.upsert({ where: { classementId: ID.classements.c2 }, update: {}, create: { classementId: ID.classements.c2, produitId: ID.produits.michPowerRoad, statut: 'attribuee', adresseLivraison: '8 avenue Berthelot, 69007 Lyon'    } }),
  ]);
  console.log('✓ récompenses');

  console.log('\n🚴 Seed Kilometra terminé avec succès.');
}

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
