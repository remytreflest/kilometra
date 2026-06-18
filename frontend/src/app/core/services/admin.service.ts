import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RegionMichelinCoverage, TireTerrainPerf, AdminKpi } from '../../shared/models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}

  getRegionCoverage(): Observable<RegionMichelinCoverage[]> {
    return this.api.get<RegionMichelinCoverage[]>('/admin/regions');
  }

  getUndercoveredRegions(): Observable<RegionMichelinCoverage[]> {
    return this.api.get<RegionMichelinCoverage[]>('/admin/regions/undercovered');
  }

  getTireTerrainPerformance(): Observable<TireTerrainPerf[]> {
    return this.api.get<TireTerrainPerf[]>('/admin/tires/terrain-performance');
  }

  getBestTireForTerrain(terrain: 'mountain' | 'coastal' | 'plain' | 'wet'): Observable<TireTerrainPerf> {
    return this.api.get<TireTerrainPerf>('/admin/tires/terrain-performance/best', { terrain });
  }

  getKpis(): Observable<AdminKpi[]> {
    return this.api.get<AdminKpi[]>('/admin/kpis');
  }
}
