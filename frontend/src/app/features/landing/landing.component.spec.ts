import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { LandingComponent } from './landing.component';
import { AuthService } from '../../core/services/auth.service';
import { PerformanceService } from '../../core/services/performance.service';
import { TesterService } from '../../core/services/tester.service';
import { PerformanceIndex } from '../../shared/models/performance.model';
import { TesterProgress } from '../../shared/models/tester.model';

const mockPerf: PerformanceIndex = {
  score: 680, level: 'Expert', monthlyDelta: 28,
  weeklyKm: 140, nationalRank: 850, percentileBeat: 79,
  history: [{ month: 'Jan', score: 650 }, { month: 'Fev', score: 680 }],
};

const mockTester: TesterProgress = {
  currentKm: 2400, nextMilestoneKm: 5000, progressPct: 48,
  rewards: [], couponCode: 'MICH-50', couponExpiry: new Date('2025-12-31'),
  totalTesters: 1800, rank: 87,
};

const mockCommunity = { totalCyclists: 25000, clubs: 320, totalKm: 1800000 };

describe('LandingComponent', () => {
  let fixture: ComponentFixture<LandingComponent>;
  let component: LandingComponent;
  let perfService: any;
  let testerService: any;
  let authService: any;

  beforeEach(async () => {
    perfService = {
      getIndex:         jest.fn().mockReturnValue(of(mockPerf)),
      getCommunityKpis: jest.fn().mockReturnValue(of(mockCommunity)),
    };
    testerService = {
      getProgress: jest.fn().mockReturnValue(of(mockTester)),
    };
    authService = {
      isLoggedIn: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        { provide: AuthService,        useValue: authService },
        { provide: PerformanceService, useValue: perfService },
        { provide: TesterService,      useValue: testerService },
      ],
    })
      .overrideComponent(LandingComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call all service methods on init', () => {
    component.ngOnInit();
    expect(perfService.getIndex).toHaveBeenCalled();
    expect(perfService.getCommunityKpis).toHaveBeenCalled();
    expect(testerService.getProgress).toHaveBeenCalled();
  });

  it('should populate perf, tester and community after init', () => {
    component.ngOnInit();
    expect(component.perf).toEqual(mockPerf);
    expect(component.tester).toEqual(mockTester);
    expect(component.community).toEqual(mockCommunity);
  });

  it('should start with null state before init', () => {
    expect(component.perf).toBeNull();
    expect(component.tester).toBeNull();
    expect(component.community).toBeNull();
  });
});
