import { UserLevel } from './user.model';

export interface MonthlyScore {
  month: string;
  score: number;
}

export interface PerformanceIndex {
  score: number;           // 0–1000
  level: UserLevel;
  monthlyDelta: number;    // points gagnés ce mois
  weeklyKm: number;        // km sur 7 jours
  nationalRank: number;    // classement national
  percentileBeat: number;  // % de cyclistes dépassés
  history: MonthlyScore[]; // 6 derniers mois
}
