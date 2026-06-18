import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TireWearCardComponent } from './tire-wear-card.component';
import { TireWear, Tire } from '../../models/tire.model';

const mockTire: Tire = {
  id: 'm2',
  reference: 'Power Road TLR',
  name: 'Michelin Power Road TLR',
  brand: 'Michelin',
  category: 'route',
  scores: { grip: 9, energyReturn: 8, comfort: 7, punctureResistance: 8, durability: 7 },
  avgScore: 7.8,
  communityKm: 100000,
  punctureReductionPct: 31,
  recommendedFor: [],
};

function makeWear(wearPercentage: number, position: 'front' | 'rear' = 'front'): TireWear {
  return {
    tire: mockTire,
    position,
    kmSinceInstall: 3200,
    wearPercentage,
    estimatedDaysLeft: 22,
    installDate: new Date('2023-09-01'),
  };
}

describe('TireWearCardComponent', () => {
  let fixture: ComponentFixture<TireWearCardComponent>;
  let component: TireWearCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TireWearCardComponent],
    })
      .overrideComponent(TireWearCardComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TireWearCardComponent);
    component = fixture.componentInstance;
    component.wear = makeWear(50);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should accept wear input', () => {
    expect(component.wear).toEqual(makeWear(50));
  });

  it('urgencyVariant should return "success" when wearPercentage < 60', () => {
    component.wear = makeWear(59);
    expect(component.urgencyVariant).toBe('success');
  });

  it('urgencyVariant should return "warning" when wearPercentage is 60–79', () => {
    component.wear = makeWear(60);
    expect(component.urgencyVariant).toBe('warning');

    component.wear = makeWear(79);
    expect(component.urgencyVariant).toBe('warning');
  });

  it('urgencyVariant should return "danger" when wearPercentage >= 80', () => {
    component.wear = makeWear(80);
    expect(component.urgencyVariant).toBe('danger');

    component.wear = makeWear(100);
    expect(component.urgencyVariant).toBe('danger');
  });

  it('should accept rear position', () => {
    component.wear = makeWear(45, 'rear');
    expect(component.wear.position).toBe('rear');
  });
});
