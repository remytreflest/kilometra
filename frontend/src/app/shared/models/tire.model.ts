export type TireCategory = 'route' | 'endurance' | 'competition' | 'vtt' | 'gravel';
export type TireBrand = 'Michelin' | 'Concurrent';

export interface TireScores {
  grip: number;               // /10
  energyReturn: number;       // /10
  comfort: number;            // /10
  punctureResistance: number; // /10
  durability: number;         // /10
}

export interface Tire {
  id: string;
  reference: string;          // ex: "Power Road TLR"
  name: string;               // nom commercial complet
  brand: TireBrand;
  category: TireCategory;
  scores: TireScores;
  avgScore: number;           // calculé (moyenne pondérée)
  communityKm: number;        // km totaux sur cette ref
  punctureReductionPct: number; // % vs concurrent
  recommendedFor: string[];   // profils recommandés
  priceEur?: number;
}

export interface TireWear {
  tire: Tire;
  position: 'front' | 'rear';
  kmSinceInstall: number;
  wearPercentage: number;      // 0–100
  estimatedDaysLeft: number;
  installDate: Date;
}

export interface TireTerrainStats {
  tireId: string;
  tireName: string;
  mountain: number;     // score /10 en montagne
  coastal: number;      // score /10 en bord de mer
  plain: number;        // score /10 en plaine
  wet: number;          // score /10 sur sol mouillé
  avgPunctureRate: number; // crevaisons pour 1000 km
}
