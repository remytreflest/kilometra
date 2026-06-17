import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Review, ReviewKpis } from '../../shared/models/review.model';

const REVIEWS: Review[] = [
  { id: 'r01', authorInitials: 'TL', authorName: 'Thomas L.',        kmWithTire: 312,  rating: 5, comment: 'L\'adhérence sur revêtement humide est nettement supérieure à mon ancien pneu. Aucune crevaison depuis l\'installation, malgré des sorties régulières sur petites routes.', isVerified: true, date: new Date('2026-06-10'), type: 'user', tireRef: 'Power Road TLR' },
  { id: 'r02', authorInitials: 'SM', authorName: 'Sarah M.',          kmWithTire: 540,  rating: 4, comment: 'Très bon compromis confort/rendement sur les longues sorties. L\'usure semble progressive et prévisible, conforme à l\'estimation de l\'application.', isVerified: true, date: new Date('2026-06-08'), type: 'user', tireRef: 'Power Road TLR' },
  { id: 'r03', authorInitials: 'JD', authorName: 'Jean D.',           kmWithTire: 890,  rating: 5, comment: 'Pneu exceptionnel pour la compétition. La réduction de poids se sent immédiatement à l\'accélération. Je ne reviendrai pas en arrière.', isVerified: true, date: new Date('2026-06-06'), type: 'user', tireRef: 'Power Cup EVO TLR' },
  { id: 'r04', authorInitials: 'MR', authorName: 'Marie R.',          kmWithTire: 1240, rating: 5, comment: 'Utilisé sur toute une saison de cyclosportives, l\'usure est remarquablement lente. Le revêtement tient parfaitement malgré les routes dégradées bretonnes.', isVerified: true, date: new Date('2026-06-04'), type: 'user', tireRef: 'Power Endurance 2' },
  { id: 'r05', authorInitials: 'PB', authorName: 'Pierre B.',         kmWithTire: 680,  rating: 5, comment: 'Rapport qualité/prix imbattable pour un pneu de cette gamme. Efficace autant sur route sèche que mouillée.', isVerified: true, date: new Date('2026-06-02'), type: 'user', tireRef: 'Power Road TLR' },
  { id: 'r06', authorInitials: 'CV', authorName: 'Claire V.',         kmWithTire: 420,  rating: 4, comment: 'Confort remarquable sur les longues distances. Le montage tubeless est très accessible même pour un non-mécanicien.', isVerified: true, date: new Date('2026-05-30'), type: 'user', tireRef: 'Power All Season TLR' },
  { id: 'r07', authorInitials: 'AL', authorName: 'Antoine L.',        kmWithTire: 1050, rating: 5, comment: 'Pneu 4 saisons qui tient toutes ses promesses. Je roule par tous les temps et les performances restent constantes.', isVerified: true, date: new Date('2026-05-28'), type: 'user', tireRef: 'Power All Season TLR' },
  { id: 'r08', authorInitials: 'NF', authorName: 'Nicolas F.',        kmWithTire: 760,  rating: 4, comment: 'Très bonne adhérence en montagne. J\'ai testé sur plusieurs cols des Alpes et le pneu s\'est montré irréprochable en descente.', isVerified: true, date: new Date('2026-05-26'), type: 'user', tireRef: 'Power Cup EVO TLR' },
  { id: 'r09', authorInitials: 'LG', authorName: 'Lucie G.',          kmWithTire: 340,  rating: 5, comment: 'Premier pneu Michelin et je suis conquise. La différence avec mes anciens pneus est flagrante, surtout par temps de pluie.', isVerified: true, date: new Date('2026-05-24'), type: 'user', tireRef: 'Dynamic Sport' },
  { id: 'r10', authorInitials: 'RM', authorName: 'Romain M.',         kmWithTire: 920,  rating: 5, comment: 'Excellent pneu d\'endurance. J\'ai bouclé 6 brevets randonneurs cette saison sans un seul incident. La durabilité est au rendez-vous.', isVerified: true, date: new Date('2026-05-22'), type: 'user', tireRef: 'Pro4 Endurance V2' },
  { id: 'r11', authorInitials: 'EB', authorName: 'Élise B.',          kmWithTire: 280,  rating: 4, comment: 'Très satisfaite du grip en virage. Parfait pour mes sorties côtières même quand la chaussée est salée et humide.', isVerified: true, date: new Date('2026-05-20'), type: 'user', tireRef: 'Power Road TLR' },
  { id: 'r12', authorInitials: 'GC', authorName: 'Gaëtan C.',         kmWithTire: 1580, rating: 5, comment: 'Mes meilleurs pneus depuis 10 ans de cyclisme. La résistance aux crevaisons est bluffante sur les routes de campagne.', isVerified: true, date: new Date('2026-05-18'), type: 'user', tireRef: 'Power Endurance 2' },
  { id: 'r13', authorInitials: 'VL', authorName: 'Vélo_Lab_FR',        kmWithTire: 1200, rating: 5, comment: '« Le meilleur rapport adhérence/rendement testé cette saison sur parcours vallonné. »', isVerified: true, date: new Date('2026-05-15'), type: 'influencer', tireRef: 'Power Cup EVO TLR', sponsoredContent: true, followerCount: 84_000, platform: 'YouTube' },
  { id: 'r14', authorInitials: 'CR', authorName: 'Cycling_Review',    kmWithTire: 0,    rating: 5, comment: '« La résistance à la crevaison change vraiment la donne sur les routes dégradées. »', isVerified: true, date: new Date('2026-05-12'), type: 'influencer', tireRef: 'Power Endurance 2', sponsoredContent: true, followerCount: 142_000, platform: 'Instagram' },
  { id: 'r15', authorInitials: 'TH', authorName: 'Touring_Hiver_FR', kmWithTire: 800,  rating: 4, comment: '« Confort surprenant sur les longues distances, même par temps froid. »', isVerified: true, date: new Date('2026-05-10'), type: 'influencer', tireRef: 'Power All Season TLR', sponsoredContent: true, followerCount: 56_000, platform: 'YouTube' },
  { id: 'r16', authorInitials: 'FP', authorName: 'François P.',       kmWithTire: 450,  rating: 5, comment: 'La montée tubeless était ma crainte principale. En réalité, c\'est très simple et le joint est parfait au premier gonflage.', isVerified: true, date: new Date('2026-05-08'), type: 'user', tireRef: 'Power Road TLR' },
  { id: 'r17', authorInitials: 'AD', authorName: 'Aurore D.',         kmWithTire: 620,  rating: 4, comment: 'Pneu recommandé par mon club et je ne suis pas déçue. Très bon sur les sorties longues du week-end.', isVerified: true, date: new Date('2026-05-06'), type: 'user', tireRef: 'Power Endurance 2' },
  { id: 'r18', authorInitials: 'HK', authorName: 'Hugo K.',           kmWithTire: 380,  rating: 5, comment: 'La différence de poids par rapport à un pneu clincher classique est réelle à l\'accélération. Très satisfait.', isVerified: true, date: new Date('2026-05-04'), type: 'user', tireRef: 'Power Cup EVO TLR' },
];

const REVIEW_KPIS: ReviewKpis = {
  avgRating: 4.7,
  totalReviews: 2340,
  recommendationPct: 96,
  verifiedPct: 94,
};

@Injectable({ providedIn: 'root' })
export class ReviewService {
  getReviews(type?: 'user' | 'influencer'): Observable<Review[]> {
    const reviews = type ? REVIEWS.filter(r => r.type === type) : REVIEWS;
    return of(reviews).pipe(delay(200));
  }

  getReviewsByTire(tireRef: string): Observable<Review[]> {
    return of(REVIEWS.filter(r => r.tireRef === tireRef)).pipe(delay(150));
  }

  getKpis(): Observable<ReviewKpis> {
    return of(REVIEW_KPIS).pipe(delay(100));
  }
}
