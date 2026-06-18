export type TesterRewardStatus = 'unlocked' | 'in-progress' | 'locked';

export interface TesterReward {
  id: string;
  title: string;
  description: string;
  requiredKm: number;
  status: TesterRewardStatus;
  icon: string;          // Material icon
  progressPct?: number;  // si in-progress
  couponCode?: string;   // si unlocked + type coupon
}

export interface TesterProgress {
  currentKm: number;
  nextMilestoneKm: number;
  progressPct: number;
  rewards: TesterReward[];
  couponCode: string;
  couponExpiry: Date;
  totalTesters: number;
  rank: number;
}
