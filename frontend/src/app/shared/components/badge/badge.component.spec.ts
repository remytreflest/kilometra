import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BadgeComponent, BadgeVariant } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;
  let component: BadgeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    })
      .overrideComponent(BadgeComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default variant to "blue"', () => {
    expect(component.variant).toBe('blue');
  });

  it('should accept a custom variant input', () => {
    component.variant = 'success';
    expect(component.variant).toBe('success');
  });

  const variants: BadgeVariant[] = ['blue', 'yellow', 'success', 'warning', 'danger', 'dark', 'grey'];
  variants.forEach(variant => {
    it(`should accept variant "${variant}"`, () => {
      component.variant = variant;
      fixture.detectChanges();
      expect(component.variant).toBe(variant);
    });
  });
});
