import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DealerService } from './dealer.service';
import { ApiService } from './api.service';
import { Dealer } from '../../shared/models/dealer.model';

const mockDealer: Dealer = {
  id: 'd1', name: 'Vélo Shop', address: '12 rue du Sport', city: 'Lyon',
  postalCode: '69001', distanceKm: 2.4, isOpen: true, closingTime: '19:00',
  openingTime: '09:00', acceptsCoupon: true, stockStatus: 'available',
  phone: '04 72 00 00 00', lat: 45.75, lng: 4.83,
};

describe('DealerService', () => {
  let service: DealerService;
  let apiService: any;

  beforeEach(() => {
    apiService = { get: jest.fn().mockReturnValue(of([mockDealer])) };

    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition: jest.fn().mockImplementation((success) => success({ coords: { latitude: 45.75, longitude: 4.83 } })) },
      configurable: true,
    });

    TestBed.configureTestingModule({
      providers: [DealerService, { provide: ApiService, useValue: apiService }],
    });
    service = TestBed.inject(DealerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getNearbyDealers() should call /dealers with geo coords', (done) => {
    service.getNearbyDealers().subscribe(res => {
      expect(res).toEqual([mockDealer]);
      expect(apiService.get).toHaveBeenCalledWith('/dealers', expect.objectContaining({ lat: 45.75, lng: 4.83 }));
      done();
    });
  });

  it('getDealersWithCoupon() should call /dealers with coupon: true', (done) => {
    service.getDealersWithCoupon().subscribe(() => {
      expect(apiService.get).toHaveBeenCalledWith('/dealers', expect.objectContaining({ coupon: true }));
      done();
    });
  });

  it('getDealersOpen() should call /dealers with open: true', (done) => {
    service.getDealersOpen().subscribe(() => {
      expect(apiService.get).toHaveBeenCalledWith('/dealers', expect.objectContaining({ open: true }));
      done();
    });
  });

  it('getDealerById() should call /dealers/:id', () => {
    apiService.get.mockReturnValue(of(mockDealer));
    service.getDealerById('d1').subscribe(res => {
      expect(res).toEqual(mockDealer);
    });
    expect(apiService.get).toHaveBeenCalledWith('/dealers/d1');
  });

  it('filterDealers() should pass criteria to /dealers', (done) => {
    service.filterDealers({ coupon: true, open: false }).subscribe(() => {
      expect(apiService.get).toHaveBeenCalledWith('/dealers', expect.objectContaining({ coupon: true, open: false }));
      done();
    });
  });
});
