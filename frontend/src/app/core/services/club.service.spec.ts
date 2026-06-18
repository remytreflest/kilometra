import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ClubService } from './club.service';
import { ApiService } from './api.service';

describe('ClubService', () => {
  let service: ClubService;
  let apiService: any;

  beforeEach(() => {
    apiService = { get: jest.fn().mockReturnValue(of([])) };
    TestBed.configureTestingModule({
      providers: [ClubService, { provide: ApiService, useValue: apiService }],
    });
    service = TestBed.inject(ClubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllClubs() should call /clubs with no params when no region', () => {
    service.getAllClubs().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/clubs', undefined);
  });

  it('getAllClubs() should pass region param when provided', () => {
    service.getAllClubs('Auvergne').subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/clubs', { region: 'Auvergne' });
  });

  it('getMyClub() should call /clubs/me', () => {
    service.getMyClub().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/clubs/me');
  });

  it('getRanking() should call /clubs/ranking with default scale', () => {
    service.getRanking().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/clubs/ranking', {});
  });

  it('getRanking() should pass region when provided', () => {
    service.getRanking('regional', 'Bretagne').subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/clubs/ranking', { region: 'Bretagne' });
  });

  it('getNationalLeaderboard() should call /leaderboard/national', () => {
    service.getNationalLeaderboard().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/leaderboard/national');
  });

  it('getRegionalLeaderboard() should call /leaderboard/regional with region param', () => {
    service.getRegionalLeaderboard('Bretagne').subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/leaderboard/regional', { region: 'Bretagne' });
  });
});
