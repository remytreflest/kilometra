const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const BADGES_DATA = [
  { label: '1 000 km', icon: '🚴', color: 'bronze' },
  { label: '5 000 km', icon: '⭐', color: 'silver' },
  { label: '10 000 km', icon: '🏆', color: 'gold' },
  { label: 'Premier Podium', icon: '🥇', color: 'gold' },
  { label: 'Testeur Officiel', icon: '🔬', color: 'blue' },
  { label: 'Membre Club', icon: '👥', color: 'green' },
  { label: 'Expert Gravel', icon: '🌍', color: 'brown' },
  { label: 'Sprinter Élite', icon: '⚡', color: 'yellow' },
];

const CLUBS_DATA = [
  { name: 'Vélo Club de Paris', region: 'Île-de-France', department: '75', memberCount: 142, totalKm: 892450, monthlyKm: 18400, monthlyKmDelta: 3.2, rank: 1, rankDelta: 2, michelinEquipmentPct: 87 },
  { name: 'AS Cycliste Lyonnaise', region: 'Auvergne-Rhône-Alpes', department: '69', memberCount: 98, totalKm: 674200, monthlyKm: 12800, monthlyKmDelta: 5.1, rank: 2, rankDelta: 0, michelinEquipmentPct: 79 },
  { name: 'Roue Libre Marseillaise', region: 'PACA', department: '13', memberCount: 115, totalKm: 612000, monthlyKm: 14200, monthlyKmDelta: -1.5, rank: 3, rankDelta: -1, michelinEquipmentPct: 65 },
  { name: 'Pédale Bordelaise', region: 'Nouvelle-Aquitaine', department: '33', memberCount: 87, totalKm: 548300, monthlyKm: 10900, monthlyKmDelta: 8.3, rank: 4, rankDelta: 3, michelinEquipmentPct: 72 },
  { name: 'Vélo Sport Toulousain', region: 'Occitanie', department: '31', memberCount: 76, totalKm: 487600, monthlyKm: 9800, monthlyKmDelta: 2.1, rank: 5, rankDelta: -2, michelinEquipmentPct: 58 },
  { name: 'Club Cycliste Breton', region: 'Bretagne', department: '35', memberCount: 64, totalKm: 421000, monthlyKm: 8600, monthlyKmDelta: 4.7, rank: 6, rankDelta: 1, michelinEquipmentPct: 83 },
  { name: 'Pédale Strasbourgeoise', region: 'Grand Est', department: '67', memberCount: 92, totalKm: 398700, monthlyKm: 11200, monthlyKmDelta: 6.2, rank: 7, rankDelta: 0, michelinEquipmentPct: 91 },
  { name: 'Vélo Club Lillois', region: 'Hauts-de-France', department: '59', memberCount: 55, totalKm: 342100, monthlyKm: 7400, monthlyKmDelta: -0.8, rank: 8, rankDelta: -3, michelinEquipmentPct: 47 },
  { name: 'AS Niçoise Cyclisme', region: 'PACA', department: '06', memberCount: 103, totalKm: 618400, monthlyKm: 13900, monthlyKmDelta: 1.9, rank: 9, rankDelta: 2, michelinEquipmentPct: 76 },
  { name: 'Grenoble Vélo Alpin', region: 'Auvergne-Rhône-Alpes', department: '38', memberCount: 81, totalKm: 724500, monthlyKm: 15600, monthlyKmDelta: 9.4, rank: 10, rankDelta: 5, michelinEquipmentPct: 88 },
  { name: 'Nantes Cycle Sport', region: 'Pays de la Loire', department: '44', memberCount: 69, totalKm: 301200, monthlyKm: 6800, monthlyKmDelta: 3.5, rank: 11, rankDelta: -1, michelinEquipmentPct: 62 },
  { name: 'Rouen Vélo Normand', region: 'Normandie', department: '76', memberCount: 47, totalKm: 218900, monthlyKm: 4900, monthlyKmDelta: 1.2, rank: 12, rankDelta: 0, michelinEquipmentPct: 55 },
  { name: 'Cyclistes du Massif Central', region: 'Auvergne-Rhône-Alpes', department: '63', memberCount: 38, totalKm: 289400, monthlyKm: 8200, monthlyKmDelta: 12.1, rank: 13, rankDelta: 8, michelinEquipmentPct: 70 },
  { name: 'Pédale Basque', region: 'Nouvelle-Aquitaine', department: '64', memberCount: 72, totalKm: 534600, monthlyKm: 11800, monthlyKmDelta: 4.3, rank: 14, rankDelta: -2, michelinEquipmentPct: 67 },
  { name: 'Montpellier Vélo Club', region: 'Occitanie', department: '34', memberCount: 58, totalKm: 276800, monthlyKm: 6200, monthlyKmDelta: -2.1, rank: 15, rankDelta: -4, michelinEquipmentPct: 44 },
  // Generated clubs 16-50
  { name: 'Dijon Cyclo Sport', region: 'Bourgogne-Franche-Comté', department: '21', memberCount: 43, totalKm: 198300, monthlyKm: 4500, monthlyKmDelta: 1.8, rank: 16, rankDelta: 1, michelinEquipmentPct: 59 },
  { name: 'Rennes Pedal Club', region: 'Bretagne', department: '35', memberCount: 61, totalKm: 312400, monthlyKm: 7100, monthlyKmDelta: 3.6, rank: 17, rankDelta: 2, michelinEquipmentPct: 71 },
  { name: 'Amiens Cyclo Sport', region: 'Hauts-de-France', department: '80', memberCount: 34, totalKm: 145600, monthlyKm: 3200, monthlyKmDelta: 0.9, rank: 18, rankDelta: -1, michelinEquipmentPct: 38 },
  { name: 'Toulon Vélo Méditerranée', region: 'PACA', department: '83', memberCount: 79, totalKm: 421800, monthlyKm: 9400, monthlyKmDelta: 2.7, rank: 19, rankDelta: 3, michelinEquipmentPct: 73 },
  { name: 'Brest Atlantic Cyclists', region: 'Bretagne', department: '29', memberCount: 52, totalKm: 267900, monthlyKm: 5800, monthlyKmDelta: 4.1, rank: 20, rankDelta: 1, michelinEquipmentPct: 80 },
  { name: 'Tours Cycliste Club', region: 'Centre-Val de Loire', department: '37', memberCount: 45, totalKm: 187600, monthlyKm: 4100, monthlyKmDelta: -0.5, rank: 21, rankDelta: -2, michelinEquipmentPct: 53 },
  { name: 'Orléans Vélo Sport', region: 'Centre-Val de Loire', department: '45', memberCount: 38, totalKm: 156300, monthlyKm: 3400, monthlyKmDelta: 2.3, rank: 22, rankDelta: 0, michelinEquipmentPct: 48 },
  { name: 'Metz Cyclisme Club', region: 'Grand Est', department: '57', memberCount: 57, totalKm: 234700, monthlyKm: 5300, monthlyKmDelta: 1.6, rank: 23, rankDelta: -1, michelinEquipmentPct: 65 },
  { name: 'Angers Sport Cycliste', region: 'Pays de la Loire', department: '49', memberCount: 41, totalKm: 172400, monthlyKm: 3900, monthlyKmDelta: 3.2, rank: 24, rankDelta: 2, michelinEquipmentPct: 57 },
  { name: 'Caen Vélo Normand', region: 'Normandie', department: '14', memberCount: 33, totalKm: 134200, monthlyKm: 2900, monthlyKmDelta: 0.4, rank: 25, rankDelta: 0, michelinEquipmentPct: 42 },
  { name: 'Pau Cyclo Pyrénées', region: 'Nouvelle-Aquitaine', department: '64', memberCount: 65, totalKm: 478200, monthlyKm: 10400, monthlyKmDelta: 7.8, rank: 26, rankDelta: 4, michelinEquipmentPct: 82 },
  { name: 'Perpignan Vélo Catalan', region: 'Occitanie', department: '66', memberCount: 48, totalKm: 298600, monthlyKm: 6700, monthlyKmDelta: 2.9, rank: 27, rankDelta: 1, michelinEquipmentPct: 61 },
  { name: 'Clermont Vélo Club', region: 'Auvergne-Rhône-Alpes', department: '63', memberCount: 54, totalKm: 312800, monthlyKm: 7200, monthlyKmDelta: 5.4, rank: 28, rankDelta: 3, michelinEquipmentPct: 69 },
  { name: 'Reims Cyclo Sport', region: 'Grand Est', department: '51', memberCount: 42, totalKm: 178300, monthlyKm: 3800, monthlyKmDelta: 1.1, rank: 29, rankDelta: -1, michelinEquipmentPct: 52 },
  { name: 'Le Havre Cyclos', region: 'Normandie', department: '76', memberCount: 36, totalKm: 142700, monthlyKm: 3100, monthlyKmDelta: -1.2, rank: 30, rankDelta: -3, michelinEquipmentPct: 39 },
  { name: 'Villeurbanne Pédale', region: 'Auvergne-Rhône-Alpes', department: '69', memberCount: 67, totalKm: 387400, monthlyKm: 8900, monthlyKmDelta: 6.1, rank: 31, rankDelta: 2, michelinEquipmentPct: 74 },
  { name: 'Saint-Étienne Vélo Sport', region: 'Auvergne-Rhône-Alpes', department: '42', memberCount: 53, totalKm: 334600, monthlyKm: 7800, monthlyKmDelta: 4.8, rank: 32, rankDelta: 1, michelinEquipmentPct: 68 },
  { name: 'Touraine Cyclo Gravel', region: 'Centre-Val de Loire', department: '37', memberCount: 29, totalKm: 124800, monthlyKm: 3600, monthlyKmDelta: 8.9, rank: 33, rankDelta: 6, michelinEquipmentPct: 90 },
  { name: 'Limoges Cyclisme', region: 'Nouvelle-Aquitaine', department: '87', memberCount: 31, totalKm: 132400, monthlyKm: 2900, monthlyKmDelta: 0.7, rank: 34, rankDelta: -1, michelinEquipmentPct: 46 },
  { name: 'Besançon Vélo Club', region: 'Bourgogne-Franche-Comté', department: '25', memberCount: 44, totalKm: 219600, monthlyKm: 4800, monthlyKmDelta: 2.4, rank: 35, rankDelta: 0, michelinEquipmentPct: 63 },
  { name: 'Nîmes Cyclo Sport', region: 'Occitanie', department: '30', memberCount: 39, totalKm: 198400, monthlyKm: 4300, monthlyKmDelta: 1.8, rank: 36, rankDelta: 1, michelinEquipmentPct: 55 },
  { name: 'Chambéry Alpes Cyclisme', region: 'Auvergne-Rhône-Alpes', department: '73', memberCount: 71, totalKm: 612300, monthlyKm: 13400, monthlyKmDelta: 11.2, rank: 37, rankDelta: 7, michelinEquipmentPct: 86 },
  { name: 'Ajaccio Vélo Corse', region: 'Corse', department: '2A', memberCount: 28, totalKm: 187900, monthlyKm: 5100, monthlyKmDelta: 3.3, rank: 38, rankDelta: 2, michelinEquipmentPct: 54 },
  { name: 'Bayonne Pays Basque Cycle', region: 'Nouvelle-Aquitaine', department: '64', memberCount: 63, totalKm: 456700, monthlyKm: 10200, monthlyKmDelta: 5.6, rank: 39, rankDelta: -1, michelinEquipmentPct: 78 },
  { name: 'Montauban Cyclo Club', region: 'Occitanie', department: '82', memberCount: 26, totalKm: 112300, monthlyKm: 2400, monthlyKmDelta: 0.3, rank: 40, rankDelta: -2, michelinEquipmentPct: 35 },
  { name: 'Chartres Vélo Sport', region: 'Centre-Val de Loire', department: '28', memberCount: 32, totalKm: 138700, monthlyKm: 3000, monthlyKmDelta: 1.5, rank: 41, rankDelta: 0, michelinEquipmentPct: 49 },
  { name: 'Colmar Alsace Cycle', region: 'Grand Est', department: '68', memberCount: 58, totalKm: 278400, monthlyKm: 6400, monthlyKmDelta: 3.9, rank: 42, rankDelta: 2, michelinEquipmentPct: 75 },
  { name: 'Biarritz Surf & Cycle', region: 'Nouvelle-Aquitaine', department: '64', memberCount: 47, totalKm: 312600, monthlyKm: 7100, monthlyKmDelta: 6.7, rank: 43, rankDelta: 4, michelinEquipmentPct: 81 },
  { name: 'Arras Nord Cyclisme', region: 'Hauts-de-France', department: '62', memberCount: 39, totalKm: 167800, monthlyKm: 3700, monthlyKmDelta: -0.9, rank: 44, rankDelta: -3, michelinEquipmentPct: 43 },
  { name: 'Avignon Provence Cycle', region: 'PACA', department: '84', memberCount: 51, totalKm: 254300, monthlyKm: 5700, monthlyKmDelta: 2.2, rank: 45, rankDelta: 1, michelinEquipmentPct: 66 },
  { name: 'Belfort Territoire Cycle', region: 'Bourgogne-Franche-Comté', department: '90', memberCount: 27, totalKm: 108400, monthlyKm: 2300, monthlyKmDelta: 0.6, rank: 46, rankDelta: 0, michelinEquipmentPct: 37 },
  { name: 'Quimper Finistère Vélo', region: 'Bretagne', department: '29', memberCount: 46, totalKm: 234800, monthlyKm: 5400, monthlyKmDelta: 4.5, rank: 47, rankDelta: 3, michelinEquipmentPct: 72 },
  { name: 'Poitiers Vienne Cyclisme', region: 'Nouvelle-Aquitaine', department: '86', memberCount: 35, totalKm: 156900, monthlyKm: 3400, monthlyKmDelta: 1.4, rank: 48, rankDelta: -1, michelinEquipmentPct: 51 },
  { name: 'Lorient Morbihan Vélo', region: 'Bretagne', department: '56', memberCount: 43, totalKm: 212600, monthlyKm: 4700, monthlyKmDelta: 2.8, rank: 49, rankDelta: 1, michelinEquipmentPct: 64 },
  { name: 'Valenciennes Pédale du Nord', region: 'Hauts-de-France', department: '59', memberCount: 31, totalKm: 123400, monthlyKm: 2700, monthlyKmDelta: -1.8, rank: 50, rankDelta: -5, michelinEquipmentPct: 29 },
];

