import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RadarChartComponent, RadarDataset } from './radar-chart.component';

const mockLabels = ['Adhérence', 'Rendement', 'Confort', 'Anti-crevaison', 'Durabilité'];
const mockDatasets: RadarDataset[] = [
  { label: 'Power Road TLR', data: [9, 8, 7, 8, 7], color: '#27509B' },
  { label: 'Concurrent', data: [7, 6, 8, 6, 8], color: '#9DA1A8' },
];

describe('RadarChartComponent', () => {
  let fixture: ComponentFixture<RadarChartComponent>;
  let component: RadarChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadarChartComponent],
    })
      .overrideComponent(RadarChartComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RadarChartComponent);
    component = fixture.componentInstance;
    component.labels = mockLabels;
    component.datasets = mockDatasets;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default datasets to empty array', () => {
    const fresh = TestBed.createComponent(RadarChartComponent);
    expect(fresh.componentInstance.datasets).toEqual([]);
  });

  it('should have default labels', () => {
    const fresh = TestBed.createComponent(RadarChartComponent);
    expect(fresh.componentInstance.labels).toHaveLength(5);
  });

  it('should build chartData on init', () => {
    fixture.detectChanges();
    expect(component.chartData.labels).toEqual(mockLabels);
    expect(component.chartData.datasets).toHaveLength(2);
  });

  it('should map datasets to chartData correctly', () => {
    fixture.detectChanges();
    const ds = component.chartData.datasets[0];
    expect(ds.label).toBe('Power Road TLR');
    expect(ds.data).toEqual([9, 8, 7, 8, 7]);
    expect(ds.borderColor).toBe('#27509B');
  });

  it('should rebuild chartData on changes', () => {
    fixture.detectChanges();
    component.datasets = [{ label: 'Nouveau', data: [5, 5, 5, 5, 5], color: '#FF0000' }];
    component.ngOnChanges();
    expect(component.chartData.datasets).toHaveLength(1);
    expect(component.chartData.datasets[0].label).toBe('Nouveau');
  });
});
