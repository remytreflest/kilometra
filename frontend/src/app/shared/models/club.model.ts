export type RankingScale = 'departmental' | 'regional' | 'national' | 'interclub';

export interface ClubBadge {
  id: string;
  label: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export interface Club {
  id: string;
  name: string;
  region: string;
  department: string;
  memberCount: number;
  totalKm: number;
  monthlyKm: number;
  rank: number;
  rankDelta: number;       // +/- places cette semaine
  monthlyKmDelta: number;  // km gagnés ce mois
  badges: ClubBadge[];
  michelinEquipmentPct: number; // % membres équipés Michelin
}

export interface RaceResult {
  rank: number;
  riderName: string;
  club: string;
  region: string;
  totalKm: number;
  mpiScore: number;
  level: string;
  michelinUser: boolean;
}
