import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreadlineComponent } from './treadline.component';

describe('TreadlineComponent', () => {
  let fixture: ComponentFixture<TreadlineComponent>;
  let component: TreadlineComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreadlineComponent],
    })
      .overrideComponent(TreadlineComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TreadlineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default thin to false', () => {
    expect(component.thin).toBe(false);
  });

  it('should default maxWidth to "100%"', () => {
    expect(component.maxWidth).toBe('100%');
  });

  it('should accept thin = true', () => {
    component.thin = true;
    expect(component.thin).toBe(true);
  });

  it('should accept a custom maxWidth', () => {
    component.maxWidth = '200px';
    expect(component.maxWidth).toBe('200px');
  });

  it('should render the treadline element', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.treadline')).toBeTruthy();
  });

  it('should apply "thin" class when thin is true', () => {
    component.thin = true;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.treadline')?.classList.contains('thin')).toBe(true);
  });

  it('should not have "thin" class by default', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.treadline')?.classList.contains('thin')).toBe(false);
  });
});
