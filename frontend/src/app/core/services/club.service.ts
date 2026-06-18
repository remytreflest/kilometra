import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Club, RaceResult, RankingScale } from '../../shared/models/club.model';

@Injectable({ providedIn: 'root' })
export class ClubService {
  constructor(private api: ApiService) {}

  getAllClubs(region?: string): Observable<Club[]> {
    const params = region ? { region } : undefined;
    return this.api.get<Club[]>('/clubs', params);
  }

  getMyClub(): Observable<Club> {
    return this.api.get<Club>('/clubs/me');
  }

  getRanking(scale: RankingScale = 'regional', region?: string): Observable<Club[]> {
    const params: Record<string, string> = {};
    if (region) params['region'] = region;
    return this.api.get<Club[]>('/clubs/ranking', params);
  }

  getNationalLeaderboard(): Observable<RaceResult[]> {
    return this.api.get<RaceResult[]>('/leaderboard/national');
  }

  getRegionalLeaderboard(region: string): Observable<RaceResult[]> {
    return this.api.get<RaceResult[]>('/leaderboard/regional', { region });
  }
}
