import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserService } from './user.service';
import { ApiService } from './api.service';

const mockBackendUser = {
  id: 'u1', firstName: 'John', lastName: 'Doe', initials: 'JD',
  level: 'Competiteur Expert', stravaConnected: true, memberSince: '2022-03-15T00:00:00.000Z',
  club: { id: 'c1', name: 'VéloClub Lyon', region: 'Auvergne-Rhône-Alpes' },
  badges: [{ id: 'b1', label: 'Premier palier', icon: 'star', color: '#FFD700', earnedAt: '2023-01-01' }],
  rewards: [{ id: 'rew1', type: 'coupon', title: 'Coupon 50%', description: '-50% sur pneu', code: 'MICH-50', validUntil: '2025-12-31T00:00:00.000Z' }],
};

describe('UserService', () => {
  let service: UserService;
  let apiService: any;

  beforeEach(() => {
    apiService = { get: jest.fn() };
    TestBed.configureTestingModule({
      providers: [UserService, { provide: ApiService, useValue: apiService }],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProfile() should call /users/me and adapt to UserProfile shape', () => {
    apiService.get.mockReturnValue(of(mockBackendUser));
    service.getProfile().subscribe(res => {
      expect(res.id).toBe('u1');
      expect(res.club).toBe('VéloClub Lyon');
      expect(res.memberSince).toBeInstanceOf(Date);
      expect(res.badges.length).toBe(1);
      expect(res.badges[0].unlocked).toBe(true);
      expect(res.rewards.length).toBe(1);
      expect(res.rewards[0].validUntil).toBeInstanceOf(Date);
    });
    expect(apiService.get).toHaveBeenCalledWith('/users/me');
  });

  it('getProfile() should set empty string for club when user has no club', () => {
    apiService.get.mockReturnValue(of({ ...mockBackendUser, club: null }));
    service.getProfile().subscribe(res => {
      expect(res.club).toBe('');
    });
  });

  it('getBadges() should call /users/me/badges and map to UserBadge array', () => {
    apiService.get.mockReturnValue(of([{ id: 'b1', label: 'Badge', icon: 'star', color: '#gold', earnedAt: '2024-01-01' }]));
    service.getBadges().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].unlocked).toBe(true);
    });
    expect(apiService.get).toHaveBeenCalledWith('/users/me/badges');
  });

  it('getRewards() should call /users/me/rewards and map validUntil to Date', () => {
    apiService.get.mockReturnValue(of([{ id: 'r1', type: 'coupon', title: 'Coupon', description: 'Desc', code: 'CODE', validUntil: '2025-12-31T00:00:00.000Z' }]));
    service.getRewards().subscribe(res => {
      expect(res[0].validUntil).toBeInstanceOf(Date);
      expect(res[0].couponCode).toBe('CODE');
    });
    expect(apiService.get).toHaveBeenCalledWith('/users/me/rewards');
  });

  it('getAllBadges() should call /users/me/badges/all and handle null earnedAt', () => {
    apiService.get.mockReturnValue(of([
      { id: 'b1', label: 'Unlocked', icon: 'star', color: '#gold', unlocked: true, earnedAt: '2024-01-01' },
      { id: 'b2', label: 'Locked', icon: 'lock', color: '#grey', unlocked: false, earnedAt: null },
    ]));
    service.getAllBadges().subscribe(res => {
      expect(res[0].earnedAt).toBeInstanceOf(Date);
      expect(res[1].earnedAt).toBeNull();
      expect(res[1].unlocked).toBe(false);
    });
    expect(apiService.get).toHaveBeenCalledWith('/users/me/badges/all');
  });
});
