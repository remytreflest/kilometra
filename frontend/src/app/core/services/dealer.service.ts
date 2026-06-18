import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Dealer, StockStatus } from '../../shared/models/dealer.model';

@Injectable({ providedIn: 'root' })
export class DealerService {
  constructor(private api: ApiService) {}

  private getGeoParams(): Observable<{ lat?: number; lng?: number }> {
    if (!navigator.geolocation) return of({});
    return from(
      new Promise<{ lat?: number; lng?: number }>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve({}),
          { timeout: 5000 }
        );
      })
    );
  }

  getNearbyDealers(): Observable<Dealer[]> {
    return this.getGeoParams().pipe(
      switchMap((geo) => this.api.get<Dealer[]>('/dealers', geo as Record<string, string | number | boolean | undefined>))
    );
  }

  getDealersWithCoupon(): Observable<Dealer[]> {
    return this.getGeoParams().pipe(
      switchMap((geo) => this.api.get<Dealer[]>('/dealers', { ...geo, coupon: true } as Record<string, string | number | boolean | undefined>))
    );
  }

  getDealersOpen(): Observable<Dealer[]> {
    return this.getGeoParams().pipe(
      switchMap((geo) => this.api.get<Dealer[]>('/dealers', { ...geo, open: true } as Record<string, string | number | boolean | undefined>))
    );
  }

  getDealerById(id: string): Observable<Dealer | undefined> {
    return this.api.get<Dealer>(`/dealers/${id}`);
  }

  filterDealers(criteria: { coupon?: boolean; open?: boolean; stock?: StockStatus }): Observable<Dealer[]> {
    return this.getGeoParams().pipe(
      switchMap((geo) => this.api.get<Dealer[]>('/dealers', { ...geo, ...criteria } as Record<string, string | number | boolean | undefined>))
    );
  }
}
