import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Tire, TireCategory, TireWear, TireTerrainStats } from '../../shared/models/tire.model';

// Backend stores scores as flat fields with different names
interface BackendTire {
  id: string; reference: string; name: string; brand: string; category: string;
  adhesion: number; efficiency: number; comfort: number; punctureResistance: number; durability: number;
  avgScore: number; communityKm: number; punctureReductionPct: number; recommendedFor: string[]; priceEur: number;
}

interface BackendWear {
  id: string; tireId: string; tireRef: string; tireName: string;
  position: 'front' | 'rear';
  installedAt: string; currentKm: number; estimatedMaxKm: number; wearPct: number; status: string;
  tire?: { name: string; reference: string; category: string };
}

interface BackendTerrainPerf {
  id: string; tireRef: string; tireName: string; tireId: string | null;
  mountain: number; coastal: number; plain: number; wet: number;
  avgRating: number; totalKmAnalyzed: number; avgPunctureRate: number;
}

function adaptTire(b: BackendTire): Tire {
  return {
    id: b.id,
    reference: b.reference,
    name: b.name,
    brand: b.brand as 'Michelin' | 'Concurrent',
    category: b.category as TireCategory,
    scores: {
      grip: b.adhesion,
      energyReturn: b.efficiency,
      comfort: b.comfort,
      punctureResistance: b.punctureResistance,
      durability: b.durability,
    },
    avgScore: b.avgScore,
    communityKm: b.communityKm,
    punctureReductionPct: b.punctureReductionPct,
    recommendedFor: b.recommendedFor,
    priceEur: b.priceEur,
  };
}

function adaptWear(b: BackendWear): TireWear {
  return {
    tire: {
      id: b.tireId,
      reference: b.tireRef,
      name: b.tireName,
      brand: 'Michelin',
      category: (b.tire?.category as TireCategory) ?? 'route',
      scores: { grip: 0, energyReturn: 0, comfort: 0, punctureResistance: 0, durability: 0 },
      avgScore: 0,
      communityKm: 0,
      punctureReductionPct: 0,
      recommendedFor: [],
    },
    position: b.position ?? 'front',
    kmSinceInstall: b.currentKm,
    wearPercentage: b.wearPct,
    estimatedDaysLeft: 0,
    installDate: new Date(b.installedAt),
  };
}

function adaptTerrainPerf(b: BackendTerrainPerf): TireTerrainStats {
  return {
    tireId: b.tireId ?? b.id,
    tireName: b.tireName,
    mountain: b.mountain,
    coastal: b.coastal,
    plain: b.plain,
    wet: b.wet,
    avgPunctureRate: b.avgPunctureRate ?? 0,
  };
}

@Injectable({ providedIn: 'root' })
export class TireService {
  constructor(private api: ApiService) {}

  getCatalog(category?: TireCategory): Observable<Tire[]> {
    const params = category ? { category } : undefined;
    return this.api.get<BackendTire[]>('/tires', params).pipe(
      map(tires => tires.map(adaptTire))
    );
  }

  getMichelinTires(): Observable<Tire[]> {
    return this.api.get<BackendTire[]>('/tires/michelin').pipe(
      map(tires => tires.map(adaptTire))
    );
  }

  getTireById(id: string): Observable<Tire | undefined> {
    return this.api.get<BackendTire>(`/tires/${id}`).pipe(
      map(adaptTire)
    );
  }

  getUserWear(): Observable<TireWear[]> {
    return this.api.get<BackendWear[]>('/wear').pipe(
      map(wears => wears.map(adaptWear))
    );
  }

  getTerrainStats(): Observable<TireTerrainStats[]> {
    return this.api.get<BackendTerrainPerf[]>('/tires/terrain-stats').pipe(
      map(stats => stats.map(adaptTerrainPerf))
    );
  }

  getTerrainStatsByTire(tireId: string): Observable<TireTerrainStats | undefined> {
    return this.api.get<BackendTerrainPerf>(`/tires/${tireId}/terrain-stats`).pipe(
      map(adaptTerrainPerf)
    );
  }

  getBenchmarkData(): Observable<{ michelin: Tire; competitors: Tire[] }> {
    return this.api.get<BackendTire[]>('/tires').pipe(
      map(tires => {
        const adapted = tires.map(adaptTire);
        const michelin = adapted.filter(t => t.brand === 'Michelin');
        const competitors = adapted.filter(t => t.brand === 'Concurrent');
        return { michelin: michelin[0], competitors };
      })
    );
  }
}
