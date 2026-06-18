import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { TesterProgress, TesterReward } from '../../shared/models/tester.model';

interface BackendTesterProgress {
  currentKm: number; nextMilestoneKm: number; progressPct: number;
  couponCode: string; couponExpiry: string; totalTesters: number; rank: number;
  rewards: { id: string; label: string; description: string; requiredKm: number; icon: string; status: string; unlockedAt?: string }[];
}

function adaptProgress(b: BackendTesterProgress): TesterProgress {
  return {
    currentKm: b.currentKm,
    nextMilestoneKm: b.nextMilestoneKm,
    progressPct: b.progressPct,
    couponCode: b.couponCode,
    couponExpiry: new Date(b.couponExpiry),
    totalTesters: b.totalTesters,
    rank: b.rank,
    rewards: b.rewards.map((r): TesterReward => ({
      id: r.id,
      title: r.label,
      description: r.description,
      requiredKm: r.requiredKm,
      status: r.status as TesterReward['status'],
      icon: r.icon,
      progressPct: r.status === 'unlocked' ? 100 : r.status === 'locked' ? 0 : b.progressPct,
    })),
  };
}

@Injectable({ providedIn: 'root' })
export class TesterService {
  constructor(private api: ApiService) {}

  getProgress(): Observable<TesterProgress | null> {
    return this.api.get<BackendTesterProgress | null>('/tester/me').pipe(
      map(data => data ? adaptProgress(data) : null)
    );
  }
}
