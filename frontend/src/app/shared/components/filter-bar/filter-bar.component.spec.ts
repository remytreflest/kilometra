import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterBarComponent, FilterChip } from './filter-bar.component';

const mockChips: FilterChip[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Route', value: 'route' },
  { label: 'VTT', value: 'vtt' },
];

describe('FilterBarComponent', () => {
  let fixture: ComponentFixture<FilterBarComponent>;
  let component: FilterBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBarComponent],
    })
      .overrideComponent(FilterBarComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
    component.chips = mockChips;
    component.activeValue = 'all';
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default activeValue to empty string', () => {
    const fresh = TestBed.createComponent(FilterBarComponent);
    expect(fresh.componentInstance.activeValue).toBe('');
  });

  it('should default ariaLabel to "Filtres"', () => {
    expect(component.ariaLabel).toBe('Filtres');
  });

  it('should accept chips input', () => {
    expect(component.chips).toEqual(mockChips);
  });

  it('select() should update activeValue', () => {
    component.select('route');
    expect(component.activeValue).toBe('route');
  });

  it('select() should emit filterChange with the selected value', () => {
    const emitted: string[] = [];
    component.filterChange.subscribe((v: string) => emitted.push(v));

    component.select('vtt');

    expect(emitted).toEqual(['vtt']);
  });

  it('select() should emit each time it is called', () => {
    const emitted: string[] = [];
    component.filterChange.subscribe((v: string) => emitted.push(v));

    component.select('route');
    component.select('all');

    expect(emitted).toEqual(['route', 'all']);
  });
});
