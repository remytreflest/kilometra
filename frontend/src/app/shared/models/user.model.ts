export type UserLevel =
  | 'Débutant'
  | 'Intermédiaire'
  | 'Passionné'
  | 'Expert'
  | 'Compétiteur Expert'
  | 'Élite';

export interface UserBadge {
  id: string;
  label: string;
  icon: string;       // Material icon name
  color: string;      // CSS couleur
  unlocked: boolean;
}

export interface UserReward {
  id: string;
  title: string;
  description: string;
  validUntil?: Date;
  couponCode?: string;
  type: 'coupon' | 'access' | 'product';
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  club: string;
  memberSince: Date;
  level: UserLevel;
  stravaConnected: boolean;
  badges: UserBadge[];
  rewards: UserReward[];
}
