import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Tire, TireCategory, TireWear, TireTerrainStats } from '../../shared/models/tire.model';

const TIRE_CATALOG: Tire[] = [
  // --- MICHELIN ---
  {
    id: 'm1', reference: 'Power Road TLR', name: 'Michelin Power Road TLR',
    brand: 'Michelin', category: 'route',
    scores: { grip: 9.2, energyReturn: 8.7, comfort: 8.9, punctureResistance: 9.4, durability: 9.0 },
    avgScore: 9.04, communityKm: 412_000, punctureReductionPct: 31,
    recommendedFor: ['Compétiteur Expert', 'Expert', 'Élite'], priceEur: 49.90
  },
  {
    id: 'm2', reference: 'Power Cup EVO TLR', name: 'Michelin Power Cup EVO TLR',
    brand: 'Michelin', category: 'competition',
    scores: { grip: 9.6, energyReturn: 9.1, comfort: 7.8, punctureResistance: 8.6, durability: 8.2 },
    avgScore: 8.66, communityKm: 198_000, punctureReductionPct: 24,
    recommendedFor: ['Compétiteur Expert', 'Élite'], priceEur: 64.90
  },
  {
    id: 'm3', reference: 'Power Endurance 2', name: 'Michelin Power Endurance 2',
    brand: 'Michelin', category: 'endurance',
    scores: { grip: 8.4, energyReturn: 8.2, comfort: 9.1, punctureResistance: 9.6, durability: 9.5 },
    avgScore: 8.96, communityKm: 320_000, punctureReductionPct: 37,
    recommendedFor: ['Passionné', 'Expert', 'Intermédiaire'], priceEur: 42.90
  },
  {
    id: 'm4', reference: 'Dynamic Sport', name: 'Michelin Dynamic Sport',
    brand: 'Michelin', category: 'route',
    scores: { grip: 7.8, energyReturn: 7.5, comfort: 8.5, punctureResistance: 8.2, durability: 9.0 },
    avgScore: 8.20, communityKm: 540_000, punctureReductionPct: 18,
    recommendedFor: ['Débutant', 'Intermédiaire', 'Passionné'], priceEur: 28.90
  },
  {
    id: 'm5', reference: 'Pro4 Endurance V2', name: 'Michelin Pro4 Endurance V2',
    brand: 'Michelin', category: 'endurance',
    scores: { grip: 8.6, energyReturn: 8.0, comfort: 9.3, punctureResistance: 9.8, durability: 9.7 },
    avgScore: 9.08, communityKm: 280_000, punctureReductionPct: 42,
    recommendedFor: ['Passionné', 'Expert', 'Intermédiaire'], priceEur: 38.90
  },
  {
    id: 'm6', reference: 'Power All Season TLR', name: 'Michelin Power All Season TLR',
    brand: 'Michelin', category: 'route',
    scores: { grip: 9.0, energyReturn: 8.3, comfort: 8.8, punctureResistance: 9.2, durability: 9.3 },
    avgScore: 8.92, communityKm: 175_000, punctureReductionPct: 28,
    recommendedFor: ['Expert', 'Compétiteur Expert', 'Passionné'], priceEur: 54.90
  },
  {
    id: 'm7', reference: 'Power Gravel', name: 'Michelin Power Gravel',
    brand: 'Michelin', category: 'gravel',
    scores: { grip: 9.1, energyReturn: 7.8, comfort: 8.6, punctureResistance: 9.0, durability: 9.2 },
    avgScore: 8.74, communityKm: 89_000, punctureReductionPct: 22,
    recommendedFor: ['Expert', 'Passionné'], priceEur: 44.90
  },
  // --- CONCURRENTS ---
  {
    id: 'c1', reference: 'Corsa G+ TLR', name: 'Concurrent Corsa G+ TLR',
    brand: 'Concurrent', category: 'competition',
    scores: { grip: 9.0, energyReturn: 8.8, comfort: 7.4, punctureResistance: 7.1, durability: 8.0 },
    avgScore: 8.06, communityKm: 0, punctureReductionPct: 0,
    recommendedFor: [], priceEur: 68.00
  },
  {
    id: 'c2', reference: 'Ironman Tubeless', name: 'Concurrent Ironman Tubeless',
    brand: 'Concurrent', category: 'endurance',
    scores: { grip: 8.1, energyReturn: 7.9, comfort: 8.2, punctureResistance: 7.8, durability: 8.5 },
    avgScore: 8.10, communityKm: 0, punctureReductionPct: 0,
    recommendedFor: [], priceEur: 45.00
  },
  {
    id: 'c3', reference: 'RoadBike Pro R', name: 'Concurrent RoadBike Pro R',
    brand: 'Concurrent', category: 'route',
    scores: { grip: 7.4, energyReturn: 7.2, comfort: 8.0, punctureResistance: 6.9, durability: 7.5 },
    avgScore: 7.40, communityKm: 0, punctureReductionPct: 0,
    recommendedFor: [], priceEur: 38.00
  },
  {
    id: 'c4', reference: 'SpeedForce TL', name: 'Concurrent SpeedForce TL',
    brand: 'Concurrent', category: 'competition',
    scores: { grip: 8.7, energyReturn: 8.5, comfort: 7.2, punctureResistance: 7.5, durability: 7.8 },
    avgScore: 7.94, communityKm: 0, punctureReductionPct: 0,
    recommendedFor: [], priceEur: 59.00
  },
];

