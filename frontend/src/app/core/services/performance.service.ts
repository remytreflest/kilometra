import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PerformanceIndex } from '../../shared/models/performance.model';

interface CommunityKpis {
  activeCyclists: number;
  registeredClubs: number;
  analyzedKm: number;
  punctureReductionPct: number;
  weeklyKmGrowth: number;
  monthlyUserGrowth: number;
  monthlyClubGrowth: number;
  avgRating?: number;
}

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  constructor(private api: ApiService) {}

  getIndex(): Observable<PerformanceIndex> {
    return this.api.get<PerformanceIndex>('/performance/me');
  }

  getCommunityKpis(): Observable<CommunityKpis> {
    return this.api.get<CommunityKpis>('/performance/community');
  }
}
