import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RegionMichelinCoverage, TireTerrainPerf, AdminKpi } from '../../shared/models/admin.model';

const REGION_COVERAGE: RegionMichelinCoverage[] = [
  { region: 'Auvergne-Rhône-Alpes', department: 'Multiple',           totalCyclists: 4_280, michelinUsers: 2_823, coveragePct: 66, growthPct: +12 },
  { region: 'Pays de la Loire',      department: 'Multiple',           totalCyclists: 3_940, michelinUsers: 2_404, coveragePct: 61, growthPct: +18 },
  { region: 'Nouvelle-Aquitaine',    department: 'Multiple',           totalCyclists: 3_620, michelinUsers: 1_918, coveragePct: 53, growthPct: +9  },
  { region: 'Occitanie',             department: 'Multiple',           totalCyclists: 3_180, michelinUsers: 1_463, coveragePct: 46, growthPct: +7  },
  { region: 'Bretagne',              department: 'Multiple',           totalCyclists: 2_840, michelinUsers: 1_392, coveragePct: 49, growthPct: +14 },
  { region: 'PACA',                  department: 'Multiple',           totalCyclists: 2_650, michelinUsers: 1_113, coveragePct: 42, growthPct: +6  },
  { region: 'Île-de-France',         department: 'Multiple',           totalCyclists: 5_420, michelinUsers: 2_005, coveragePct: 37, growthPct: +4  },
  { region: 'Centre-Val de Loire',   department: 'Multiple',           totalCyclists: 1_840, michelinUsers: 847,   coveragePct: 46, growthPct: +11 },
  { region: 'Grand Est',             department: 'Multiple',           totalCyclists: 2_190, michelinUsers: 680,   coveragePct: 31, growthPct: +5  },
  { region: 'Normandie',             department: 'Multiple',           totalCyclists: 1_640, michelinUsers: 492,   coveragePct: 30, growthPct: +8  },
  { region: 'Hauts-de-France',       department: 'Multiple',           totalCyclists: 2_380, michelinUsers: 690,   coveragePct: 29, growthPct: +6  },
  { region: 'Bourgogne-FC',          department: 'Multiple',           totalCyclists: 1_420, michelinUsers: 540,   coveragePct: 38, growthPct: +9  },
  { region: 'Corse',                 department: 'Multiple',           totalCyclists: 380,   michelinUsers: 95,    coveragePct: 25, growthPct: +3  },
];

const TIRE_TERRAIN_PERF: TireTerrainPerf[] = [
  { tireRef: 'Power Cup EVO TLR',    tireName: 'Power Cup EVO TLR',    mountain: 9.5, coastal: 8.8, plain: 9.3, wet: 8.4, avgRating: 4.8, totalKmAnalyzed: 198_000 },
  { tireRef: 'Power Road TLR',       tireName: 'Power Road TLR',       mountain: 9.1, coastal: 9.3, plain: 9.0, wet: 9.2, avgRating: 4.7, totalKmAnalyzed: 412_000 },
  { tireRef: 'Power Gravel',         tireName: 'Power Gravel',         mountain: 9.4, coastal: 8.6, plain: 8.0, wet: 8.8, avgRating: 4.6, totalKmAnalyzed: 89_000  },
  { tireRef: 'Power All Season TLR', tireName: 'Power All Season TLR', mountain: 8.9, coastal: 9.2, plain: 8.7, wet: 9.5, avgRating: 4.7, totalKmAnalyzed: 175_000 },
  { tireRef: 'Pro4 Endurance V2',    tireName: 'Pro4 Endurance V2',    mountain: 8.5, coastal: 9.4, plain: 9.0, wet: 9.7, avgRating: 4.8, totalKmAnalyzed: 280_000 },
  { tireRef: 'Power Endurance 2',    tireName: 'Power Endurance 2',    mountain: 8.2, coastal: 9.1, plain: 8.8, wet: 9.5, avgRating: 4.6, totalKmAnalyzed: 320_000 },
  { tireRef: 'Dynamic Sport',        tireName: 'Dynamic Sport',        mountain: 7.6, coastal: 8.4, plain: 8.2, wet: 8.0, avgRating: 4.2, totalKmAnalyzed: 540_000 },
];

const ADMIN_KPIS: AdminKpi[] = [
  { label: 'Utilisateurs actifs',     value: '25 000',   delta: '+8% ce mois',  deltaPositive: true,  icon: 'people' },
  { label: 'Clubs inscrits',          value: '320',      delta: '+14 ce mois',  deltaPositive: true,  icon: 'emoji_events' },
  { label: 'Km analysés (total)',     value: '1,8M km',  delta: '+62k cette semaine', deltaPositive: true, icon: 'route' },
  { label: 'Réduction crevaisons',    value: '−31%',     delta: 'vs non-Michelin', deltaPositive: true, icon: 'tire_repair' },
  { label: 'Taux conversion testeur', value: '34%',      delta: '+6pts ce mois', deltaPositive: true,  icon: 'trending_up' },
  { label: 'Coupons utilisés',        value: '1 240',    delta: '68% du stock',  deltaPositive: true,  icon: 'sell' },
  { label: 'Régions sous-couvertes',  value: '4',        delta: '<30% d\'équipement', deltaPositive: false, icon: 'warning' },
  { label: 'Avis certifiés',          value: '2 340',    delta: '+180 ce mois', deltaPositive: true,  icon: 'star' },
];

@Injectable({ providedIn: 'root' })
export class AdminService {
  getRegionCoverage(): Observable<RegionMichelinCoverage[]> {
    return of(REGION_COVERAGE.sort((a, b) => a.coveragePct - b.coveragePct)).pipe(delay(250));
  }

  getUndercoveredRegions(): Observable<RegionMichelinCoverage[]> {
    return of(REGION_COVERAGE.filter(r => r.coveragePct < 40).sort((a, b) => a.coveragePct - b.coveragePct)).pipe(delay(200));
  }

  getTireTerrainPerformance(): Observable<TireTerrainPerf[]> {
    return of(TIRE_TERRAIN_PERF).pipe(delay(200));
  }

  getBestTireForTerrain(terrain: 'mountain' | 'coastal' | 'plain' | 'wet'): Observable<TireTerrainPerf> {
    const sorted = [...TIRE_TERRAIN_PERF].sort((a, b) => b[terrain] - a[terrain]);
    return of(sorted[0]).pipe(delay(100));
  }

  getKpis(): Observable<AdminKpi[]> {
    return of(ADMIN_KPIS).pipe(delay(150));
  }
}