const CLUB_BADGES = [
  { id: 'b1', label: 'Club Michelin Partner', icon: '🏅', color: 'yellow', unlocked: true },
  { id: 'b2', label: 'Top 10 National', icon: '🏆', color: 'gold', unlocked: false },
  { id: 'b3', label: '100 Membres', icon: '👥', color: 'blue', unlocked: false },
  { id: 'b4', label: '500 000 km communauté', icon: '🚴', color: 'green', unlocked: true },
];

const TIRES_DATA = [
  {
    reference: 'POWER-CUP-2',
    name: 'Power Cup 2',
    brand: 'Michelin',
    category: 'competition',
    adhesion: 9.8,
    efficiency: 9.6,
    comfort: 7.2,
    punctureResistance: 7.5,
    durability: 7.0,
    avgScore: 9.4,
    communityKm: 2340000,
    punctureReductionPct: 24,
    recommendedFor: ['course', 'compétition', 'chrono'],
    priceEur: 89.90,
  },
  {
    reference: 'POWER-ROAD',
    name: 'Power Road',
    brand: 'Michelin',
    category: 'route',
    adhesion: 8.9,
    efficiency: 9.1,
    comfort: 7.8,
    punctureResistance: 8.2,
    durability: 8.5,
    avgScore: 8.5,
    communityKm: 4120000,
    punctureReductionPct: 31,
    recommendedFor: ['route', 'endurance', 'sportif'],
    priceEur: 59.90,
  },
  {
    reference: 'POWER-END-2',
    name: 'Power Endurance 2',
    brand: 'Michelin',
    category: 'endurance',
    adhesion: 8.1,
    efficiency: 8.4,
    comfort: 8.6,
    punctureResistance: 9.3,
    durability: 9.7,
    avgScore: 8.8,
    communityKm: 5680000,
    punctureReductionPct: 42,
    recommendedFor: ['endurance', 'longue distance', 'cyclosportive'],
    priceEur: 67.90,
  },
  {
    reference: 'POWER-ALL-SEASON',
    name: 'Power All Season',
    brand: 'Michelin',
    category: 'route',
    adhesion: 8.7,
    efficiency: 8.2,
    comfort: 8.4,
    punctureResistance: 8.9,
    durability: 9.1,
    avgScore: 8.6,
    communityKm: 3240000,
    punctureReductionPct: 38,
    recommendedFor: ['4 saisons', 'pluie', 'polyvalent'],
    priceEur: 72.90,
  },
  {
    reference: 'DYNAMIC-CLASSIC',
    name: 'Dynamic Classic',
    brand: 'Michelin',
    category: 'route',
    adhesion: 7.8,
    efficiency: 7.6,
    comfort: 8.8,
    punctureResistance: 8.4,
    durability: 9.0,
    avgScore: 7.9,
    communityKm: 2890000,
    punctureReductionPct: 28,
    recommendedFor: ['loisir', 'quotidien', 'débutant'],
    priceEur: 39.90,
  },
  {
    reference: 'PRO4-SERVICE',
    name: 'Pro4 Service Course',
    brand: 'Michelin',
    category: 'route',
    adhesion: 8.6,
    efficiency: 8.8,
    comfort: 7.9,
    punctureResistance: 8.1,
    durability: 8.2,
    avgScore: 8.3,
    communityKm: 3780000,
    punctureReductionPct: 33,
    recommendedFor: ['club', 'entraînement', 'compétition amateur'],
    priceEur: 49.90,
  },
  {
    reference: 'LITHION-3',
    name: 'Lithion 3',
    brand: 'Michelin',
    category: 'route',
    adhesion: 7.5,
    efficiency: 7.9,
    comfort: 8.5,
    punctureResistance: 8.0,
    durability: 8.8,
    avgScore: 7.6,
    communityKm: 1890000,
    punctureReductionPct: 22,
    recommendedFor: ['entrée de gamme', 'ville', 'loisir'],
    priceEur: 29.90,
  },
  {
    reference: 'POWER-GRAVEL',
    name: 'Power Gravel',
    brand: 'Michelin',
    category: 'gravel',
    adhesion: 9.2,
    efficiency: 8.3,
    comfort: 8.7,
    punctureResistance: 9.0,
    durability: 8.6,
    avgScore: 8.9,
    communityKm: 1240000,
    punctureReductionPct: 45,
    recommendedFor: ['gravel', 'mixte', 'aventure'],
    priceEur: 79.90,
  },
  {
    reference: 'COUNTRY-GRIPR',
    name: "Country Grip'r",
    brand: 'Michelin',
    category: 'gravel',
    adhesion: 9.5,
    efficiency: 7.8,
    comfort: 8.2,
    punctureResistance: 9.4,
    durability: 9.0,
    avgScore: 9.1,
    communityKm: 780000,
    punctureReductionPct: 52,
    recommendedFor: ['tout-terrain', 'montagne', 'trail'],
    priceEur: 74.90,
  },
  {
    reference: 'COUNTRY-AT2',
    name: 'Country AT2',
    brand: 'Michelin',
    category: 'gravel',
    adhesion: 8.8,
    efficiency: 8.0,
    comfort: 8.9,
    punctureResistance: 9.1,
    durability: 9.3,
    avgScore: 8.7,
    communityKm: 920000,
    punctureReductionPct: 47,
    recommendedFor: ['all-terrain', 'bikepacking', 'polyvalent hors route'],
    priceEur: 64.90,
  },
  {
    reference: 'POWER-COMP',
    name: 'Power Competition',
    brand: 'Michelin',
    category: 'competition',
    adhesion: 9.9,
    efficiency: 9.8,
    comfort: 6.8,
    punctureResistance: 7.0,
    durability: 6.5,
    avgScore: 9.7,
    communityKm: 890000,
    punctureReductionPct: 19,
    recommendedFor: ['course élite', 'contre-la-montre', 'critérium'],
    priceEur: 109.90,
  },
];

