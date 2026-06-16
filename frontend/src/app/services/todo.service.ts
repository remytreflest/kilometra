import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = '/api/todos';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Todo[]> {
    return this.http.get<ApiResponse<Todo[]>>(this.apiUrl).pipe(map((response) => response.data));
  }

  create(payload: { title: string }): Observable<Todo> {
    return this.http.post<ApiResponse<Todo>>(this.apiUrl, payload).pipe(map((response) => response.data));
  }

  update(id: string, payload: Partial<Pick<Todo, 'done' | 'title'>>): Observable<Todo> {
    return this.http.put<ApiResponse<Todo>>(`${this.apiUrl}/${id}`, payload).pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<{ id: string }>>(`${this.apiUrl}/${id}`).pipe(map(() => undefined));
  }
}
