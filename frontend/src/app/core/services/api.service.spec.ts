import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get() should call GET /api<path> and extract data', () => {
    service.get<string[]>('/todos').subscribe(res => {
      expect(res).toEqual(['a', 'b']);
    });
    const req = httpMock.expectOne('/api/todos');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: ['a', 'b'] });
  });

  it('get() should build query params from options object', () => {
    service.get<string[]>('/items', { limit: 5, active: true }).subscribe();
    const req = httpMock.expectOne(r => r.url === '/api/items');
    expect(req.request.params.get('limit')).toBe('5');
    expect(req.request.params.get('active')).toBe('true');
    req.flush({ success: true, data: [] });
  });

  it('get() should skip undefined param values', () => {
    service.get<string[]>('/items', { limit: undefined }).subscribe();
    const req = httpMock.expectOne('/api/items');
    expect(req.request.params.has('limit')).toBe(false);
    req.flush({ success: true, data: [] });
  });

  it('post() should call POST /api<path> with body and extract data', () => {
    service.post<{ id: string }>('/todos', { name: 'test' }).subscribe(res => {
      expect(res).toEqual({ id: '1' });
    });
    const req = httpMock.expectOne('/api/todos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'test' });
    req.flush({ success: true, data: { id: '1' } });
  });

  it('patch() should call PATCH /api<path> with body and extract data', () => {
    service.patch<{ updated: boolean }>('/todos/1', { name: 'updated' }).subscribe(res => {
      expect(res).toEqual({ updated: true });
    });
    const req = httpMock.expectOne('/api/todos/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ name: 'updated' });
    req.flush({ success: true, data: { updated: true } });
  });
});
