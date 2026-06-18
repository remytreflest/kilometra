import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealerCardComponent } from './dealer-card.component';
import { Dealer } from '../../models/dealer.model';

const mockDealer: Dealer = {
  id: 'd1',
  name: 'Velo Pro Shop',
  address: '12 rue de la Paix',
  city: 'Lyon',
  postalCode: '69001',
  distanceKm: 2.4,
  isOpen: true,
  closingTime: '19:00',
  openingTime: '09:00',
  acceptsCoupon: true,
  stockStatus: 'available',
  phone: '04 00 00 00 00',
  lat: 45.75,
  lng: 4.83,
};

describe('DealerCardComponent', () => {
  let fixture: ComponentFixture<DealerCardComponent>;
  let component: DealerCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerCardComponent],
    })
      .overrideComponent(DealerCardComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DealerCardComponent);
    component = fixture.componentInstance;
    component.dealer = mockDealer;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should accept dealer input', () => {
    expect(component.dealer).toEqual(mockDealer);
  });

  it('should accept a dealer that does not accept coupon', () => {
    component.dealer = { ...mockDealer, acceptsCoupon: false };
    fixture.detectChanges();
    expect(component.dealer.acceptsCoupon).toBe(false);
  });

  it('should accept a closed dealer', () => {
    component.dealer = { ...mockDealer, isOpen: false };
    fixture.detectChanges();
    expect(component.dealer.isOpen).toBe(false);
  });

  it('should accept all stock statuses', () => {
    (['available', 'limited', 'order'] as const).forEach(status => {
      component.dealer = { ...mockDealer, stockStatus: status };
      fixture.detectChanges();
      expect(component.dealer.stockStatus).toBe(status);
    });
  });
});
