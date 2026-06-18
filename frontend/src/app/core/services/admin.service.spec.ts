import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminService } from './admin.service';
import { ApiService } from './api.service';

describe('AdminService', () => {
  let service: AdminService;
  let apiService: any;

  beforeEach(() => {
    apiService = { get: jest.fn().mockReturnValue(of([])) };
    TestBed.configureTestingModule({
      providers: [AdminService, { provide: ApiService, useValue: apiService }],
    });
    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRegionCoverage() should call /admin/regions', () => {
    service.getRegionCoverage().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/admin/regions');
  });

  it('getUndercoveredRegions() should call /admin/regions/undercovered', () => {
    service.getUndercoveredRegions().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/admin/regions/undercovered');
  });

  it('getTireTerrainPerformance() should call /admin/tires/terrain-performance', () => {
    service.getTireTerrainPerformance().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/admin/tires/terrain-performance');
  });

  it('getBestTireForTerrain() should call with terrain query param', () => {
    service.getBestTireForTerrain('mountain').subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/admin/tires/terrain-performance/best', { terrain: 'mountain' });
  });

  it('getBestTireForTerrain() should accept all valid terrain values', () => {
    (['mountain', 'coastal', 'plain', 'wet'] as const).forEach(terrain => {
      service.getBestTireForTerrain(terrain).subscribe();
      expect(apiService.get).toHaveBeenCalledWith('/admin/tires/terrain-performance/best', { terrain });
    });
  });

  it('getKpis() should call /admin/kpis', () => {
    service.getKpis().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/admin/kpis');
  });
});
