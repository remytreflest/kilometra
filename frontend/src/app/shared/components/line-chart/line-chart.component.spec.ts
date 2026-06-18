import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineChartComponent, LineDataset } from './line-chart.component';

const mockLabels = ['Jan', 'Fév', 'Mar'];
const mockDatasets: LineDataset[] = [
  { label: 'MPI', data: [650, 680, 720], color: '#27509B' },
];

describe('LineChartComponent', () => {
  let fixture: ComponentFixture<LineChartComponent>;
  let component: LineChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
    })
      .overrideComponent(LineChartComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
    component.labels = mockLabels;
    component.datasets = mockDatasets;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default yLabel to "Score"', () => {
    expect(component.yLabel).toBe('Score');
  });

  it('should default labels to empty array', () => {
    const fresh = TestBed.createComponent(LineChartComponent);
    expect(fresh.componentInstance.labels).toEqual([]);
  });

  it('should default datasets to empty array', () => {
    const fresh = TestBed.createComponent(LineChartComponent);
    expect(fresh.componentInstance.datasets).toEqual([]);
  });

  it('should build chartData on init', () => {
    fixture.detectChanges();
    expect(component.chartData.labels).toEqual(mockLabels);
    expect(component.chartData.datasets).toHaveLength(1);
  });

  it('should map datasets to chartData correctly', () => {
    fixture.detectChanges();
    const ds = component.chartData.datasets[0];
    expect(ds.label).toBe('MPI');
    expect(ds.data).toEqual([650, 680, 720]);
    expect(ds.borderColor).toBe('#27509B');
  });

  it('should rebuild chartData on changes', () => {
    fixture.detectChanges();
    component.datasets = [{ label: 'Autre', data: [100, 200], color: '#FF0000' }];
    component.ngOnChanges();
    expect(component.chartData.datasets[0].label).toBe('Autre');
  });
});
