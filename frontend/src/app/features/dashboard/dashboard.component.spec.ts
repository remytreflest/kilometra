import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { PerformanceService } from '../../core/services/performance.service';
import { TireService } from '../../core/services/tire.service';
import { ActivityService } from '../../core/services/activity.service';
import { TesterService } from '../../core/services/tester.service';
import { PerformanceIndex } from '../../shared/models/performance.model';
import { Tire, TireWear } from '../../shared/models/tire.model';
import { Activity } from '../../shared/models/activity.model';
import { TesterProgress } from '../../shared/models/tester.model';

const mockPerf: PerformanceIndex = {
  score: 720, level: 'Competiteur Expert', monthlyDelta: 35,
  weeklyKm: 180, nationalRank: 412, percentileBeat: 88,
  history: [{ month: 'Jan', score: 680 }, { month: 'Fev', score: 720 }],
};

const mockTire: Tire = {
  id: 'm2', reference: 'Power Road TLR', name: 'Michelin Power Road TLR', brand: 'Michelin',
  category: 'route', scores: { grip: 9, energyReturn: 8, comfort: 7, punctureResistance: 8, durability: 7 },
  avgScore: 7.8, communityKm: 100000, punctureReductionPct: 31, recommendedFor: [],
};

const mockWear: TireWear = {
  tire: mockTire, position: 'front', kmSinceInstall: 3200, wearPercentage: 64,
  estimatedDaysLeft: 22, installDate: new Date('2023-09-01'),
};

const mockActivity: Activity = {
  id: 'a1', name: 'Sortie matinale', date: new Date('2024-04-10'),
  distanceKm: 45, elevationM: 620, avgSpeedKmh: 28, maxSpeedKmh: 52,
  durationMin: 96, type: 'route', location: 'Lyon', mpiImpact: 12,
};

const mockTester: TesterProgress = {
  currentKm: 3200, nextMilestoneKm: 5000, progressPct: 64,
  rewards: [], couponCode: 'MICH-50', couponExpiry: new Date('2025-12-31'),
  totalTesters: 1800, rank: 42,
};

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let perfService: any;
  let tireService: any;
  let activityService: any;
  let testerService: any;

  beforeEach(async () => {
    perfService     = { getIndex: jest.fn().mockReturnValue(of(mockPerf)) };
    tireService     = {
      getUserWear:  jest.fn().mockReturnValue(of([mockWear])),
      getTireById:  jest.fn().mockReturnValue(of(mockTire)),
    };
    activityService = { getRecentActivities: jest.fn().mockReturnValue(of([mockActivity])) };
    testerService   = { getProgress: jest.fn().mockReturnValue(of(mockTester)) };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: PerformanceService, useValue: perfService },
        { provide: TireService,        useValue: tireService },
        { provide: ActivityService,    useValue: activityService },
        { provide: TesterService,      useValue: testerService },
      ],
    })
      .overrideComponent(DashboardComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call all services on init', () => {
    fixture.detectChanges();
    expect(perfService.getIndex).toHaveBeenCalled();
    expect(tireService.getUserWear).toHaveBeenCalled();
    expect(activityService.getRecentActivities).toHaveBeenCalledWith(3);
    expect(testerService.getProgress).toHaveBeenCalled();
    expect(tireService.getTireById).toHaveBeenCalledWith('m2');
  });

  it('should populate state after init', () => {
    fixture.detectChanges();
    expect(component.perf).toEqual(mockPerf);
    expect(component.wears).toEqual([mockWear]);
    expect(component.activities).toEqual([mockActivity]);
    expect(component.tester).toEqual(mockTester);
    expect(component.recoTire).toEqual(mockTire);
  });

  it('should start with null state before init', () => {
    expect(component.perf).toBeNull();
    expect(component.recoTire).toBeNull();
    expect(component.wears.length).toBe(0);
    expect(component.activities.length).toBe(0);
  });
});
