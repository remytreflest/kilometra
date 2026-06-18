import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityCardComponent } from './activity-card.component';
import { Activity } from '../../models/activity.model';

const mockActivity: Activity = {
  id: 'a1',
  name: 'Sortie matinale',
  date: new Date('2024-04-10'),
  distanceKm: 45,
  elevationM: 620,
  avgSpeedKmh: 28,
  maxSpeedKmh: 52,
  durationMin: 96,
  type: 'route',
  location: 'Lyon',
  mpiImpact: 12,
};

describe('ActivityCardComponent', () => {
  let fixture: ComponentFixture<ActivityCardComponent>;
  let component: ActivityCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCardComponent],
    })
      .overrideComponent(ActivityCardComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ActivityCardComponent);
    component = fixture.componentInstance;
    component.activity = mockActivity;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should accept activity input', () => {
    expect(component.activity).toEqual(mockActivity);
  });

  it('typeIcon should return "directions_bike" for type "route"', () => {
    expect(component.typeIcon).toBe('directions_bike');
  });

  it('typeIcon should return "terrain" for type "vtt"', () => {
    component.activity = { ...mockActivity, type: 'vtt' };
    expect(component.typeIcon).toBe('terrain');
  });

  it('typeIcon should return "bolt" for type "fractionné"', () => {
    component.activity = { ...mockActivity, type: 'fractionné' };
    expect(component.typeIcon).toBe('bolt');
  });

  it('typeIcon should return "route" for type "sortie longue"', () => {
    component.activity = { ...mockActivity, type: 'sortie longue' };
    expect(component.typeIcon).toBe('route');
  });

  it('typeIcon should return "forest" for type "gravel"', () => {
    component.activity = { ...mockActivity, type: 'gravel' };
    expect(component.typeIcon).toBe('forest');
  });

  it('typeIcon should fallback to "directions_bike" for unknown type', () => {
    component.activity = { ...mockActivity, type: 'inconnu' as any };
    expect(component.typeIcon).toBe('directions_bike');
  });
});
