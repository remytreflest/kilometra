import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { ProfilComponent } from './profil.component';
import { UserService } from '../../core/services/user.service';
import { PerformanceService } from '../../core/services/performance.service';
import { UserProfile } from '../../shared/models/user.model';
import { PerformanceIndex } from '../../shared/models/performance.model';

const mockUser: UserProfile = {
  id: 'u1', firstName: 'Camille', lastName: 'Dubreuil', initials: 'CD',
  club: 'Velo Club Lyon', memberSince: new Date('2022-03-15'),
  level: 'Competiteur Expert', stravaConnected: true,
  badges: [
    { id: 'b1', label: '1000 km',    icon: 'star',         color: '#FCE500', unlocked: true  },
    { id: 'b2', label: '5000 km',    icon: 'emoji_events', color: '#27509B', unlocked: false },
  ],
  rewards: [
    { id: 'rw1', title: 'Coupon 50%', description: '-50% sur un train de pneus',
      validUntil: new Date('2025-12-31'), couponCode: 'MICH-50', type: 'coupon' },
  ],
};

const mockPerf: PerformanceIndex = {
  score: 720, level: 'Competiteur Expert', monthlyDelta: 35,
  weeklyKm: 180, nationalRank: 412, percentileBeat: 88,
  history: [
    { month: 'Jan', score: 640 },
    { month: 'Fev', score: 660 },
    { month: 'Mar', score: 720 },
  ],
};

describe('ProfilComponent', () => {
  let fixture: ComponentFixture<ProfilComponent>;
  let component: ProfilComponent;
  let userService: any;
  let perfService: any;

  beforeEach(async () => {
    userService = { getProfile: jest.fn().mockReturnValue(of(mockUser)) };
    perfService = { getIndex:   jest.fn().mockReturnValue(of(mockPerf)) };

    await TestBed.configureTestingModule({
      imports: [ProfilComponent],
      providers: [
        { provide: UserService,        useValue: userService },
        { provide: PerformanceService, useValue: perfService },
      ],
    })
      .overrideComponent(ProfilComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call service methods on init', () => {
    fixture.detectChanges();
    expect(userService.getProfile).toHaveBeenCalled();
    expect(perfService.getIndex).toHaveBeenCalled();
  });

  it('should populate user and perf after init', () => {
    fixture.detectChanges();
    expect(component.user).toEqual(mockUser);
    expect(component.perf).toEqual(mockPerf);
  });

  it('should build chartLabels from perf.history months', () => {
    fixture.detectChanges();
    expect(component.chartLabels).toEqual(['Jan', 'Fev', 'Mar']);
  });

  it('should build chartDatasets with MPI scores from history', () => {
    fixture.detectChanges();
    expect(component.chartDatasets.length).toBe(1);
    expect(component.chartDatasets[0].label).toBe('MPI');
    expect(component.chartDatasets[0].data).toEqual([640, 660, 720]);
  });

  it('should start with null state before init', () => {
    expect(component.user).toBeNull();
    expect(component.perf).toBeNull();
    expect(component.chartLabels.length).toBe(0);
  });
});
