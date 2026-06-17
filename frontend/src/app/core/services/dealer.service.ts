import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Dealer, StockStatus } from '../../shared/models/dealer.model';

const DEALERS: Dealer[] = [
  { id: 'd01', name: 'Cycles Atlantique Nantes',         address: '12 rue de la Loire',             city: 'Nantes',             postalCode: '44000', distanceKm: 1.2, isOpen: true,  closingTime: '19h00', openingTime: '09h00', acceptsCoupon: true,  stockStatus: 'available', phone: '02 40 12 34 56', lat: 47.218, lng: -1.553 },
  { id: 'd02', name: 'Vélo Performance Saint-Herblain',  address: '45 avenue de la République',     city: 'Saint-Herblain',     postalCode: '44800', distanceKm: 4.8, isOpen: true,  closingTime: '18h30', openingTime: '09h30', acceptsCoupon: true,  stockStatus: 'limited',   phone: '02 40 23 45 67', lat: 47.226, lng: -1.609 },
  { id: 'd03', name: 'Espace Cycles Rezé',               address: '8 rue des Sports',               city: 'Rezé',               postalCode: '44400', distanceKm: 7.1, isOpen: false, closingTime: '18h00', openingTime: '09h00', acceptsCoupon: false, stockStatus: 'order',     phone: '02 40 34 56 78', lat: 47.189, lng: -1.558 },
  { id: 'd04', name: 'Bike Center Nantes Nord',          address: '23 bd de Sarrebruck',            city: 'Nantes',             postalCode: '44300', distanceKm: 3.4, isOpen: true,  closingTime: '20h00', openingTime: '10h00', acceptsCoupon: true,  stockStatus: 'available', phone: '02 40 45 67 89', lat: 47.234, lng: -1.547 },
  { id: 'd05', name: 'La Maison du Cycliste',            address: '7 place du Commerce',            city: 'Nantes',             postalCode: '44000', distanceKm: 0.8, isOpen: true,  closingTime: '19h30', openingTime: '09h00', acceptsCoupon: true,  stockStatus: 'available', phone: '02 40 56 78 90', lat: 47.213, lng: -1.561 },
  { id: 'd06', name: 'Sport 2000 Vélo — Orvault',       address: '14 route de la Chapelle',        city: 'Orvault',            postalCode: '44700', distanceKm: 9.2, isOpen: true,  closingTime: '19h00', openingTime: '09h30', acceptsCoupon: false, stockStatus: 'limited',   phone: '02 40 67 89 01', lat: 47.268, lng: -1.618 },
  { id: 'd07', name: 'Cycles du Pays de la Loire',       address: '56 avenue de Paris',             city: 'Vertou',             postalCode: '44120', distanceKm: 12.6, isOpen: false, closingTime: '18h00', openingTime: '09h00', acceptsCoupon: true,  stockStatus: 'order',     phone: '02 40 78 90 12', lat: 47.168, lng: -1.469 },
  { id: 'd08', name: 'Trocvélo Nantes',                  address: '89 rue d\'Alger',                city: 'Nantes',             postalCode: '44000', distanceKm: 2.1, isOpen: true,  closingTime: '18h30', openingTime: '10h00', acceptsCoupon: false, stockStatus: 'available', phone: '02 40 89 01 23', lat: 47.221, lng: -1.573 },
  { id: 'd09', name: 'Intersport Cyclisme — Carquefou',  address: '3 rue des Artisans',             city: 'Carquefou',          postalCode: '44470', distanceKm: 14.3, isOpen: true,  closingTime: '20h00', openingTime: '09h00', acceptsCoupon: true,  stockStatus: 'available', phone: '02 40 90 12 34', lat: 47.294, lng: -1.485 },
  { id: 'd10', name: 'Cycles Expert Saint-Sébastien',    address: '34 rue de Mindin',               city: 'Saint-Sébastien-sur-Loire', postalCode: '44230', distanceKm: 8.7, isOpen: false, closingTime: '18h00', openingTime: '09h30', acceptsCoupon: true,  stockStatus: 'limited',   phone: '02 40 01 23 45', lat: 47.196, lng: -1.499 },
  { id: 'd11', name: 'Décathlon Cyclisme — Bouguenais',  address: '1 rue de la Terrière',           city: 'Bouguenais',         postalCode: '44340', distanceKm: 11.8, isOpen: true,  closingTime: '21h00', openingTime: '09h00', acceptsCoupon: false, stockStatus: 'available', phone: '02 40 12 34 56', lat: 47.159, lng: -1.609 },
  { id: 'd12', name: 'Top Chrono Cycles',                address: '19 avenue Jean Jaurès',          city: 'La Chapelle-sur-Erdre', postalCode: '44240', distanceKm: 16.4, isOpen: true, closingTime: '19h00', openingTime: '10h00', acceptsCoupon: true,  stockStatus: 'order',     phone: '02 40 23 45 67', lat: 47.298, lng: -1.546 },
  { id: 'd13', name: 'Michelin Partner Store Nantes',    address: '88 rue du Général de Gaulle',    city: 'Nantes',             postalCode: '44100', distanceKm: 3.6, isOpen: true,  closingTime: '18h30', openingTime: '09h00', acceptsCoupon: true,  stockStatus: 'available', phone: '02 40 34 56 78', lat: 47.208, lng: -1.574 },
  { id: 'd14', name: 'Cycles Pro Saint-Nazaire',         address: '4 quai des Frégates',            city: 'Saint-Nazaire',      postalCode: '44600', distanceKm: 58.4, isOpen: true, closingTime: '19h00', openingTime: '09h00', acceptsCoupon: true,  stockStatus: 'available', phone: '02 40 45 67 89', lat: 47.276, lng: -2.208 },
  { id: 'd15', name: 'VéloSport Ancenis',                address: '27 route d\'Angers',             city: 'Ancenis',            postalCode: '44150', distanceKm: 38.2, isOpen: true, closingTime: '18h00', openingTime: '09h00', acceptsCoupon: false, stockStatus: 'limited',   phone: '02 40 56 78 90', lat: 47.366, lng: -1.178 },
];

@Injectable({ providedIn: 'root' })
export class DealerService {
  getNearbyDealers(): Observable<Dealer[]> {
    return of(DEALERS).pipe(delay(250));
  }

  getDealersWithCoupon(): Observable<Dealer[]> {
    return of(DEALERS.filter(d => d.acceptsCoupon)).pipe(delay(200));
  }

  getDealersOpen(): Observable<Dealer[]> {
    return of(DEALERS.filter(d => d.isOpen)).pipe(delay(200));
  }

  getDealerById(id: string): Observable<Dealer | undefined> {
    return of(DEALERS.find(d => d.id === id)).pipe(delay(100));
  }

  filterDealers(criteria: { coupon?: boolean; open?: boolean; stock?: StockStatus }): Observable<Dealer[]> {
    return of(DEALERS).pipe(
      delay(200),
      map(dealers => dealers.filter(d => {
        if (criteria.coupon && !d.acceptsCoupon) return false;
        if (criteria.open && !d.isOpen) return false;
        if (criteria.stock && d.stockStatus !== criteria.stock) return false;
        return true;
      }))
    );
  }
}
