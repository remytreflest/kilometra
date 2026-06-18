import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { ClubsComponent } from './clubs.component';
import { ClubService } from '../../core/services/club.service';
import { Club, RaceResult } from '../../shared/models/club.model';

const mockMyClub: Club = {
  id: 'c03', name: 'Velo Club Lyon', region: 'Auvergne-RA', department: '69',
  memberCount: 42, totalKm: 180000, monthlyKm: 9500, rank: 3, rankDelta: 2,
  monthlyKmDelta: 1200, michelinEquipmentPct: 74,
  badges: [{ id: 'b1', label: '1000 km', icon: 'star', color: '#FCE500', unlocked: true }],
};

const mockRanking: Club[] = [
  { ...mockMyClub, id: 'c01', name: 'Team Grenoble', rank: 1, rankDelta: 0 },
  { ...mockMyClub, id: 'c02', name: 'Brest Riders',  rank: 2, rankDelta: -1 },
  mockMyClub,
];

const mockLeaderboard: RaceResult[] = [
  { rank: 1, riderName: 'Camille Dubreuil', club: 'Velo Club Lyon', region: 'ARA', totalKm: 8200, mpiScore: 820, level: 'Elite', michelinUser: true },
];

describe('ClubsComponent', () => {
  let fixture: ComponentFixture<ClubsComponent>;
  let component: ClubsComponent;
  let clubService: any;

  beforeEach(async () => {
    clubService = {
      getMyClub:             jest.fn().mockReturnValue(of(mockMyClub)),
      getRanking:            jest.fn().mockReturnValue(of(mockRanking)),
      getNationalLeaderboard: jest.fn().mockReturnValue(of(mockLeaderboard)),
    };

    await TestBed.configureTestingModule({
      imports: [ClubsComponent],
      providers: [{ provide: ClubService, useValue: clubService }],
    })
      .overrideComponent(ClubsComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ClubsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call service methods on init', () => {
    fixture.detectChanges();
    expect(clubService.getMyClub).toHaveBeenCalled();
    expect(clubService.getRanking).toHaveBeenCalledWith('regional');
    expect(clubService.getNationalLeaderboard).toHaveBeenCalled();
  });

  it('should populate myClub, ranking and leaderboard after init', () => {
    fixture.detectChanges();
    expect(component.myClub).toEqual(mockMyClub);
    expect(component.ranking).toEqual(mockRanking);
    expect(component.leaderboard).toEqual(mockLeaderboard);
  });

  it('should initialise activeFilter to "regional" and scaleLabel to "regional"', () => {
    expect(component.activeFilter).toBe('regional');
    expect(component.scaleLabel).toBe('régional');
  });

  it('onFilterChange() should update activeFilter, scaleLabel and reload ranking', () => {
    fixture.detectChanges();
    clubService.getRanking.mockClear();

    component.onFilterChange('national');

    expect(component.activeFilter).toBe('national');
    expect(component.scaleLabel).toBe('national');
    expect(clubService.getRanking).toHaveBeenCalledWith('national');
  });

  it('onFilterChange("departmental") should set scaleLabel to "departemental"', () => {
    fixture.detectChanges();
    component.onFilterChange('departmental');
    expect(component.scaleLabel).toBe('départemental');
  });

  it('should expose 5 table columns', () => {
    expect(component.displayedColumns).toEqual(['rang', 'club', 'membres', 'km', 'michelin']);
  });
});
