import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponCardComponent } from './coupon-card.component';

describe('CouponCardComponent', () => {
  let fixture: ComponentFixture<CouponCardComponent>;
  let component: CouponCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponCardComponent],
    })
      .overrideComponent(CouponCardComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CouponCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default code to "MICHELIN50"', () => {
    expect(component.code).toBe('MICHELIN50');
  });

  it('should accept a custom code input', () => {
    component.code = 'MICH-50';
    fixture.detectChanges();
    expect(component.code).toBe('MICH-50');
  });
});