const DEALERS_DATA = [
  { name: 'Cycles Leblanc', address: '12 rue de Rivoli', city: 'Paris', postalCode: '75001', isOpen: true, openingTime: '09:00', closingTime: '19:00', acceptsCoupon: true, stockStatus: 'available', phone: '01 42 36 78 90', lat: 48.8566, lng: 2.3522 },
  { name: 'La Bicyclette Lyonnaise', address: '45 rue de la République', city: 'Lyon', postalCode: '69001', isOpen: true, openingTime: '09:30', closingTime: '18:30', acceptsCoupon: true, stockStatus: 'available', phone: '04 72 41 23 56', lat: 45.7640, lng: 4.8357 },
  { name: 'Vélo Pro Marseille', address: '8 boulevard Michelet', city: 'Marseille', postalCode: '13009', isOpen: false, openingTime: '10:00', closingTime: '19:00', acceptsCoupon: false, stockStatus: 'limited', phone: '04 91 78 34 12', lat: 43.2965, lng: 5.3698 },
  { name: 'Sport 2000 Toulouse', address: '23 rue du Taur', city: 'Toulouse', postalCode: '31000', isOpen: true, openingTime: '09:00', closingTime: '19:30', acceptsCoupon: true, stockStatus: 'available', phone: '05 61 22 89 45', lat: 43.6047, lng: 1.4442 },
  { name: 'Bordeaux Cycles', address: '67 cours Victor Hugo', city: 'Bordeaux', postalCode: '33000', isOpen: true, openingTime: '09:30', closingTime: '18:00', acceptsCoupon: false, stockStatus: 'limited', phone: '05 56 44 21 78', lat: 44.8378, lng: -0.5792 },
  { name: 'Brest Vélo Sport', address: '3 rue de Siam', city: 'Brest', postalCode: '29200', isOpen: false, openingTime: '09:00', closingTime: '18:00', acceptsCoupon: true, stockStatus: 'order', phone: '02 98 44 56 78', lat: 48.3904, lng: -4.4861 },
  { name: 'Cycle Alsace Strasbourg', address: '18 place Kléber', city: 'Strasbourg', postalCode: '67000', isOpen: true, openingTime: '09:00', closingTime: '19:00', acceptsCoupon: true, stockStatus: 'available', phone: '03 88 32 45 67', lat: 48.5734, lng: 7.7521 },
  { name: 'Grenoble Altitude Cycle', address: '55 rue Félix Viallet', city: 'Grenoble', postalCode: '38000', isOpen: true, openingTime: '09:30', closingTime: '19:00', acceptsCoupon: true, stockStatus: 'available', phone: '04 76 46 23 89', lat: 45.1885, lng: 5.7245 },
  { name: 'Nantes Deux Roues', address: '31 quai de la Fosse', city: 'Nantes', postalCode: '44000', isOpen: false, openingTime: '10:00', closingTime: '19:00', acceptsCoupon: false, stockStatus: 'available', phone: '02 40 74 32 56', lat: 47.2184, lng: -1.5536 },
  { name: 'Nice Côte d\'Azur Vélo', address: '7 avenue Jean Médecin', city: 'Nice', postalCode: '06000', isOpen: true, openingTime: '09:00', closingTime: '19:30', acceptsCoupon: true, stockStatus: 'limited', phone: '04 93 88 45 23', lat: 43.7102, lng: 7.2620 },
  { name: 'Rennes Cycle Club', address: '14 rue d\'Isly', city: 'Rennes', postalCode: '35000', isOpen: true, openingTime: '09:00', closingTime: '18:30', acceptsCoupon: true, stockStatus: 'available', phone: '02 99 31 45 67', lat: 48.1173, lng: -1.6778 },
  { name: 'Montpellier Vélo Expert', address: '22 rue de la Loge', city: 'Montpellier', postalCode: '34000', isOpen: true, openingTime: '09:30', closingTime: '19:00', acceptsCoupon: false, stockStatus: 'available', phone: '04 67 58 23 45', lat: 43.6119, lng: 3.8772 },
  { name: 'Clermont Sport Cycles', address: '9 place de Jaude', city: 'Clermont-Ferrand', postalCode: '63000', isOpen: false, openingTime: '09:00', closingTime: '18:00', acceptsCoupon: true, stockStatus: 'order', phone: '04 73 37 89 12', lat: 45.7774, lng: 3.0870 },
  { name: 'Dijon Cyclo Passion', address: '36 rue de la Liberté', city: 'Dijon', postalCode: '21000', isOpen: true, openingTime: '09:00', closingTime: '19:00', acceptsCoupon: true, stockStatus: 'limited', phone: '03 80 67 34 56', lat: 47.3220, lng: 5.0415 },
  { name: 'Pau Pyrénées Cycles', address: '5 boulevard des Pyrénées', city: 'Pau', postalCode: '64000', isOpen: true, openingTime: '09:30', closingTime: '18:30', acceptsCoupon: true, stockStatus: 'available', phone: '05 59 27 89 34', lat: 43.2951, lng: -0.3708 },
];

