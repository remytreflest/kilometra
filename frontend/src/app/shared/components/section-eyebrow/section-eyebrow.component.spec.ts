import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectionEyebrowComponent } from './section-eyebrow.component';

describe('SectionEyebrowComponent', () => {
  let fixture: ComponentFixture<SectionEyebrowComponent>;
  let component: SectionEyebrowComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionEyebrowComponent],
    })
      .overrideComponent(SectionEyebrowComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SectionEyebrowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default onDark to false', () => {
    expect(component.onDark).toBe(false);
  });

  it('should accept onDark = true', () => {
    component.onDark = true;
    expect(component.onDark).toBe(true);
  });

  it('should render the eyebrow element', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.eyebrow')).toBeTruthy();
  });

  it('should not have "on-dark" class by default', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.eyebrow')?.classList.contains('on-dark')).toBe(false);
  });

  it('should apply "on-dark" class when onDark is true', () => {
    component.onDark = true;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.eyebrow')?.classList.contains('on-dark')).toBe(true);
  });
});
