import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { BenchmarkComponent } from './benchmark.component';
import { TireService } from '../../core/services/tire.service';
import { Tire } from '../../shared/models/tire.model';

const mockMichelin: Tire = {
  id: 'm1',
  reference: 'Power Road TLR',
  name: 'Michelin Power Road TLR',
  brand: 'Michelin',
  category: 'route',
  scores: { grip: 9, energyReturn: 8, comfort: 7, punctureResistance: 8, durability: 7 },
  avgScore: 7.8,
  communityKm: 100000,
  punctureReductionPct: 31,
  recommendedFor: ['Competiteur Expert'],
};

const mockCompetitors: Tire[] = [
  {
    id: 'c1',
    reference: 'Concurrent A',
    name: 'Concurrent A Pro',
    brand: 'Concurrent',
    category: 'route',
    scores: { grip: 7, energyReturn: 6, comfort: 8, punctureResistance: 5, durability: 6 },
    avgScore: 6.4,
    communityKm: 40000,
    punctureReductionPct: 15,
    recommendedFor: [],
  },
];

describe('BenchmarkComponent', () => {
  let fixture: ComponentFixture<BenchmarkComponent>;
  let component: BenchmarkComponent;
  let tireService: any;

  beforeEach(async () => {
    tireService = {
      getBenchmarkData: jest.fn().mockReturnValue(
        of({ michelin: mockMichelin, competitors: mockCompetitors })
      ),
    };

    await TestBed.configureTestingModule({
      imports: [BenchmarkComponent],
      providers: [{ provide: TireService, useValue: tireService }],
    })
      .overrideComponent(BenchmarkComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BenchmarkComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getBenchmarkData on init', () => {
    fixture.detectChanges();
    expect(tireService.getBenchmarkData).toHaveBeenCalled();
  });

  it('should populate michelin and competitors after init', () => {
    fixture.detectChanges();
    expect(component.michelin).toEqual(mockMichelin);
    expect(component.competitors.length).toBe(1);
    expect(component.competitors[0]).toEqual(mockCompetitors[0]);
  });

  it('should build radarDatasets with michelin as first dataset', () => {
    fixture.detectChanges();
    expect(component.radarDatasets.length).toBe(2);
    expect(component.radarDatasets[0].label).toBe('Power Road TLR');
  });

  it('should build tableRows for all 5 criteria', () => {
    fixture.detectChanges();
    expect(component.tableRows.length).toBe(5);
    expect(component.tableRows[0].michelin).toBe(mockMichelin.scores.grip);
  });

  it('should build displayedColumns with critere, michelin and competitor columns', () => {
    fixture.detectChanges();
    expect(component.displayedColumns).toContain('critere');
    expect(component.displayedColumns).toContain('michelin');
    expect(component.displayedColumns).toContain('comp0');
  });

  it('onFilterChange() should update activeFilter', () => {
    fixture.detectChanges();
    component.onFilterChange('route');
    expect(component.activeFilter).toBe('route');
  });

  it('should initialise activeFilter to "all"', () => {
    expect(component.activeFilter).toBe('all');
  });

  it('should expose 5 radar labels', () => {
    expect(component.radarLabels.length).toBe(5);
  });
});
