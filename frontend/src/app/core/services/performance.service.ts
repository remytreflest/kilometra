import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PerformanceIndex } from '../../shared/models/performance.model';

const USER_PERFORMANCE: PerformanceIndex = {
  score: 742,
  level: 'Compétiteur Expert',
  monthlyDelta: +18,
  weeklyKm: 412,
  nationalRank: 214,
  percentileBeat: 82,
  history: [
    { month: 'Jan', score: 646 },
    { month: 'Fév', score: 664 },
    { month: 'Mar', score: 686 },
    { month: 'Avr', score: 704 },
    { month: 'Mai', score: 724 },
    { month: 'Juin', score: 742 },
  ]
};

const COMMUNITY_KPI = {
  activeCyclists: 25_000,
  registeredClubs: 320,
  analyzedKm: 1_800_000,
  punctureReductionPct: 31,
  weeklyKmGrowth: 62_000,
  monthlyUserGrowth: 8,
  monthlyClubGrowth: 14,
};

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  getIndex(): Observable<PerformanceIndex> {
    return of(USER_PERFORMANCE).pipe(delay(150));
  }

  getCommunityKpis(): Observable<typeof COMMUNITY_KPI> {
    return of(COMMUNITY_KPI).pipe(delay(200));
  }
}
