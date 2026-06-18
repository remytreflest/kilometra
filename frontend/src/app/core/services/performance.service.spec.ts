import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PerformanceService } from './performance.service';
import { ApiService } from './api.service';
import { PerformanceIndex } from '../../shared/models/performance.model';

const mockIndex: PerformanceIndex = {
  score: 720, level: 'Competiteur Expert', monthlyDelta: 35,
  weeklyKm: 180, nationalRank: 412, percentileBeat: 88,
  history: [{ month: 'Jan', score: 680 }],
};

const mockCommunity = {
  activeCyclists: 25000, registeredClubs: 320, analyzedKm: 1800000,
  punctureReductionPct: 31, weeklyKmGrowth: 4.2,
  monthlyUserGrowth: 2.1, monthlyClubGrowth: 1.5, avgRating: 4.6,
};

describe('PerformanceService', () => {
  let service: PerformanceService;
  let apiService: any;

  beforeEach(() => {
    apiService = { get: jest.fn() };
    TestBed.configureTestingModule({
      providers: [PerformanceService, { provide: ApiService, useValue: apiService }],
    });
    service = TestBed.inject(PerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getIndex() should call /performance/me and return PerformanceIndex', () => {
    apiService.get.mockReturnValue(of(mockIndex));
    service.getIndex().subscribe(res => {
      expect(res).toEqual(mockIndex);
    });
    expect(apiService.get).toHaveBeenCalledWith('/performance/me');
  });

  it('getCommunityKpis() should call /performance/community', () => {
    apiService.get.mockReturnValue(of(mockCommunity));
    service.getCommunityKpis().subscribe(res => {
      expect(res).toEqual(mockCommunity);
    });
    expect(apiService.get).toHaveBeenCalledWith('/performance/community');
  });
});
