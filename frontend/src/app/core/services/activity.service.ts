import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Activity } from '../../shared/models/activity.model';

const ACTIVITIES: Activity[] = [
  { id: 'a01', name: 'Sortie route — Vallée de la Loire',  date: new Date('2026-06-15'), distanceKm: 78,  elevationM: 312, avgSpeedKmh: 31.2, maxSpeedKmh: 54.1, durationMin: 150, type: 'route',         location: 'Nantes → Ancenis',      mpiImpact: +4 },
  { id: 'a02', name: 'Sortie côtière — Pornic',            date: new Date('2026-06-13'), distanceKm: 104, elevationM: 540, avgSpeedKmh: 28.7, maxSpeedKmh: 61.2, durationMin: 217, type: 'sortie longue',  location: 'Saint-Nazaire → Pornic',mpiImpact: +6 },
  { id: 'a03', name: 'Entraînement fractionné',            date: new Date('2026-06-11'), distanceKm: 42,  elevationM: 180, avgSpeedKmh: 33.9, maxSpeedKmh: 68.4, durationMin: 74,  type: 'fractionné',    location: 'Nantes — circuit local', mpiImpact: +5 },
  { id: 'a04', name: 'Gravel — Forêt de Touffou',         date: new Date('2026-06-08'), distanceKm: 56,  elevationM: 820, avgSpeedKmh: 22.1, maxSpeedKmh: 48.7, durationMin: 152, type: 'gravel',         location: 'Clisson → Touffou',     mpiImpact: +3 },
  { id: 'a05', name: 'Sortie Vendée — Pouzauges',         date: new Date('2026-06-06'), distanceKm: 92,  elevationM: 680, avgSpeedKmh: 27.4, maxSpeedKmh: 58.3, durationMin: 201, type: 'route',         location: 'Nantes → Pouzauges',    mpiImpact: +5 },
  { id: 'a06', name: 'Sortie Brière',                     date: new Date('2026-06-04'), distanceKm: 64,  elevationM: 120, avgSpeedKmh: 30.1, maxSpeedKmh: 52.8, durationMin: 127, type: 'route',         location: 'Saint-Nazaire → Brière',mpiImpact: +3 },
  { id: 'a07', name: 'VTT — Forêt du Gâvre',             date: new Date('2026-06-01'), distanceKm: 38,  elevationM: 410, avgSpeedKmh: 18.2, maxSpeedKmh: 44.1, durationMin: 125, type: 'vtt',           location: 'Blain → Gâvre',         mpiImpact: +2 },
  { id: 'a08', name: 'Sortie Maine-et-Loire',             date: new Date('2026-05-29'), distanceKm: 118, elevationM: 740, avgSpeedKmh: 29.8, maxSpeedKmh: 63.2, durationMin: 237, type: 'sortie longue', location: 'Nantes → Angers',       mpiImpact: +7 },
  { id: 'a09', name: 'Entraînement matinal',              date: new Date('2026-05-27'), distanceKm: 32,  elevationM: 90,  avgSpeedKmh: 34.6, maxSpeedKmh: 61.8, durationMin: 55,  type: 'fractionné',    location: 'Nantes — bords de Loire',mpiImpact: +3 },
  { id: 'a10', name: 'Cyclosportive Nantaise',            date: new Date('2026-05-24'), distanceKm: 145, elevationM: 1200, avgSpeedKmh: 30.4, maxSpeedKmh: 72.1, durationMin: 286, type: 'sortie longue', location: 'Nantes → Cholet',       mpiImpact: +9 },
  { id: 'a11', name: 'Sortie côtière — Noirmoutier',     date: new Date('2026-05-21'), distanceKm: 132, elevationM: 280, avgSpeedKmh: 29.1, maxSpeedKmh: 55.6, durationMin: 272, type: 'sortie longue', location: 'Saint-Jean-de-Monts',   mpiImpact: +8 },
  { id: 'a12', name: 'Club — Sortie de groupe',           date: new Date('2026-05-18'), distanceKm: 88,  elevationM: 420, avgSpeedKmh: 27.8, maxSpeedKmh: 57.2, durationMin: 190, type: 'route',         location: 'Nantes — collectif',    mpiImpact: +5 },
];

@Injectable({ providedIn: 'root' })
export class ActivityService {
  getRecentActivities(limit = 5): Observable<Activity[]> {
    return of(ACTIVITIES.slice(0, limit)).pipe(delay(150));
  }

  getAllActivities(): Observable<Activity[]> {
    return of(ACTIVITIES).pipe(delay(200));
  }
}
