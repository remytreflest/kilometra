import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RewardCardComponent } from './reward-card.component';
import { TesterReward } from '../../models/tester.model';

const unlockedReward: TesterReward = {
  id: 'rw1',
  title: 'Coupon −50%',
  description: 'Offre sur votre prochain train de pneus',
  requiredKm: 2000,
  status: 'unlocked',
  icon: 'local_offer',
  couponCode: 'MICH-50',
};

const inProgressReward: TesterReward = {
  id: 'rw2',
  title: 'Badge Expert',
  description: 'Complétez 5 000 km en test',
  requiredKm: 5000,
  status: 'in-progress',
  icon: 'emoji_events',
  progressPct: 64,
};

const lockedReward: TesterReward = {
  id: 'rw3',
  title: 'Accès VIP',
  description: 'Accès aux produits en avant-première',
  requiredKm: 10000,
  status: 'locked',
  icon: 'star',
};

describe('RewardCardComponent', () => {
  let fixture: ComponentFixture<RewardCardComponent>;
  let component: RewardCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardCardComponent],
    })
      .overrideComponent(RewardCardComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RewardCardComponent);
    component = fixture.componentInstance;
  });

  it('should create with an unlocked reward', () => {
    component.reward = unlockedReward;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should accept an unlocked reward with couponCode', () => {
    component.reward = unlockedReward;
    expect(component.reward.status).toBe('unlocked');
    expect(component.reward.couponCode).toBe('MICH-50');
  });

  it('should accept an in-progress reward with progressPct', () => {
    component.reward = inProgressReward;
    expect(component.reward.status).toBe('in-progress');
    expect(component.reward.progressPct).toBe(64);
  });

  it('should accept a locked reward', () => {
    component.reward = lockedReward;
    expect(component.reward.status).toBe('locked');
    expect(component.reward.progressPct).toBeUndefined();
  });
});
