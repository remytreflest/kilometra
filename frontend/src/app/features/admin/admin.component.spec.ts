import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { AdminComponent } from './admin.component';
import { AdminService } from '../../core/services/admin.service';
import { AdminKpi, TireTerrainPerf, RegionMichelinCoverage } from '../../shared/models/admin.model';

const mockKpis: AdminKpi[] = [
  { label: 'Utilisateurs actifs', value: '25 000', icon: 'people', delta: '+8%', deltaPositive: true },
  { label: 'Km analysés', value: '1.8M', icon: 'route' },
];

const mockTerrainPerf: TireTerrainPerf[] = [
  { tireRef: 'p1', tireName: 'Power Road TLR', mountain: 8, coastal: 7, plain: 9, wet: 6, avgRating: 4.5, totalKmAnalyzed: 50000 },
  { tireRef: 'p2', tireName: 'Endurance',       mountain: 5, coastal: 9, plain: 7, wet: 8, avgRating: 4.2, totalKmAnalyzed: 30000 },
];

const mockRegions: RegionMichelinCoverage[] = [
  { region: 'Ile-de-France', department: '75', totalCyclists: 10000, michelinUsers: 6000, coveragePct: 60, growthPct: 5 },
  { region: 'Bretagne',      department: '29', totalCyclists: 5000,  michelinUsers: 1200, coveragePct: 24, growthPct: 2 },
];

describe('AdminComponent', () => {
  let fixture: ComponentFixture<AdminComponent>;
  let component: AdminComponent;
  let adminService: any;

  beforeEach(async () => {
    adminService = {
      getKpis:                   jest.fn().mockReturnValue(of(mockKpis)),
      getTireTerrainPerformance: jest.fn().mockReturnValue(of(mockTerrainPerf)),
      getRegionCoverage:         jest.fn().mockReturnValue(of(mockRegions)),
      getUndercoveredRegions:    jest.fn().mockReturnValue(of([mockRegions[1]])),
    };

    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [{ provide: AdminService, useValue: adminService }],
    })
      .overrideComponent(AdminComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call all service methods on init', () => {
    fixture.detectChanges();
    expect(adminService.getKpis).toHaveBeenCalled();
    expect(adminService.getTireTerrainPerformance).toHaveBeenCalled();
    expect(adminService.getRegionCoverage).toHaveBeenCalled();
    expect(adminService.getUndercoveredRegions).toHaveBeenCalled();
  });

  it('should populate state after init', () => {
    fixture.detectChanges();
    expect(component.kpis).toEqual(mockKpis);
    expect(component.terrainPerf).toEqual(mockTerrainPerf);
    expect(component.regionCoverage).toEqual(mockRegions);
    expect(component.undercovered).toEqual([mockRegions[1]]);
  });

  it('should compute maxScores after init', () => {
    fixture.detectChanges();
    expect(component.maxScores.mountain).toBe(8);
    expect(component.maxScores.coastal).toBe(9);
    expect(component.maxScores.plain).toBe(9);
    expect(component.maxScores.wet).toBe(8);
  });

  it('getBest() should return the tire with the highest score for the given terrain', () => {
    fixture.detectChanges();
    expect(component.getBest('mountain').tireName).toBe('Power Road TLR');
    expect(component.getBest('coastal').tireName).toBe('Endurance');
  });

  it('should initialise terrainColumns with the expected columns', () => {
    expect(component.terrainColumns).toEqual(['pneu', 'montagne', 'cotier', 'plaine', 'pluie', 'note', 'km']);
  });
});
