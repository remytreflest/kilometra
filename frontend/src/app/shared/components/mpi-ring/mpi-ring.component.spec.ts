import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleChange } from '@angular/core';

import { MpiRingComponent } from './mpi-ring.component';

describe('MpiRingComponent', () => {
  let fixture: ComponentFixture<MpiRingComponent>;
  let component: MpiRingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpiRingComponent],
    })
      .overrideComponent(MpiRingComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MpiRingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default score to 0', () => {
    expect(component.score).toBe(0);
  });

  it('should default size to 140', () => {
    expect(component.size).toBe(140);
  });

  it('should default strokeWidth to 12', () => {
    expect(component.strokeWidth).toBe(12);
  });

  it('should compute cx/cy/r from size on changes', () => {
    component.size = 200;
    component.strokeWidth = 10;
    component.ngOnChanges();
    expect(component.cx).toBe(100);
    expect(component.cy).toBe(100);
    expect(component.r).toBe(90);
  });

  it('should compute circumference = 2 * PI * r', () => {
    component.size = 140;
    component.strokeWidth = 12;
    component.ngOnChanges();
    const expectedR = 70 - 12;
    expect(component.circumference).toBeCloseTo(2 * Math.PI * expectedR, 5);
  });

  it('should compute dashOffset = 0 for score 1000', () => {
    component.score = 1000;
    component.size = 140;
    component.strokeWidth = 12;
    component.ngOnChanges();
    expect(component.dashOffset).toBeCloseTo(0, 5);
  });

  it('should compute dashOffset = circumference for score 0', () => {
    component.score = 0;
    component.size = 140;
    component.strokeWidth = 12;
    component.ngOnChanges();
    expect(component.dashOffset).toBeCloseTo(component.circumference, 5);
  });

  it('should clamp score above 1000', () => {
    component.score = 1500;
    component.size = 140;
    component.strokeWidth = 12;
    component.ngOnChanges();
    expect(component.dashOffset).toBeCloseTo(0, 5);
  });

  it('should clamp score below 0', () => {
    component.score = -100;
    component.size = 140;
    component.strokeWidth = 12;
    component.ngOnChanges();
    expect(component.dashOffset).toBeCloseTo(component.circumference, 5);
  });
});
