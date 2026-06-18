import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TesterService } from './tester.service';
import { ApiService } from './api.service';

const mockBackendProgress = {
  currentKm: 3200,
  nextMilestoneKm: 5000,
  progressPct: 64,
  couponCode: 'MICH-50',
  couponExpiry: '2025-12-31T00:00:00.000Z',
  totalTesters: 1800,
  rank: 42,
  rewards: [
    { id: 'r1', label: 'Premier badge', description: 'Desc', requiredKm: 1000, icon: 'star', status: 'unlocked', unlockedAt: '2024-01-01' },
    { id: 'r2', label: 'Objectif 3000', description: 'Desc2', requiredKm: 3000, icon: 'flag', status: 'in-progress' },
    { id: 'r3', label: 'Objectif 5000', description: 'Desc3', requiredKm: 5000, icon: 'trophy', status: 'locked' },
  ],
};

describe('TesterService', () => {
  let service: TesterService;
  let apiService: any;

  beforeEach(() => {
    apiService = { get: jest.fn().mockReturnValue(of(mockBackendProgress)) };
    TestBed.configureTestingModule({
      providers: [TesterService, { provide: ApiService, useValue: apiService }],
    });
    service = TestBed.inject(TesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProgress() should call /tester/me', () => {
    service.getProgress().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/tester/me');
  });

  it('getProgress() should adapt backend fields to TesterProgress shape', () => {
    service.getProgress().subscribe(res => {
      expect(res.currentKm).toBe(3200);
      expect(res.progressPct).toBe(64);
      expect(res.couponCode).toBe('MICH-50');
      expect(res.couponExpiry).toBeInstanceOf(Date);
      expect(res.totalTesters).toBe(1800);
      expect(res.rank).toBe(42);
    });
  });

  it('getProgress() should map rewards with correct status', () => {
    service.getProgress().subscribe(res => {
      const [unlocked, inProgress, locked] = res.rewards;
      expect(unlocked.status).toBe('unlocked');
      expect(unlocked.progressPct).toBe(100);
      expect(inProgress.status).toBe('in-progress');
      expect(inProgress.progressPct).toBe(64);
      expect(locked.status).toBe('locked');
      expect(locked.progressPct).toBe(0);
    });
  });
});
