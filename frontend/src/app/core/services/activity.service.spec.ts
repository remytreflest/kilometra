import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivityService } from './activity.service';
import { ApiService } from './api.service';
import { Activity } from '../../shared/models/activity.model';

const mockActivities: Activity[] = [
  {
    id: 'a1', name: 'Sortie matinale', date: new Date('2024-01-01'),
    distanceKm: 40, elevationM: 500, avgSpeedKmh: 26, maxSpeedKmh: 48,
    durationMin: 90, type: 'route', location: 'Lyon', mpiImpact: 10,
  },
];

describe('ActivityService', () => {
  let service: ActivityService;
  let apiService: any;

  beforeEach(() => {
    apiService = { get: jest.fn().mockReturnValue(of(mockActivities)) };
    TestBed.configureTestingModule({
      providers: [ActivityService, { provide: ApiService, useValue: apiService }],
    });
    service = TestBed.inject(ActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRecentActivities() should call /activities/recent with provided limit', () => {
    service.getRecentActivities(3).subscribe(res => {
      expect(res).toEqual(mockActivities);
    });
    expect(apiService.get).toHaveBeenCalledWith('/activities/recent', { limit: 3 });
  });

  it('getRecentActivities() should use default limit of 5', () => {
    service.getRecentActivities().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/activities/recent', { limit: 5 });
  });

  it('getAllActivities() should call /activities with no params', () => {
    service.getAllActivities().subscribe(res => {
      expect(res).toEqual(mockActivities);
    });
    expect(apiService.get).toHaveBeenCalledWith('/activities');
  });
});
