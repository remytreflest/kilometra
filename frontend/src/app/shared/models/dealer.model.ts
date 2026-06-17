export type StockStatus = 'available' | 'limited' | 'order';

export interface Dealer {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  distanceKm: number;
  isOpen: boolean;
  closingTime: string;
  openingTime: string;
  acceptsCoupon: boolean;
  stockStatus: StockStatus;
  phone: string;
  lat: number;
  lng: number;
}
