import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { UserProfile, UserBadge, UserReward } from '../../shared/models/user.model';

interface BackendUser {
  id: string; firstName: string; lastName: string; initials: string;
  level: string; stravaConnected: boolean; memberSince: string;
  club?: { id: string; name: string; region: string } | null;
  badges: { id: string; label: string; icon: string; color: string; earnedAt: string }[];
  rewards: { id: string; type: string; title: string; description: string; code: string; validUntil: string; usedAt?: string }[];
}

function adaptUser(b: BackendUser): UserProfile {
  return {
    id: b.id,
    firstName: b.firstName,
    lastName: b.lastName,
    initials: b.initials,
    club: b.club?.name ?? '',
    memberSince: new Date(b.memberSince),
    level: b.level as UserProfile['level'],
    stravaConnected: b.stravaConnected,
    badges: b.badges.map((badge): UserBadge => ({
      id: badge.id,
      label: badge.label,
      icon: badge.icon,
      color: badge.color,
      unlocked: true,
    })),
    rewards: b.rewards.map((r): UserReward => ({
      id: r.id,
      title: r.title || (r.type === 'coupon' ? 'Coupon de réduction' : r.type),
      description: r.description,
      validUntil: new Date(r.validUntil),
      couponCode: r.code,
      type: r.type as 'coupon' | 'access' | 'product',
    })),
  };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  getProfile(): Observable<UserProfile> {
    return this.api.get<BackendUser>('/users/me').pipe(map(adaptUser));
  }

  getBadges(): Observable<UserBadge[]> {
    return this.api.get<{ id: string; label: string; icon: string; color: string; earnedAt: string }[]>('/users/me/badges').pipe(
      map(badges => badges.map(b => ({ id: b.id, label: b.label, icon: b.icon, color: b.color, unlocked: true })))
    );
  }

  getRewards(): Observable<UserReward[]> {
    return this.api.get<{ id: string; type: string; title: string; description: string; code: string; validUntil: string }[]>('/users/me/rewards').pipe(
      map(rewards => rewards.map(r => ({
        id: r.id,
        title: r.title || (r.type === 'coupon' ? 'Coupon de réduction' : r.type),
        description: r.description,
        validUntil: new Date(r.validUntil),
        couponCode: r.code,
        type: r.type as 'coupon' | 'access' | 'product',
      })))
    );
  }

  getAllBadges(): Observable<(UserBadge & { earnedAt: Date | null })[]> {
    return this.api.get<{ id: string; label: string; icon: string; color: string; unlocked: boolean; earnedAt: string | null }[]>('/users/me/badges/all').pipe(
      map(badges => badges.map(b => ({
        id: b.id,
        label: b.label,
        icon: b.icon,
        color: b.color,
        unlocked: b.unlocked,
        earnedAt: b.earnedAt ? new Date(b.earnedAt) : null,
      })))
    );
  }
}
