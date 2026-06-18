import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { RevendeursComponent } from './revendeurs.component';
import { DealerService } from '../../core/services/dealer.service';
import { Dealer } from '../../shared/models/dealer.model';

const mockDealers: Dealer[] = [
  {
    id: 'd1', name: 'Cycles Martin', address: '12 rue des Alpes', city: 'Lyon',
    postalCode: '69001', distanceKm: 1.2, isOpen: true, closingTime: '19:00',
    openingTime: '09:00', acceptsCoupon: true, stockStatus: 'available',
    phone: '04 12 34 56 78', lat: 45.74, lng: 4.83,
  },
  {
    id: 'd2', name: 'Vel Occitanie', address: '5 allee des Pins', city: 'Toulouse',
    postalCode: '31000', distanceKm: 3.8, isOpen: false, closingTime: '18:30',
    openingTime: '09:30', acceptsCoupon: false, stockStatus: 'limited',
    phone: '05 61 23 45 67', lat: 43.60, lng: 1.44,
  },
  {
    id: 'd3', name: 'Pedale Douce', address: '3 place Bellecour', city: 'Lyon',
    postalCode: '69002', distanceKm: 2.1, isOpen: true, closingTime: '20:00',
    openingTime: '10:00', acceptsCoupon: true, stockStatus: 'order',
    phone: '04 78 90 12 34', lat: 45.75, lng: 4.83,
  },
];

describe('RevendeursComponent', () => {
  let fixture: ComponentFixture<RevendeursComponent>;
  let component: RevendeursComponent;
  let dealerService: any;

  beforeEach(async () => {
    dealerService = {
      getNearbyDealers: jest.fn().mockReturnValue(of(mockDealers)),
    };

    await TestBed.configureTestingModule({
      imports: [RevendeursComponent],
      providers: [{ provide: DealerService, useValue: dealerService }],
    })
      .overrideComponent(RevendeursComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RevendeursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getNearbyDealers on init', () => {
    fixture.detectChanges();
    expect(dealerService.getNearbyDealers).toHaveBeenCalled();
  });

  it('should populate allDealers and filteredDealers with all dealers on init', () => {
    fixture.detectChanges();
    expect(component.allDealers.length).toBe(3);
    expect(component.filteredDealers.length).toBe(3);
  });

  it('should initialise activeFilter to "all"', () => {
    expect(component.activeFilter).toBe('all');
  });

  it('onFilterChange("coupon") should keep only dealers accepting coupons', () => {
    fixture.detectChanges();
    component.onFilterChange('coupon');
    expect(component.activeFilter).toBe('coupon');
    expect(component.filteredDealers.every(d => d.acceptsCoupon)).toBe(true);
    expect(component.filteredDealers.length).toBe(2);
  });

  it('onFilterChange("open") should keep only open dealers', () => {
    fixture.detectChanges();
    component.onFilterChange('open');
    expect(component.filteredDealers.every(d => d.isOpen)).toBe(true);
    expect(component.filteredDealers.length).toBe(2);
  });

  it('onFilterChange("available") should keep only dealers with available stock', () => {
    fixture.detectChanges();
    component.onFilterChange('available');
    expect(component.filteredDealers.every(d => d.stockStatus === 'available')).toBe(true);
    expect(component.filteredDealers.length).toBe(1);
  });

  it('onFilterChange("all") should restore all dealers', () => {
    fixture.detectChanges();
    component.onFilterChange('coupon');
    component.onFilterChange('all');
    expect(component.filteredDealers.length).toBe(3);
  });

  it('should expose 4 filter chips', () => {
    expect(component.filters.length).toBe(4);
  });
});
