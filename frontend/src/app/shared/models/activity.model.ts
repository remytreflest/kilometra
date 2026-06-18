export type ActivityType = 'route' | 'vtt' | 'fractionné' | 'sortie longue' | 'gravel';

export interface Activity {
  id: string;
  name: string;
  date: Date;
  distanceKm: number;
  elevationM: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  durationMin: number;
  type: ActivityType;
  location: string;
  mpiImpact: number;  // impact sur le MPI (+/-)
}
