import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TireService } from './tire.service';
import { ApiService } from './api.service';

const mockBackendTire = {
  id: 't1', reference: 'power-road', name: 'Michelin Power Road TLR', brand: 'Michelin',
  category: 'route', adhesion: 9, efficiency: 8, comfort: 7, punctureResistance: 8,
  durability: 7, avgScore: 7.8, communityKm: 100000, punctureReductionPct: 31,
  recommendedFor: ['route'], priceEur: 89,
};

const mockBackendWear = {
  id: 'w1', tireId: 't1', tireRef: 'power-road', tireName: 'Power Road TLR',
  position: 'front' as const, installedAt: '2023-09-01T00:00:00.000Z',
  currentKm: 3200, estimatedMaxKm: 5000, wearPct: 64, status: 'ok',
  tire: { name: 'Power Road TLR', reference: 'power-road', category: 'route' },
};

describe('TireService', () => {
  let service: TireService;
  let apiService: any;

  beforeEach(() => {
    apiService = { get: jest.fn().mockReturnValue(of([mockBackendTire])) };
    TestBed.configureTestingModule({
      providers: [TireService, { provide: ApiService, useValue: apiService }],
    });
    service = TestBed.inject(TireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCatalog() should call /tires with no params when no category', () => {
    service.getCatalog().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/tires', undefined);
  });

  it('getCatalog() should pass category param when provided', () => {
    service.getCatalog('route').subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/tires', { category: 'route' });
  });

  it('getCatalog() should adapt backend fields to Tire shape', () => {
    service.getCatalog().subscribe(res => {
      expect(res[0].scores).toEqual({ grip: 9, energyReturn: 8, comfort: 7, punctureResistance: 8, durability: 7 });
      expect(res[0].brand).toBe('Michelin');
    });
  });

  it('getMichelinTires() should call /tires/michelin', () => {
    service.getMichelinTires().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/tires/michelin');
  });

  it('getTireById() should call /tires/:id', () => {
    apiService.get.mockReturnValue(of(mockBackendTire));
    service.getTireById('t1').subscribe(res => {
      expect(res?.id).toBe('t1');
    });
    expect(apiService.get).toHaveBeenCalledWith('/tires/t1');
  });

  it('getUserWear() should call /wear and adapt to TireWear shape', () => {
    apiService.get.mockReturnValue(of([mockBackendWear]));
    service.getUserWear().subscribe(res => {
      expect(res[0].position).toBe('front');
      expect(res[0].kmSinceInstall).toBe(3200);
      expect(res[0].wearPercentage).toBe(64);
      expect(res[0].installDate).toBeInstanceOf(Date);
    });
    expect(apiService.get).toHaveBeenCalledWith('/wear');
  });

  it('getTerrainStats() should call /tires/terrain-stats', () => {
    apiService.get.mockReturnValue(of([]));
    service.getTerrainStats().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/tires/terrain-stats');
  });

  it('getTerrainStatsByTire() should call /tires/:id/terrain-stats', () => {
    apiService.get.mockReturnValue(of({
      id: 's1', tireRef: 'power-road', tireName: 'Power Road', tireId: 't1',
      mountain: 8, coastal: 7, plain: 9, wet: 6, avgRating: 7.5, totalKmAnalyzed: 50000, avgPunctureRate: 0.02,
    }));
    service.getTerrainStatsByTire('t1').subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/tires/t1/terrain-stats');
  });

  it('getBenchmarkData() should split tires into michelin and competitors', () => {
    const backendCompetitor = { ...mockBackendTire, id: 't2', brand: 'Concurrent', reference: 'comp-road' };
    apiService.get.mockReturnValue(of([mockBackendTire, backendCompetitor]));
    service.getBenchmarkData().subscribe(res => {
      expect(res.michelin.brand).toBe('Michelin');
      expect(res.competitors.length).toBe(1);
      expect(res.competitors[0].brand).toBe('Concurrent');
    });
  });
});
