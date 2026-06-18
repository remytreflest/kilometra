export interface RegionMichelinCoverage {
  region: string;
  department: string;
  totalCyclists: number;
  michelinUsers: number;
  coveragePct: number;    // % équipés Michelin
  growthPct: number;      // croissance MoM
}

export interface TireTerrainPerf {
  tireRef: string;
  tireName: string;
  mountain: number;
  coastal: number;
  plain: number;
  wet: number;
  avgRating: number;
  totalKmAnalyzed: number;
}

export interface AdminKpi {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon: string;
}
