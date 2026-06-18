import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiCardComponent } from './kpi-card.component';

describe('KpiCardComponent', () => {
  let fixture: ComponentFixture<KpiCardComponent>;
  let component: KpiCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCardComponent],
    })
      .overrideComponent(KpiCardComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(KpiCardComponent);
    component = fixture.componentInstance;
    component.value = 720;
    component.label = 'Score MPI';
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should accept required inputs', () => {
    expect(component.value).toBe(720);
    expect(component.label).toBe('Score MPI');
  });

  it('should accept a string value', () => {
    component.value = '25 000 km';
    expect(component.value).toBe('25 000 km');
  });

  it('should default deltaPositive to true', () => {
    expect(component.deltaPositive).toBe(true);
  });

  it('should accept optional delta input', () => {
    component.delta = '+35 pts';
    expect(component.delta).toBe('+35 pts');
  });

  it('should accept optional note input', () => {
    component.note = 'Depuis 30 jours';
    expect(component.note).toBe('Depuis 30 jours');
  });

  it('should accept deltaPositive = false', () => {
    component.deltaPositive = false;
    expect(component.deltaPositive).toBe(false);
  });
});
