import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { UserProfile } from '../../shared/models/user.model';

const USER: UserProfile = {
  id: 'u001',
  firstName: 'Camille',
  lastName: 'Dubreuil',
  initials: 'CD',
  club: 'Club Cyclotouriste Nantais',
  memberSince: new Date('2025-03-01'),
  level: 'Compétiteur Expert',
  stravaConnected: true,
  badges: [
    { id: 'b1', label: 'Testeur officiel',   icon: 'verified',      color: '#FCE500', unlocked: true  },
    { id: 'b2', label: '1 000 km validés',   icon: 'speed',         color: '#27509B', unlocked: true  },
    { id: 'b3', label: '30 jours d\'affilée',icon: 'check_circle',  color: '#84BD00', unlocked: true  },
    { id: 'b4', label: 'Élite nationale',    icon: 'military_tech', color: '#53565A', unlocked: false },
  ],
  rewards: [
    {
      id: 'rw1',
      title: 'Coupon −50%',
      description: 'Sur votre prochain train de pneus Michelin',
      validUntil: new Date('2026-09-30'),
      couponCode: 'MICHELIN50',
      type: 'coupon'
    }
  ]
};

@Injectable({ providedIn: 'root' })
export class UserService {
  getProfile(): Observable<UserProfile> {
    return of(USER).pipe(delay(100));
  }
}