const ACTIVITY_TYPES = ['route', 'gravel', 'vtt', 'fractionné', 'sortie longue'];
const LOCATIONS = [
  'Alpes - Col du Galibier', 'Pyrénées - Col du Tourmalet', 'Massif Central - Puy de Dôme',
  'Bretagne - Finistère', 'Alsace - Route des vins', 'Provence - Luberon',
  'Normandie - Côte fleurie', 'Loire Valley', 'Gorges du Tarn', 'Cévennes',
  'Mercantour', 'Vosges - Route des crêtes', 'Auvergne - Sancy',
];

const ACTIVITY_NAMES = [
  'Sortie dominicale', 'Entraînement intervalles', 'Longue distance matinale',
  'Sortie club', 'Reconnaissance du col', 'Cyclosportive préparation',
  'Gravel aventure', 'Récupération active', 'Test de seuil', 'Montée chronométrée',
  'Sortie chargée bikepacking', 'Circuit des châteaux',
];

const USERS_DATA = [
  { firstName: 'Admin', lastName: 'Michelin', email: 'admin@michelin.fr', role: 'ADMIN', level: 'Élite', stravaConnected: true },
  { firstName: 'Responsable', lastName: 'Technique', email: 'tech@michelin.fr', role: 'ADMIN', level: 'Expert', stravaConnected: false },
  { firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@email.fr', role: 'USER', level: 'Expert', stravaConnected: true },
  { firstName: 'Marie', lastName: 'Lecomte', email: 'marie.lecomte@email.fr', role: 'USER', level: 'Élite', stravaConnected: true },
  { firstName: 'Pierre', lastName: 'Martin', email: 'pierre.martin@email.fr', role: 'USER', level: 'Compétiteur Expert', stravaConnected: false },
  { firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@email.fr', role: 'USER', level: 'Passionné', stravaConnected: true },
  { firstName: 'Lucas', lastName: 'Moreau', email: 'lucas.moreau@email.fr', role: 'USER', level: 'Intermédiaire', stravaConnected: false },
  { firstName: 'Emma', lastName: 'Petit', email: 'emma.petit@email.fr', role: 'USER', level: 'Débutant', stravaConnected: false },
  { firstName: 'Thomas', lastName: 'Durand', email: 'thomas.durand@email.fr', role: 'USER', level: 'Expert', stravaConnected: true },
  { firstName: 'Claire', lastName: 'Roux', email: 'claire.roux@email.fr', role: 'USER', level: 'Passionné', stravaConnected: true },
];

function getMpiScore(level) {
  const scores = {
    'Élite': () => 850 + Math.floor(Math.random() * 100),
    'Compétiteur Expert': () => 750 + Math.floor(Math.random() * 99),
    'Expert': () => 650 + Math.floor(Math.random() * 99),
    'Passionné': () => 550 + Math.floor(Math.random() * 99),
    'Intermédiaire': () => 400 + Math.floor(Math.random() * 149),
    'Débutant': () => 200 + Math.floor(Math.random() * 199),
  };
  return (scores[level] || scores['Débutant'])();
}

const REGIONS_DATA = [
  { region: 'Île-de-France', department: '75', totalCyclists: 12480, michelinUsers: 9874, coveragePct: 79.1, growthPct: 8.3 },
  { region: 'Auvergne-Rhône-Alpes', department: '69', totalCyclists: 9340, michelinUsers: 7123, coveragePct: 76.3, growthPct: 11.2 },
  { region: 'PACA', department: '13', totalCyclists: 8120, michelinUsers: 5684, coveragePct: 70.0, growthPct: 6.8 },
  { region: 'Occitanie', department: '31', totalCyclists: 6890, michelinUsers: 3890, coveragePct: 56.5, growthPct: 9.1 },
  { region: 'Nouvelle-Aquitaine', department: '33', totalCyclists: 7430, michelinUsers: 4947, coveragePct: 66.6, growthPct: 7.4 },
  { region: 'Bretagne', department: '35', totalCyclists: 5210, michelinUsers: 2918, coveragePct: 56.0, growthPct: 5.2 },
  { region: 'Grand Est', department: '67', totalCyclists: 4870, michelinUsers: 3895, coveragePct: 80.0, growthPct: 12.4 },
  { region: 'Hauts-de-France', department: '59', totalCyclists: 4120, michelinUsers: 1565, coveragePct: 38.0, growthPct: 3.1 },
  { region: 'Normandie', department: '76', totalCyclists: 3240, michelinUsers: 1134, coveragePct: 35.0, growthPct: 2.8 },
  { region: 'Pays de la Loire', department: '44', totalCyclists: 3980, michelinUsers: 2190, coveragePct: 55.0, growthPct: 6.3 },
  { region: 'Centre-Val de Loire', department: '37', totalCyclists: 2760, michelinUsers: 939, coveragePct: 34.0, growthPct: 4.1 },
  { region: 'Bourgogne-Franche-Comté', department: '21', totalCyclists: 2430, michelinUsers: 1166, coveragePct: 48.0, growthPct: 5.7 },
  { region: 'Corse', department: '2A', totalCyclists: 890, michelinUsers: 303, coveragePct: 34.0, growthPct: 8.9 },
];

const ADMIN_KPIS_DATA = [
  { label: 'Cyclistes actifs', value: '72 430', delta: '+8.3%', deltaPositive: true, icon: 'users' },
  { label: 'Clubs partenaires', value: '2 847', delta: '+12.1%', deltaPositive: true, icon: 'flag' },
  { label: 'Km analysés (millions)', value: '148.7', delta: '+23.4%', deltaPositive: true, icon: 'route' },
  { label: 'Réduction crevaisons', value: '34%', delta: '+2pts', deltaPositive: true, icon: 'shield' },
  { label: 'Croissance hebdo km', value: '+5.2%', delta: '+1.1pts', deltaPositive: true, icon: 'trending-up' },
  { label: 'Nouveaux membres/mois', value: '1 247', delta: '-3.2%', deltaPositive: false, icon: 'user-plus' },
  { label: 'Nouveaux clubs/mois', value: '38', delta: '+15.4%', deltaPositive: true, icon: 'plus-circle' },
  { label: 'Score NPS communauté', value: '72', delta: '+4pts', deltaPositive: true, icon: 'star' },
];

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

async function clearAll() {
  console.log('  Clearing existing data...');
  await prisma.adminKpi.deleteMany();
  await prisma.tireTerrainPerf.deleteMany();
  await prisma.regionCoverage.deleteMany();
  await prisma.testerReward.deleteMany();
  await prisma.testerProgress.deleteMany();
  await prisma.performanceIndex.deleteMany();
  await prisma.review.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.tireWear.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.user.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.tire.deleteMany();
  await prisma.dealer.deleteMany();
  await prisma.club.deleteMany();
}

async function seedBadges() {
  console.log('  Seeding badges...');
  const badges = [];
  for (const b of BADGES_DATA) {
    const badge = await prisma.badge.create({ data: b });
    badges.push(badge);
  }
  return badges;
}

async function seedClubs() {
  console.log('  Seeding clubs (50)...');
  const clubs = [];
  for (let i = 0; i < CLUBS_DATA.length; i++) {
    const c = CLUBS_DATA[i];
    const clubBadges = CLUB_BADGES.map((b) => ({
      ...b,
      unlocked: c.michelinEquipmentPct >= 70 ? b.id === 'b1' || b.id === 'b4' : b.id === 'b1',
    }));
    const club = await prisma.club.create({
      data: {
        name: c.name,
        region: c.region,
        department: c.department,
        memberCount: c.memberCount,
        totalKm: c.totalKm,
        monthlyKm: c.monthlyKm,
        monthlyKmDelta: c.monthlyKmDelta,
        rank: c.rank,
        rankDelta: c.rankDelta,
        michelinEquipmentPct: c.michelinEquipmentPct,
        badges: clubBadges,
      },
    });
    clubs.push(club);
  }
  return clubs;
}

async function seedUsers(clubs) {
  console.log('  Seeding users (10)...');
  const hash = bcrypt.hashSync('Michelin123!', SALT_ROUNDS);
  const users = [];
  for (let i = 0; i < USERS_DATA.length; i++) {
    const u = USERS_DATA[i];
    const clubId = i >= 2 ? clubs[i % clubs.length].id : null;
    const user = await prisma.user.create({
      data: {
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password: hash,
        role: u.role,
        level: u.level,
        stravaConnected: u.stravaConnected,
        memberSince: new Date(Date.now() - (365 - i * 30) * 24 * 60 * 60 * 1000),
        clubId,
      },
    });
    users.push(user);
  }
  return users;
}

async function seedUserBadges(users, badges) {
  console.log('  Seeding user badges...');
  const levelBadgeMap = {
    'Élite': [0, 1, 2, 3, 4, 5],
    'Compétiteur Expert': [0, 1, 2, 5],
    'Expert': [0, 1, 5],
    'Passionné': [0, 5],
    'Intermédiaire': [0],
    'Débutant': [],
  };
  for (const user of users) {
    const indices = levelBadgeMap[user.level] || [];
    for (const idx of indices) {
      if (badges[idx]) {
        await prisma.userBadge.create({
          data: {
            userId: user.id,
            badgeId: badges[idx].id,
            earnedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }
  }
}

async function seedRewards(users) {
  console.log('  Seeding rewards...');
  const regularUsers = users.filter((u) => u.role === 'USER');
  for (let i = 0; i < regularUsers.length; i++) {
    const user = regularUsers[i];
    await prisma.reward.create({
      data: {
        userId: user.id,
        type: 'coupon',
        code: `MICH-${user.firstName.toUpperCase().slice(0, 3)}-${(1000 + i * 37).toString()}`,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usedAt: i === 1 ? new Date() : null,
      },
    });
  }
}

async function seedTires() {
  console.log('  Seeding tires (11)...');
  const tires = [];
  for (const t of TIRES_DATA) {
    const tire = await prisma.tire.create({ data: t });
    tires.push(tire);
  }
  return tires;
}

async function seedTireWears(users, tires) {
  console.log('  Seeding tire wears...');
  const regularUsers = users.filter((u) => u.role === 'USER');
  const wearStatuses = ['good', 'good', 'warning', 'critical'];
  for (let i = 0; i < regularUsers.length; i++) {
    const user = regularUsers[i];
    const tire1 = tires[i % tires.length];
    const tire2 = tires[(i + 3) % tires.length];
    const installedAt1 = new Date(Date.now() - (90 + i * 10) * 24 * 60 * 60 * 1000);
    const currentKm1 = 1800 + i * 200;
    const estimatedMaxKm1 = 5000;
    await prisma.tireWear.create({
      data: {
        userId: user.id,
        tireId: tire1.id,
        tireRef: tire1.reference,
        tireName: tire1.name,
        installedAt: installedAt1,
        currentKm: currentKm1,
        estimatedMaxKm: estimatedMaxKm1,
        wearPct: Math.min(99, Math.round((currentKm1 / estimatedMaxKm1) * 100)),
        status: wearStatuses[i % wearStatuses.length],
      },
    });
    if (i < 2) {
      const installedAt2 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const currentKm2 = 400 + i * 100;
      await prisma.tireWear.create({
        data: {
          userId: user.id,
          tireId: tire2.id,
          tireRef: tire2.reference,
          tireName: tire2.name,
          installedAt: installedAt2,
          currentKm: currentKm2,
          estimatedMaxKm: 6000,
          wearPct: Math.round((currentKm2 / 6000) * 100),
          status: 'good',
        },
      });
    }
  }
}

async function seedActivities(users) {
  console.log('  Seeding activities (12/user)...');
  const regularUsers = users.filter((u) => u.role === 'USER');
  for (const user of regularUsers) {
    for (let i = 0; i < 12; i++) {
      const type = ACTIVITY_TYPES[i % ACTIVITY_TYPES.length];
      const distanceKm = 30 + Math.round(Math.random() * 120);
      const elevationM = type === 'vtt' || type === 'gravel' ? 500 + Math.round(Math.random() * 1500) : 100 + Math.round(Math.random() * 600);
      const avgSpeedKmh = type === 'vtt' ? 18 + Math.random() * 6 : 24 + Math.random() * 12;
      await prisma.activity.create({
        data: {
          userId: user.id,
          name: ACTIVITY_NAMES[i % ACTIVITY_NAMES.length],
          date: new Date(Date.now() - (i * 7 + Math.floor(Math.random() * 3)) * 24 * 60 * 60 * 1000),
          distanceKm,
          elevationM,
          avgSpeedKmh: Math.round(avgSpeedKmh * 10) / 10,
          maxSpeedKmh: Math.round((avgSpeedKmh + 10 + Math.random() * 15) * 10) / 10,
          durationMin: Math.round((distanceKm / avgSpeedKmh) * 60),
          type,
          location: LOCATIONS[i % LOCATIONS.length],
          mpiImpact: Math.round((Math.random() * 20 - 5) * 10) / 10,
        },
      });
    }
  }
}

async function seedDealers() {
  console.log('  Seeding dealers (15)...');
  for (const d of DEALERS_DATA) {
    await prisma.dealer.create({ data: d });
  }
}

async function seedReviews(users, tires) {
  console.log('  Seeding reviews (18)...');
  const regularUsers = users.filter((u) => u.role === 'USER');
  const comments = [
    'Excellent pneu, très bon grip sur route mouillée. Je recommande vivement pour les sorties hivernales.',
    'Rapport qualité/prix imbattable. Plusieurs milliers de km sans crevaison.',
    'Parfait pour la compétition. La légèreté se ressent immédiatement en montée.',
    'Très bon pneu endurance, tient bien sur le long terme. Idéal pour les cyclosportives.',
    'Bonne adhérence, confort un peu ferme mais acceptable pour la route.',
    'J\'utilise ce pneu depuis 3 saisons, toujours impeccable malgré les conditions difficiles.',
    'Excellent pour le gravel, tient parfaitement sur les chemins forestiers.',
    'Légèrement cher mais la qualité est au rendez-vous. Pas de crevaison en 8 mois.',
    'Bon pneu polyvalent, idéal pour les sorties mixtes route/gravel.',
  ];
  const influencerComments = [
    'Testé pendant 2 mois sur les routes alpines, ce pneu m\'a bluffé par sa tenue en virage.',
    'Partenariat officiel Michelin. Ce pneu répond à toutes mes attentes pour la compétition.',
    'Après 5 000 km de tests intensifs, je confirme : c\'est le meilleur pneu endurance du marché.',
    'Mon coup de cœur de la saison. Incontournable pour les grimpeurs.',
    "Testé en conditions extrêmes lors de la Transcontinental Race. Zéro crevaison sur 4 000 km.",
    "Le pneu parfait pour les gravel racers. Polyvalence et robustesse au programme.",
    "J'ai switché tous mes pneus pour cette référence. La différence est notable dès le premier km.",
    "Recommandé à toute ma communauté. C'est simple, il n'y a pas mieux sur le marché.",
    "Pour les cyclistes exigeants qui ne veulent pas faire de compromis sur la performance.",
  ];
  const platforms = ['instagram', 'youtube', 'strava', 'komoot'];
  let reviewCount = 0;
  for (let i = 0; i < 9; i++) {
    const user = regularUsers[i % regularUsers.length];
    const tire = tires[i % tires.length];
    await prisma.review.create({
      data: {
        authorId: user.id,
        authorName: `${user.firstName} ${user.lastName}`,
        authorInitials: `${user.firstName[0]}${user.lastName[0]}`,
        kmWithTire: 1000 + i * 500,
        rating: 4 + (i % 2 === 0 ? 1 : 0),
        comment: comments[i],
        isVerified: i % 3 !== 0,
        date: new Date(Date.now() - (i * 14) * 24 * 60 * 60 * 1000),
        type: 'user',
        tireRef: tire.reference,
      },
    });
    reviewCount++;
  }
  for (let i = 0; i < 9; i++) {
    const user = regularUsers[i % regularUsers.length];
    const tire = tires[(i + 2) % tires.length];
    const platform = platforms[i % platforms.length];
    await prisma.review.create({
      data: {
        authorId: user.id,
        authorName: `@cyclist_pro_${i + 1}`,
        authorInitials: `CP`,
        kmWithTire: 3000 + i * 800,
        rating: 5,
        comment: influencerComments[i],
        isVerified: true,
        date: new Date(Date.now() - (i * 21) * 24 * 60 * 60 * 1000),
        type: 'influencer',
        tireRef: tire.reference,
        sponsoredContent: i % 2 === 0 ? 'Contenu sponsorisé par Michelin' : null,
        followerCount: 10000 + i * 15000,
        platform,
      },
    });
    reviewCount++;
  }
  console.log(`    Created ${reviewCount} reviews`);
}

async function seedPerformanceIndices(users) {
  console.log('  Seeding performance indices...');
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const score = getMpiScore(user.level);
    const history = [];
    for (let m = 11; m >= 0; m--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - m);
      history.push({
        month: monthDate.toISOString().slice(0, 7),
        score: Math.max(100, score - m * 15 + Math.round(Math.random() * 30 - 10)),
      });
    }
    await prisma.performanceIndex.create({
      data: {
        userId: user.id,
        score,
        level: user.level,
        monthlyDelta: Math.round((Math.random() * 40 - 10) * 10) / 10,
        weeklyKm: 100 + Math.round(Math.random() * 200),
        nationalRank: i + 1,
        percentileBeat: Math.min(99, Math.round((1 - (i + 1) / users.length) * 100)),
        history,
      },
    });
  }
}

async function seedTesterProgress(users) {
  console.log('  Seeding tester progress...');
  const regularUsers = users.filter((u) => u.role === 'USER');
  const rewardTemplates = [
    { label: 'Testeur Bronze', description: 'Atteindre 1 000 km avec un pneu Michelin', milestoneKm: 1000 },
    { label: 'Testeur Argent', description: 'Atteindre 3 000 km avec un pneu Michelin', milestoneKm: 3000 },
    { label: 'Testeur Or', description: 'Atteindre 5 000 km avec un pneu Michelin', milestoneKm: 5000 },
    { label: 'Testeur Élite', description: 'Atteindre 10 000 km avec un pneu Michelin', milestoneKm: 10000 },
  ];
  for (let i = 0; i < regularUsers.length; i++) {
    const user = regularUsers[i];
    const currentKm = 800 + i * 600;
    const milestones = [1000, 3000, 5000, 10000];
    const nextMilestone = milestones.find((m) => m > currentKm) || 10000;
    const progress = await prisma.testerProgress.create({
      data: {
        userId: user.id,
        currentKm,
        nextMilestoneKm: nextMilestone,
        progressPct: Math.round((currentKm / nextMilestone) * 100),
        couponCode: `TEST-${user.firstName.toUpperCase().slice(0, 3)}-${(2000 + i * 47).toString()}`,
        couponExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        totalTesters: 1247,
        rank: i + 1,
      },
    });
    for (let j = 0; j < rewardTemplates.length; j++) {
      const tpl = rewardTemplates[j];
      let status = 'locked';
      let unlockedAt = null;
      if (currentKm >= tpl.milestoneKm) {
        status = 'unlocked';
        unlockedAt = new Date(Date.now() - (j * 30) * 24 * 60 * 60 * 1000);
      } else if (currentKm >= tpl.milestoneKm * 0.7) {
        status = 'in-progress';
      }
      await prisma.testerReward.create({
        data: {
          testerProgressId: progress.id,
          label: tpl.label,
          description: tpl.description,
          status,
          unlockedAt,
        },
      });
    }
  }
}

async function seedRegionCoverage() {
  console.log('  Seeding region coverage (13)...');
  for (const r of REGIONS_DATA) {
    await prisma.regionCoverage.create({ data: r });
  }
}

async function seedTireTerrainPerf(tires) {
  console.log('  Seeding tire terrain perfs (11)...');
  const terrainProfiles = {
    'competition': { mountain: 9.4, coastal: 8.8, plain: 9.7, wet: 7.8 },
    'route': { mountain: 8.2, coastal: 8.6, plain: 9.1, wet: 8.4 },
    'endurance': { mountain: 8.0, coastal: 8.4, plain: 8.8, wet: 8.9 },
    'gravel': { mountain: 9.1, coastal: 7.9, plain: 8.2, wet: 9.0 },
  };
  for (const tire of tires) {
    const profile = terrainProfiles[tire.category];
    const noise = () => Math.round((Math.random() * 0.6 - 0.3) * 10) / 10;
    await prisma.tireTerrainPerf.create({
      data: {
        tireRef: tire.reference,
        tireName: tire.name,
        tireId: tire.id,
        mountain: Math.min(10, Math.max(1, profile.mountain + noise())),
        coastal: Math.min(10, Math.max(1, profile.coastal + noise())),
        plain: Math.min(10, Math.max(1, profile.plain + noise())),
        wet: Math.min(10, Math.max(1, profile.wet + noise())),
        avgRating: tire.avgScore,
        totalKmAnalyzed: tire.communityKm,
      },
    });
  }
}

async function seedAdminKpis() {
  console.log('  Seeding admin KPIs (8)...');
  for (const kpi of ADMIN_KPIS_DATA) {
    await prisma.adminKpi.create({ data: kpi });
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱 Starting seed...\n');
  await clearAll();
  const badges = await seedBadges();
  const clubs = await seedClubs();
  const users = await seedUsers(clubs);
  await seedUserBadges(users, badges);
  await seedRewards(users);
  const tires = await seedTires();
  await seedTireWears(users, tires);
  await seedActivities(users);
  await seedDealers();
  await seedReviews(users, tires);
  await seedPerformanceIndices(users);
  await seedTesterProgress(users);
  await seedRegionCoverage();
  await seedTireTerrainPerf(tires);
  await seedAdminKpis();
  console.log('\n✅ Seed completed successfully!');
  console.log('\nDefault credentials: admin@michelin.fr / Michelin123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
