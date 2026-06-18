import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Activity } from '../../shared/models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(private api: ApiService) {}

  getRecentActivities(limit = 5): Observable<Activity[]> {
    return this.api.get<Activity[]>('/activities/recent', { limit });
  }

  getAllActivities(): Observable<Activity[]> {
    return this.api.get<Activity[]>('/activities');
  }
}