const TERRAIN_STATS: TireTerrainStats[] = [
  { tireId: 'm1', tireName: 'Power Road TLR',       mountain: 9.1, coastal: 9.3, plain: 9.0, wet: 9.2, avgPunctureRate: 0.8 },
  { tireId: 'm2', tireName: 'Power Cup EVO TLR',    mountain: 9.5, coastal: 8.8, plain: 9.3, wet: 8.4, avgPunctureRate: 1.1 },
  { tireId: 'm3', tireName: 'Power Endurance 2',    mountain: 8.2, coastal: 9.1, plain: 8.8, wet: 9.5, avgPunctureRate: 0.5 },
  { tireId: 'm4', tireName: 'Dynamic Sport',        mountain: 7.6, coastal: 8.4, plain: 8.2, wet: 8.0, avgPunctureRate: 1.4 },
  { tireId: 'm5', tireName: 'Pro4 Endurance V2',    mountain: 8.5, coastal: 9.4, plain: 9.0, wet: 9.7, avgPunctureRate: 0.3 },
  { tireId: 'm6', tireName: 'Power All Season TLR', mountain: 8.9, coastal: 9.2, plain: 8.7, wet: 9.5, avgPunctureRate: 0.6 },
  { tireId: 'm7', tireName: 'Power Gravel',         mountain: 9.4, coastal: 8.6, plain: 8.0, wet: 8.8, avgPunctureRate: 0.9 },
  { tireId: 'c1', tireName: 'Corsa G+ TLR',        mountain: 8.8, coastal: 8.5, plain: 9.0, wet: 7.6, avgPunctureRate: 2.1 },
  { tireId: 'c2', tireName: 'Ironman Tubeless',     mountain: 7.8, coastal: 8.0, plain: 8.1, wet: 8.3, avgPunctureRate: 1.7 },
  { tireId: 'c3', tireName: 'RoadBike Pro R',       mountain: 7.1, coastal: 7.8, plain: 7.5, wet: 7.2, avgPunctureRate: 2.8 },
  { tireId: 'c4', tireName: 'SpeedForce TL',        mountain: 8.3, coastal: 8.0, plain: 8.6, wet: 7.8, avgPunctureRate: 1.9 },
];

@Injectable({ providedIn: 'root' })
export class TireService {
  getCatalog(category?: TireCategory): Observable<Tire[]> {
    const tires = category
      ? TIRE_CATALOG.filter(t => t.category === category)
      : TIRE_CATALOG;
    return of(tires).pipe(delay(200));
  }

  getMichelinTires(): Observable<Tire[]> {
    return of(TIRE_CATALOG.filter(t => t.brand === 'Michelin')).pipe(delay(150));
  }

  getTireById(id: string): Observable<Tire | undefined> {
    return of(TIRE_CATALOG.find(t => t.id === id)).pipe(delay(100));
  }

  getUserWear(): Observable<TireWear[]> {
    const powerRoad = TIRE_CATALOG.find(t => t.id === 'm1')!;
    const powerEndurance = TIRE_CATALOG.find(t => t.id === 'm3')!;
    return of([
      {
        tire: powerRoad,
        position: 'front',
        kmSinceInstall: 1240,
        wearPercentage: 78,
        estimatedDaysLeft: 45,
        installDate: new Date('2025-12-15')
      },
      {
        tire: powerEndurance,
        position: 'rear',
        kmSinceInstall: 890,
        wearPercentage: 52,
        estimatedDaysLeft: 78,
        installDate: new Date('2026-01-20')
      }
    ] as TireWear[]).pipe(delay(150));
  }

  getTerrainStats(): Observable<TireTerrainStats[]> {
    return of(TERRAIN_STATS).pipe(delay(200));
  }

  getTerrainStatsByTire(tireId: string): Observable<TireTerrainStats | undefined> {
    return of(TERRAIN_STATS.find(s => s.tireId === tireId)).pipe(delay(100));
  }

  getBenchmarkData(): Observable<{ michelin: Tire; competitors: Tire[] }> {
    return of({
      michelin: TIRE_CATALOG.find(t => t.id === 'm1')!,
      competitors: TIRE_CATALOG.filter(t => t.brand === 'Concurrent')
    }).pipe(delay(200));
  }
}
