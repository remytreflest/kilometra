import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressTrackComponent, ProgressVariant } from './progress-track.component';

describe('ProgressTrackComponent', () => {
  let fixture: ComponentFixture<ProgressTrackComponent>;
  let component: ProgressTrackComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressTrackComponent],
    })
      .overrideComponent(ProgressTrackComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProgressTrackComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default value to 0', () => {
    expect(component.value).toBe(0);
  });

  it('should default variant to "blue"', () => {
    expect(component.variant).toBe('blue');
  });

  it('should default height to 8', () => {
    expect(component.height).toBe(8);
  });

  it('should default tread to false', () => {
    expect(component.tread).toBe(false);
  });

  it('should accept a custom value', () => {
    component.value = 64;
    expect(component.value).toBe(64);
  });

  const variants: ProgressVariant[] = ['blue', 'yellow', 'green', 'red'];
  variants.forEach(variant => {
    it(`should accept variant "${variant}"`, () => {
      component.variant = variant;
      expect(component.variant).toBe(variant);
    });
  });

  it('should accept tread = true', () => {
    component.tread = true;
    expect(component.tread).toBe(true);
  });

  it('should accept a custom height', () => {
    component.height = 14;
    expect(component.height).toBe(14);
  });
});
