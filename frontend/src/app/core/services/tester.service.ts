import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TesterProgress } from '../../shared/models/tester.model';

const TESTER_PROGRESS: TesterProgress = {
  currentKm: 842,
  nextMilestoneKm: 1250,
  progressPct: 67,
  couponCode: 'MICHELIN50',
  couponExpiry: new Date('2026-09-30'),
  totalTesters: 1_840,
  rank: 214,
  rewards: [
    {
      id: 'tr1',
      title: 'Coupon −50%',
      description: 'Sur votre prochain train de pneus Michelin',
      requiredKm: 500,
      status: 'unlocked',
      icon: 'sell',
      progressPct: 100,
      couponCode: 'MICHELIN50'
    },
    {
      id: 'tr2',
      title: 'Accès Michelin Labs',
      description: 'Visite virtuelle des centres de R&D et webinaires exclusifs',
      requiredKm: 1250,
      status: 'in-progress',
      icon: 'science',
      progressPct: 67
    },
    {
      id: 'tr3',
      title: 'Test de prototypes',
      description: 'Soyez parmi les premiers à rouler sur les futurs pneus Michelin',
      requiredKm: 2000,
      status: 'in-progress',
      icon: 'inventory',
      progressPct: 42
    },
    {
      id: 'tr4',
      title: 'Ambassadeur Michelin',
      description: 'Devenez ambassadeur officiel et participez aux événements presse',
      requiredKm: 5000,
      status: 'locked',
      icon: 'star',
      progressPct: 17
    }
  ]
};

@Injectable({ providedIn: 'root' })
export class TesterService {
  getProgress(): Observable<TesterProgress> {
    return of(TESTER_PROGRESS).pipe(delay(150));
  }
}
