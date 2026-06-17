import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Club, RaceResult, RankingScale } from '../../shared/models/club.model';

const CLUBS: Club[] = [
  { id: 'c01', name: 'Vélo Club Angevin',            region: 'Pays de la Loire', department: 'Maine-et-Loire',    memberCount: 184, totalKm: 42_180, monthlyKm: 12_400, rank: 1,  rankDelta: 0,  monthlyKmDelta: 1_200, michelinEquipmentPct: 68, badges: [{ id:'b1', label:'Top 1 régional', icon:'emoji_events', color:'#FCE500', unlocked:true }, { id:'b2', label:'10 000 km/mois', icon:'speed', color:'#27509B', unlocked:true }] },
  { id: 'c02', name: 'Rennes Cyclo Performance',      region: 'Bretagne',         department: 'Ille-et-Vilaine',   memberCount: 156, totalKm: 39_720, monthlyKm: 10_800, rank: 2,  rankDelta: 1,  monthlyKmDelta: 980,   michelinEquipmentPct: 54, badges: [] },
  { id: 'c03', name: 'Club Cyclotouriste Nantais',    region: 'Pays de la Loire', department: 'Loire-Atlantique',  memberCount: 142, totalKm: 37_050, monthlyKm: 9_600,  rank: 3,  rankDelta: 2,  monthlyKmDelta: 1_050, michelinEquipmentPct: 72, badges: [{ id:'b3', label:'Top 5 régional', icon:'emoji_events', color:'#FCE500', unlocked:true }, { id:'b4', label:'Régularité exemplaire', icon:'check_circle', color:'#84BD00', unlocked:true }] },
  { id: 'c04', name: 'Les Mouettes du Croisic',       region: 'Pays de la Loire', department: 'Loire-Atlantique',  memberCount: 98,  totalKm: 31_410, monthlyKm: 8_200,  rank: 4,  rankDelta: -1, monthlyKmDelta: 620,   michelinEquipmentPct: 61, badges: [] },
  { id: 'c05', name: 'Vendée Cycle Sport',             region: 'Pays de la Loire', department: 'Vendée',            memberCount: 121, totalKm: 29_980, monthlyKm: 7_900,  rank: 5,  rankDelta: 0,  monthlyKmDelta: 540,   michelinEquipmentPct: 47, badges: [] },
  { id: 'c06', name: 'Brest Iroise Cyclisme',          region: 'Bretagne',         department: 'Finistère',         memberCount: 203, totalKm: 54_200, monthlyKm: 14_100, rank: 1,  rankDelta: 0,  monthlyKmDelta: 2_100, michelinEquipmentPct: 58, badges: [] },
  { id: 'c07', name: 'Quimper Vélo',                   region: 'Bretagne',         department: 'Finistère',         memberCount: 167, totalKm: 48_900, monthlyKm: 11_200, rank: 2,  rankDelta: 1,  monthlyKmDelta: 1_400, michelinEquipmentPct: 45, badges: [] },
  { id: 'c08', name: 'Vannes Cyclisme Compétition',    region: 'Bretagne',         department: 'Morbihan',          memberCount: 134, totalKm: 41_300, monthlyKm: 10_400, rank: 3,  rankDelta: -1, monthlyKmDelta: 890,   michelinEquipmentPct: 62, badges: [] },
  { id: 'c09', name: 'Paris Cycles Club',              region: 'Île-de-France',    department: 'Paris',             memberCount: 312, totalKm: 89_400, monthlyKm: 22_100, rank: 1,  rankDelta: 0,  monthlyKmDelta: 3_400, michelinEquipmentPct: 41, badges: [] },
  { id: 'c10', name: 'Versailles Vélo Sprint',         region: 'Île-de-France',    department: 'Yvelines',          memberCount: 278, totalKm: 78_600, monthlyKm: 18_900, rank: 2,  rankDelta: 2,  monthlyKmDelta: 2_800, michelinEquipmentPct: 35, badges: [] },
  { id: 'c11', name: 'Seine-et-Marne Cyclo',          region: 'Île-de-France',    department: 'Seine-et-Marne',    memberCount: 198, totalKm: 62_100, monthlyKm: 14_800, rank: 3,  rankDelta: -1, monthlyKmDelta: 1_900, michelinEquipmentPct: 38, badges: [] },
  { id: 'c12', name: 'Lyon Métropole Cyclisme',        region: 'Auvergne-Rhône-Alpes', department: 'Rhône',         memberCount: 241, totalKm: 71_300, monthlyKm: 17_200, rank: 1,  rankDelta: 0,  monthlyKmDelta: 2_600, michelinEquipmentPct: 55, badges: [] },
  { id: 'c13', name: 'Grenoble Alpes Vélo',            region: 'Auvergne-Rhône-Alpes', department: 'Isère',         memberCount: 189, totalKm: 65_800, monthlyKm: 15_400, rank: 2,  rankDelta: 0,  monthlyKmDelta: 2_100, michelinEquipmentPct: 63, badges: [] },
  { id: 'c14', name: 'Clermont Cyclo Passion',         region: 'Auvergne-Rhône-Alpes', department: 'Puy-de-Dôme',  memberCount: 156, totalKm: 58_400, monthlyKm: 12_900, rank: 3,  rankDelta: 1,  monthlyKmDelta: 1_700, michelinEquipmentPct: 77, badges: [] },
  { id: 'c15', name: 'Bordeaux Gironde Vélo',          region: 'Nouvelle-Aquitaine', department: 'Gironde',         memberCount: 224, totalKm: 67_200, monthlyKm: 16_800, rank: 1,  rankDelta: 0,  monthlyKmDelta: 2_400, michelinEquipmentPct: 52, badges: [] },
  { id: 'c16', name: 'Bayonne Côte Basque Cyclisme',   region: 'Nouvelle-Aquitaine', department: 'Pyrénées-Atlantiques', memberCount: 178, totalKm: 59_100, monthlyKm: 14_100, rank: 2, rankDelta: 2, monthlyKmDelta: 1_800, michelinEquipmentPct: 48, badges: [] },
  { id: 'c17', name: 'Pau Cyclisme',                   region: 'Nouvelle-Aquitaine', department: 'Pyrénées-Atlantiques', memberCount: 145, totalKm: 51_300, monthlyKm: 11_700, rank: 3, rankDelta: -1, monthlyKmDelta: 1_200, michelinEquipmentPct: 56, badges: [] },
  { id: 'c18', name: 'Marseille Vélo Passion',         region: 'PACA',             department: 'Bouches-du-Rhône',  memberCount: 267, totalKm: 73_900, monthlyKm: 18_400, rank: 1,  rankDelta: 0,  monthlyKmDelta: 2_800, michelinEquipmentPct: 39, badges: [] },
  { id: 'c19', name: 'Nice Côte d\'Azur Cyclisme',    region: 'PACA',             department: 'Alpes-Maritimes',   memberCount: 198, totalKm: 69_200, monthlyKm: 16_800, rank: 2,  rankDelta: 1,  monthlyKmDelta: 2_200, michelinEquipmentPct: 44, badges: [] },
  { id: 'c20', name: 'Toulon Var Vélo Club',           region: 'PACA',             department: 'Var',               memberCount: 156, totalKm: 54_100, monthlyKm: 12_900, rank: 3,  rankDelta: 0,  monthlyKmDelta: 1_500, michelinEquipmentPct: 41, badges: [] },
  { id: 'c21', name: 'Toulouse Cyclisme Occitan',      region: 'Occitanie',        department: 'Haute-Garonne',     memberCount: 289, totalKm: 82_400, monthlyKm: 19_800, rank: 1,  rankDelta: 0,  monthlyKmDelta: 3_100, michelinEquipmentPct: 50, badges: [] },
  { id: 'c22', name: 'Montpellier Hérault Vélo',       region: 'Occitanie',        department: 'Hérault',           memberCount: 234, totalKm: 71_200, monthlyKm: 16_400, rank: 2,  rankDelta: 0,  monthlyKmDelta: 2_300, michelinEquipmentPct: 43, badges: [] },
  { id: 'c23', name: 'Nîmes Cévennes Cyclisme',        region: 'Occitanie',        department: 'Gard',              memberCount: 167, totalKm: 58_900, monthlyKm: 13_200, rank: 3,  rankDelta: 2,  monthlyKmDelta: 1_800, michelinEquipmentPct: 37, badges: [] },
  { id: 'c24', name: 'Strasbourg Alsace Cyclisme',     region: 'Grand Est',        department: 'Bas-Rhin',          memberCount: 201, totalKm: 64_800, monthlyKm: 15_900, rank: 1,  rankDelta: 0,  monthlyKmDelta: 2_100, michelinEquipmentPct: 33, badges: [] },
  { id: 'c25', name: 'Mulhouse Vélo Sport',            region: 'Grand Est',        department: 'Haut-Rhin',         memberCount: 178, totalKm: 57_400, monthlyKm: 13_800, rank: 2,  rankDelta: -1, monthlyKmDelta: 1_600, michelinEquipmentPct: 29, badges: [] },
  { id: 'c26', name: 'Metz Grand Est Cyclisme',        region: 'Grand Est',        department: 'Moselle',           memberCount: 145, totalKm: 48_900, monthlyKm: 11_200, rank: 3,  rankDelta: 1,  monthlyKmDelta: 1_100, michelinEquipmentPct: 31, badges: [] },
  { id: 'c27', name: 'Lille Métropole Cyclisme',       region: 'Hauts-de-France',  department: 'Nord',              memberCount: 256, totalKm: 72_100, monthlyKm: 17_400, rank: 1,  rankDelta: 0,  monthlyKmDelta: 2_500, michelinEquipmentPct: 36, badges: [] },
  { id: 'c28', name: 'Amiens Picardie Vélo',           region: 'Hauts-de-France',  department: 'Somme',             memberCount: 189, totalKm: 58_700, monthlyKm: 13_400, rank: 2,  rankDelta: 0,  monthlyKmDelta: 1_700, michelinEquipmentPct: 28, badges: [] },
  { id: 'c29', name: 'Rouen Normandie Cyclisme',       region: 'Normandie',        department: 'Seine-Maritime',    memberCount: 178, totalKm: 55_200, monthlyKm: 12_800, rank: 1,  rankDelta: 1,  monthlyKmDelta: 1_600, michelinEquipmentPct: 32, badges: [] },
  { id: 'c30', name: 'Caen Calvados Vélo',             region: 'Normandie',        department: 'Calvados',          memberCount: 145, totalKm: 46_400, monthlyKm: 10_900, rank: 2,  rankDelta: -1, monthlyKmDelta: 1_200, michelinEquipmentPct: 27, badges: [] },
  { id: 'c31', name: 'Dijon Bourgogne Cyclisme',       region: 'Bourgogne-FC',     department: 'Côte-d\'Or',        memberCount: 167, totalKm: 52_100, monthlyKm: 12_100, rank: 1,  rankDelta: 0,  monthlyKmDelta: 1_500, michelinEquipmentPct: 41, badges: [] },
  { id: 'c32', name: 'Besançon Doubs Cyclisme',        region: 'Bourgogne-FC',     department: 'Doubs',             memberCount: 134, totalKm: 43_800, monthlyKm: 10_200, rank: 2,  rankDelta: 2,  monthlyKmDelta: 1_100, michelinEquipmentPct: 38, badges: [] },
  { id: 'c33', name: 'Nantes Ouest Cyclisme',          region: 'Pays de la Loire', department: 'Loire-Atlantique',  memberCount: 118, totalKm: 28_400, monthlyKm: 7_100,  rank: 6,  rankDelta: 1,  monthlyKmDelta: 480,   michelinEquipmentPct: 65, badges: [] },
  { id: 'c34', name: 'Angers Cyclisme Loisirs',        region: 'Pays de la Loire', department: 'Maine-et-Loire',    memberCount: 102, totalKm: 24_800, monthlyKm: 6_200,  rank: 7,  rankDelta: -2, monthlyKmDelta: 320,   michelinEquipmentPct: 59, badges: [] },
  { id: 'c35', name: 'La Roche-sur-Yon Vélo',          region: 'Pays de la Loire', department: 'Vendée',            memberCount: 89,  totalKm: 21_200, monthlyKm: 5_400,  rank: 8,  rankDelta: 0,  monthlyKmDelta: 280,   michelinEquipmentPct: 44, badges: [] },
  { id: 'c36', name: 'Saint-Nazaire Cyclisme Côtier',  region: 'Pays de la Loire', department: 'Loire-Atlantique',  memberCount: 76,  totalKm: 18_900, monthlyKm: 4_800,  rank: 9,  rankDelta: 1,  monthlyKmDelta: 210,   michelinEquipmentPct: 55, badges: [] },
  { id: 'c37', name: 'Tours Val de Loire Cyclisme',    region: 'Centre-Val de Loire', department: 'Indre-et-Loire', memberCount: 198, totalKm: 61_400, monthlyKm: 14_200, rank: 1,  rankDelta: 0,  monthlyKmDelta: 2_000, michelinEquipmentPct: 49, badges: [] },
  { id: 'c38', name: 'Orléans Loiret Vélo Sport',      region: 'Centre-Val de Loire', department: 'Loiret',         memberCount: 167, totalKm: 52_800, monthlyKm: 12_100, rank: 2,  rankDelta: 1,  monthlyKmDelta: 1_500, michelinEquipmentPct: 42, badges: [] },
  { id: 'c39', name: 'Biarritz Côte Basque Cycling',   region: 'Nouvelle-Aquitaine', department: 'Pyrénées-Atlantiques', memberCount: 124, totalKm: 45_900, monthlyKm: 10_800, rank: 4, rankDelta: 0, monthlyKmDelta: 1_100, michelinEquipmentPct: 61, badges: [] },
  { id: 'c40', name: 'Nantes Triathlon & Vélo',        region: 'Pays de la Loire', department: 'Loire-Atlantique',  memberCount: 89,  totalKm: 16_200, monthlyKm: 4_100,  rank: 10, rankDelta: 2,  monthlyKmDelta: 190,   michelinEquipmentPct: 52, badges: [] },
  { id: 'c41', name: 'Reims Grand-Est Cycling',        region: 'Grand Est',        department: 'Marne',             memberCount: 134, totalKm: 42_100, monthlyKm: 9_800,  rank: 4,  rankDelta: -1, monthlyKmDelta: 900,   michelinEquipmentPct: 26, badges: [] },
  { id: 'c42', name: 'Nancy Lorraine Vélo Club',       region: 'Grand Est',        department: 'Meurthe-et-Moselle', memberCount: 112, totalKm: 36_800, monthlyKm: 8_600, rank: 5,  rankDelta: 0,  monthlyKmDelta: 780,   michelinEquipmentPct: 24, badges: [] },
  { id: 'c43', name: 'Perpignan Roussillon Cyclisme',  region: 'Occitanie',        department: 'Pyrénées-Orientales', memberCount: 134, totalKm: 49_800, monthlyKm: 11_200, rank: 4, rankDelta: 1, monthlyKmDelta: 1_200, michelinEquipmentPct: 35, badges: [] },
  { id: 'c44', name: 'Béziers Hérault Vélo',           region: 'Occitanie',        department: 'Hérault',           memberCount: 112, totalKm: 41_200, monthlyKm: 9_400,  rank: 5,  rankDelta: -2, monthlyKmDelta: 820,   michelinEquipmentPct: 30, badges: [] },
  { id: 'c45', name: 'Annecy Haute-Savoie Cyclisme',   region: 'Auvergne-Rhône-Alpes', department: 'Haute-Savoie', memberCount: 156, totalKm: 58_200, monthlyKm: 13_100, rank: 4,  rankDelta: 2,  monthlyKmDelta: 1_600, michelinEquipmentPct: 68, badges: [] },
  { id: 'c46', name: 'Chambéry Savoie Vélo',           region: 'Auvergne-Rhône-Alpes', department: 'Savoie',       memberCount: 134, totalKm: 51_400, monthlyKm: 11_800, rank: 5,  rankDelta: 0,  monthlyKmDelta: 1_300, michelinEquipmentPct: 72, badges: [] },
  { id: 'c47', name: 'Auxerre Bourgogne Cyclisme',     region: 'Bourgogne-FC',     department: 'Yonne',             memberCount: 98,  totalKm: 32_100, monthlyKm: 7_600,  rank: 3,  rankDelta: 1,  monthlyKmDelta: 780,   michelinEquipmentPct: 35, badges: [] },
  { id: 'c48', name: 'Limoges Haute-Vienne Vélo',      region: 'Nouvelle-Aquitaine', department: 'Haute-Vienne',    memberCount: 112, totalKm: 38_400, monthlyKm: 8_900,  rank: 5,  rankDelta: -1, monthlyKmDelta: 840,   michelinEquipmentPct: 53, badges: [] },
  { id: 'c49', name: 'Poitiers Vienne Cyclisme',       region: 'Nouvelle-Aquitaine', department: 'Vienne',          memberCount: 98,  totalKm: 33_800, monthlyKm: 7_800,  rank: 6,  rankDelta: 0,  monthlyKmDelta: 680,   michelinEquipmentPct: 46, badges: [] },
  { id: 'c50', name: 'La Rochelle Charente-Maritime',  region: 'Nouvelle-Aquitaine', department: 'Charente-Maritime', memberCount: 134, totalKm: 44_200, monthlyKm: 10_100, rank: 7, rankDelta: 3, monthlyKmDelta: 1_100, michelinEquipmentPct: 58, badges: [] },
];

