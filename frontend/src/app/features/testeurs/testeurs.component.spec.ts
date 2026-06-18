import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { TesteursComponent } from './testeurs.component';
import { TesterService } from '../../core/services/tester.service';
import { TesterProgress, TesterReward } from '../../shared/models/tester.model';

const mockRewards: TesterReward[] = [
  { id: 'rw1', title: 'Coupon -50%', description: 'Remise sur un train de pneus', requiredKm: 1000, status: 'unlocked',     icon: 'local_offer', couponCode: 'MICH-50' },
  { id: 'rw2', title: 'Acces Labs',  description: 'Acces aux prototypes',          requiredKm: 3000, status: 'in-progress',  icon: 'science',     progressPct: 64 },
  { id: 'rw3', title: 'Prototype',   description: 'Pneu en avant-premiere',        requiredKm: 5000, status: 'locked',       icon: 'lock' },
];

const mockTester: TesterProgress = {
  currentKm: 3200,
  nextMilestoneKm: 5000,
  progressPct: 64,
  rewards: mockRewards,
  couponCode: 'MICH-50',
  couponExpiry: new Date('2025-12-31'),
  totalTesters: 1800,
  rank: 42,
};

describe('TesteursComponent', () => {
  let fixture: ComponentFixture<TesteursComponent>;
  let component: TesteursComponent;
  let testerService: any;

  beforeEach(async () => {
    testerService = {
      getProgress: jest.fn().mockReturnValue(of(mockTester)),
    };

    await TestBed.configureTestingModule({
      imports: [TesteursComponent],
      providers: [{ provide: TesterService, useValue: testerService }],
    })
      .overrideComponent(TesteursComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TesteursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getProgress on init', () => {
    fixture.detectChanges();
    expect(testerService.getProgress).toHaveBeenCalled();
  });

  it('should populate tester after init', () => {
    fixture.detectChanges();
    expect(component.tester).toEqual(mockTester);
  });

  it('should start with null tester before init', () => {
    expect(component.tester).toBeNull();
  });

  it('should expose all rewards via tester.rewards', () => {
    fixture.detectChanges();
    expect(component.tester!.rewards.length).toBe(3);
  });

  it('should expose the correct progressPct', () => {
    fixture.detectChanges();
    expect(component.tester!.progressPct).toBe(64);
  });

  it('should expose the coupon code', () => {
    fixture.detectChanges();
    expect(component.tester!.couponCode).toBe('MICH-50');
  });
});