const NATIONAL_LEADERBOARD: RaceResult[] = [
  { rank: 1,   riderName: 'Alexandre Moreau',     club: 'Paris Cycles Club',           region: 'Île-de-France',          totalKm: 18_420, mpiScore: 978, level: 'Élite',             michelinUser: true  },
  { rank: 2,   riderName: 'Théo Blanchard',        club: 'Brest Iroise Cyclisme',       region: 'Bretagne',               totalKm: 17_840, mpiScore: 971, level: 'Élite',             michelinUser: true  },
  { rank: 3,   riderName: 'Julien Fontaine',       club: 'Grenoble Alpes Vélo',         region: 'Auvergne-Rhône-Alpes',   totalKm: 17_230, mpiScore: 965, level: 'Élite',             michelinUser: true  },
  { rank: 4,   riderName: 'Maxime Renard',         club: 'Lyon Métropole Cyclisme',     region: 'Auvergne-Rhône-Alpes',   totalKm: 16_890, mpiScore: 958, level: 'Élite',             michelinUser: false },
  { rank: 5,   riderName: 'Romain Lejeune',        club: 'Toulouse Cyclisme Occitan',   region: 'Occitanie',              totalKm: 16_540, mpiScore: 951, level: 'Élite',             michelinUser: true  },
  { rank: 6,   riderName: 'Kevin Brulé',           club: 'Bordeaux Gironde Vélo',       region: 'Nouvelle-Aquitaine',     totalKm: 16_120, mpiScore: 944, level: 'Élite',             michelinUser: true  },
  { rank: 7,   riderName: 'Nicolas Vaillant',      club: 'Versailles Vélo Sprint',      region: 'Île-de-France',          totalKm: 15_890, mpiScore: 937, level: 'Compétiteur Expert', michelinUser: false },
  { rank: 8,   riderName: 'Thomas Laurent',        club: 'Nice Côte d\'Azur Cyclisme',  region: 'PACA',                   totalKm: 15_620, mpiScore: 930, level: 'Compétiteur Expert', michelinUser: true  },
  { rank: 9,   riderName: 'Lucas Bernard',         club: 'Biarritz Côte Basque Cycling', region: 'Nouvelle-Aquitaine',   totalKm: 15_340, mpiScore: 924, level: 'Compétiteur Expert', michelinUser: true  },
  { rank: 10,  riderName: 'Antoine Duval',         club: 'Rennes Cyclo Performance',    region: 'Bretagne',               totalKm: 15_100, mpiScore: 917, level: 'Compétiteur Expert', michelinUser: false },
  { rank: 11,  riderName: 'Florian Garnier',       club: 'Marseille Vélo Passion',      region: 'PACA',                   totalKm: 14_820, mpiScore: 910, level: 'Compétiteur Expert', michelinUser: true  },
  { rank: 12,  riderName: 'Damien Rousseau',       club: 'Strasbourg Alsace Cyclisme',  region: 'Grand Est',              totalKm: 14_600, mpiScore: 903, level: 'Compétiteur Expert', michelinUser: false },
  { rank: 13,  riderName: 'Pierre-Antoine Morin',  club: 'Lille Métropole Cyclisme',    region: 'Hauts-de-France',        totalKm: 14_380, mpiScore: 897, level: 'Compétiteur Expert', michelinUser: false },
  { rank: 14,  riderName: 'Adrien Leclercq',       club: 'Quimper Vélo',                region: 'Bretagne',               totalKm: 14_120, mpiScore: 890, level: 'Compétiteur Expert', michelinUser: true  },
  { rank: 15,  riderName: 'Sébastien Petit',       club: 'Annecy Haute-Savoie Cyclisme', region: 'Auvergne-Rhône-Alpes', totalKm: 13_900, mpiScore: 882, level: 'Compétiteur Expert', michelinUser: true  },
  { rank: 16,  riderName: 'Christophe Muller',     club: 'Chambéry Savoie Vélo',        region: 'Auvergne-Rhône-Alpes',   totalKm: 13_680, mpiScore: 875, level: 'Compétiteur Expert', michelinUser: true  },
  { rank: 17,  riderName: 'Guillaume Faure',       club: 'Montpellier Hérault Vélo',    region: 'Occitanie',              totalKm: 13_420, mpiScore: 868, level: 'Compétiteur Expert', michelinUser: false },
  { rank: 18,  riderName: 'Vincent Arnaud',        club: 'Tours Val de Loire Cyclisme', region: 'Centre-Val de Loire',    totalKm: 13_200, mpiScore: 862, level: 'Expert',             michelinUser: true  },
  { rank: 19,  riderName: 'Benoît Mercier',        club: 'Bayonne Côte Basque Cyclisme', region: 'Nouvelle-Aquitaine',    totalKm: 12_980, mpiScore: 855, level: 'Expert',             michelinUser: true  },
  { rank: 20,  riderName: 'Stéphane Collet',       club: 'Rouen Normandie Cyclisme',    region: 'Normandie',              totalKm: 12_760, mpiScore: 847, level: 'Expert',             michelinUser: false },
  { rank: 21,  riderName: 'François Bertin',       club: 'Nîmes Cévennes Cyclisme',     region: 'Occitanie',              totalKm: 12_540, mpiScore: 840, level: 'Expert',             michelinUser: true  },
  { rank: 22,  riderName: 'Mathieu Simonin',       club: 'Vannes Cyclisme Compétition', region: 'Bretagne',               totalKm: 12_320, mpiScore: 834, level: 'Expert',             michelinUser: false },
  { rank: 23,  riderName: 'Rémi Charpentier',      club: 'Dijon Bourgogne Cyclisme',    region: 'Bourgogne-FC',           totalKm: 12_100, mpiScore: 827, level: 'Expert',             michelinUser: true  },
  { rank: 24,  riderName: 'Olivier Masson',        club: 'Clermont Cyclo Passion',      region: 'Auvergne-Rhône-Alpes',   totalKm: 11_890, mpiScore: 820, level: 'Expert',             michelinUser: true  },
  { rank: 25,  riderName: 'Laurent Bonnet',        club: 'Pau Cyclisme',                region: 'Nouvelle-Aquitaine',     totalKm: 11_680, mpiScore: 812, level: 'Expert',             michelinUser: true  },
  { rank: 26,  riderName: 'Samuel Lefebvre',       club: 'Amiens Picardie Vélo',        region: 'Hauts-de-France',        totalKm: 11_460, mpiScore: 805, level: 'Expert',             michelinUser: false },
  { rank: 27,  riderName: 'Anthony Peltier',       club: 'Seine-et-Marne Cyclo',        region: 'Île-de-France',          totalKm: 11_240, mpiScore: 798, level: 'Expert',             michelinUser: false },
  { rank: 28,  riderName: 'Camille Dubreuil',      club: 'Club Cyclotouriste Nantais',  region: 'Pays de la Loire',       totalKm: 11_020, mpiScore: 742, level: 'Compétiteur Expert', michelinUser: true  },
  { rank: 29,  riderName: 'Corentin Jacquet',      club: 'Orléans Loiret Vélo Sport',   region: 'Centre-Val de Loire',    totalKm: 10_800, mpiScore: 784, level: 'Expert',             michelinUser: true  },
  { rank: 30,  riderName: 'Thierry Renaud',        club: 'Perpignan Roussillon Cyclisme', region: 'Occitanie',            totalKm: 10_580, mpiScore: 777, level: 'Expert',             michelinUser: false },
  { rank: 31,  riderName: 'David Martin',          club: 'Toulon Var Vélo Club',         region: 'PACA',                  totalKm: 10_360, mpiScore: 770, level: 'Expert',             michelinUser: true  },
  { rank: 32,  riderName: 'Luc Tissot',            club: 'Besançon Doubs Cyclisme',     region: 'Bourgogne-FC',           totalKm: 10_140, mpiScore: 763, level: 'Expert',             michelinUser: true  },
  { rank: 33,  riderName: 'Cyril Barbier',         club: 'Limoges Haute-Vienne Vélo',   region: 'Nouvelle-Aquitaine',     totalKm: 9_920,  mpiScore: 756, level: 'Expert',             michelinUser: false },
  { rank: 34,  riderName: 'Patrice Gallet',        club: 'Caen Calvados Vélo',          region: 'Normandie',              totalKm: 9_700,  mpiScore: 749, level: 'Expert',             michelinUser: false },
  { rank: 35,  riderName: 'Jean-Marc Brun',        club: 'Reims Grand-Est Cycling',     region: 'Grand Est',              totalKm: 9_480,  mpiScore: 741, level: 'Expert',             michelinUser: false },
  { rank: 36,  riderName: 'Marc Perrin',           club: 'Béziers Hérault Vélo',        region: 'Occitanie',              totalKm: 9_260,  mpiScore: 734, level: 'Passionné',           michelinUser: false },
  { rank: 37,  riderName: 'Denis Poirier',         club: 'Poitiers Vienne Cyclisme',    region: 'Nouvelle-Aquitaine',     totalKm: 9_040,  mpiScore: 727, level: 'Passionné',           michelinUser: true  },
  { rank: 38,  riderName: 'Bruno Girard',          club: 'Metz Grand Est Cyclisme',     region: 'Grand Est',              totalKm: 8_820,  mpiScore: 720, level: 'Passionné',           michelinUser: false },
  { rank: 39,  riderName: 'Eric Chauveau',         club: 'Nancy Lorraine Vélo Club',    region: 'Grand Est',              totalKm: 8_600,  mpiScore: 712, level: 'Passionné',           michelinUser: false },
  { rank: 40,  riderName: 'Pascal Vidal',          club: 'Auxerre Bourgogne Cyclisme',  region: 'Bourgogne-FC',           totalKm: 8_380,  mpiScore: 705, level: 'Passionné',           michelinUser: true  },
  { rank: 41,  riderName: 'Gilles Lemoine',        club: 'La Rochelle Charente-Maritime', region: 'Nouvelle-Aquitaine',   totalKm: 8_160,  mpiScore: 698, level: 'Passionné',           michelinUser: true  },
  { rank: 42,  riderName: 'Jean-Luc Picard',       club: 'Nantes Triathlon & Vélo',     region: 'Pays de la Loire',       totalKm: 7_940,  mpiScore: 690, level: 'Passionné',           michelinUser: true  },
  { rank: 43,  riderName: 'Henri Gautier',         club: 'Mulhouse Vélo Sport',         region: 'Grand Est',              totalKm: 7_720,  mpiScore: 683, level: 'Passionné',           michelinUser: false },
  { rank: 44,  riderName: 'Alain Dupuis',          club: 'La Roche-sur-Yon Vélo',       region: 'Pays de la Loire',       totalKm: 7_500,  mpiScore: 676, level: 'Passionné',           michelinUser: false },
  { rank: 45,  riderName: 'Claude Marchand',       club: 'Saint-Nazaire Cyclisme Côtier', region: 'Pays de la Loire',     totalKm: 7_280,  mpiScore: 668, level: 'Passionné',           michelinUser: true  },
  { rank: 46,  riderName: 'Roger Simon',           club: 'Angers Cyclisme Loisirs',     region: 'Pays de la Loire',       totalKm: 7_060,  mpiScore: 661, level: 'Passionné',           michelinUser: true  },
  { rank: 47,  riderName: 'Michel Lambert',        club: 'Nantes Ouest Cyclisme',       region: 'Pays de la Loire',       totalKm: 6_840,  mpiScore: 654, level: 'Intermédiaire',      michelinUser: false },
  { rank: 48,  riderName: 'Paul Richard',          club: 'Les Mouettes du Croisic',     region: 'Pays de la Loire',       totalKm: 6_620,  mpiScore: 646, level: 'Intermédiaire',      michelinUser: true  },
  { rank: 49,  riderName: 'Jacques Fortin',        club: 'Vendée Cycle Sport',          region: 'Pays de la Loire',       totalKm: 6_400,  mpiScore: 639, level: 'Intermédiaire',      michelinUser: false },
  { rank: 50,  riderName: 'Pierre Legrand',        club: 'Vélo Club Angevin',           region: 'Pays de la Loire',       totalKm: 6_180,  mpiScore: 631, level: 'Intermédiaire',      michelinUser: true  },
  { rank: 51,  riderName: 'François Dumont',       club: 'Rennes Cyclo Performance',    region: 'Bretagne',               totalKm: 5_960,  mpiScore: 624, level: 'Intermédiaire',      michelinUser: false },
  { rank: 52,  riderName: 'Stéphanie Moreau',      club: 'Grenoble Alpes Vélo',         region: 'Auvergne-Rhône-Alpes',   totalKm: 5_740,  mpiScore: 616, level: 'Intermédiaire',      michelinUser: true  },
  { rank: 53,  riderName: 'Isabelle Garnier',      club: 'Lyon Métropole Cyclisme',     region: 'Auvergne-Rhône-Alpes',   totalKm: 5_520,  mpiScore: 609, level: 'Intermédiaire',      michelinUser: true  },
  { rank: 54,  riderName: 'Nathalie Petit',        club: 'Toulouse Cyclisme Occitan',   region: 'Occitanie',              totalKm: 5_300,  mpiScore: 601, level: 'Intermédiaire',      michelinUser: false },
  { rank: 55,  riderName: 'Sophie Lecomte',        club: 'Bordeaux Gironde Vélo',       region: 'Nouvelle-Aquitaine',     totalKm: 5_080,  mpiScore: 594, level: 'Intermédiaire',      michelinUser: true  },
];

@Injectable({ providedIn: 'root' })
export class ClubService {
  getAllClubs(): Observable<Club[]> {
    return of(CLUBS).pipe(delay(200));
  }

  getMyClub(): Observable<Club> {
    return of(CLUBS.find(c => c.id === 'c03')!).pipe(delay(100));
  }

  getRanking(scale: RankingScale = 'regional', region?: string): Observable<Club[]> {
    let filtered = [...CLUBS];
    if (scale === 'regional' && region) {
      filtered = filtered.filter(c => c.region === region);
    } else if (scale === 'regional') {
      filtered = filtered.filter(c => c.region === 'Pays de la Loire');
    }
    return of(filtered.sort((a, b) => a.rank - b.rank).slice(0, 20)).pipe(delay(200));
  }

  getNationalLeaderboard(): Observable<RaceResult[]> {
    return of(NATIONAL_LEADERBOARD).pipe(delay(250));
  }

  getRegionalLeaderboard(region: string): Observable<RaceResult[]> {
    return of(NATIONAL_LEADERBOARD.filter(r => r.region === region)).pipe(delay(200));
  }
}
