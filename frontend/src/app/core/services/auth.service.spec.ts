import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService, AuthUser } from './auth.service';
import { ApiService } from './api.service';

const mockUser: AuthUser = {
  id: 'u1', email: 'test@test.com', firstName: 'John', lastName: 'Doe', role: 'USER',
};
const mockAdminUser: AuthUser = {
  id: 'u2', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'ADMIN',
};

describe('AuthService', () => {
  let service: AuthService;
  let apiService: any;

  beforeEach(() => {
    localStorage.clear();
    apiService = {
      post: jest.fn().mockReturnValue(of({ token: 'tok123', user: mockUser })),
    };
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: ApiService, useValue: apiService }],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have null user initially when localStorage is empty', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.isAdmin()).toBe(false);
  });

  it('login() should store token and user in localStorage and update signal', (done) => {
    service.login('test@test.com', 'password').subscribe(() => {
      expect(localStorage.getItem('michelin_token')).toBe('tok123');
      expect(service.currentUser()).toEqual(mockUser);
      expect(service.isLoggedIn()).toBe(true);
      done();
    });
  });

  it('logout() should clear localStorage and reset signal to null', (done) => {
    service.login('test@test.com', 'password').subscribe(() => {
      service.logout();
      expect(localStorage.getItem('michelin_token')).toBeNull();
      expect(localStorage.getItem('michelin_user')).toBeNull();
      expect(service.currentUser()).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
      done();
    });
  });

  it('getToken() should return stored token after login', (done) => {
    service.login('test@test.com', 'password').subscribe(() => {
      expect(service.getToken()).toBe('tok123');
      done();
    });
  });

  it('getToken() should return null when not logged in', () => {
    expect(service.getToken()).toBeNull();
  });

  it('initials() should return ? when no user is logged in', () => {
    expect(service.initials()).toBe('?');
  });

  it('initials() should return uppercase first letters of first and last name', (done) => {
    service.login('test@test.com', 'password').subscribe(() => {
      expect(service.initials()).toBe('JD');
      done();
    });
  });

  it('isAdmin() should be true when user role is ADMIN', (done) => {
    apiService.post.mockReturnValue(of({ token: 'tok456', user: mockAdminUser }));
    service.login('admin@test.com', 'password').subscribe(() => {
      expect(service.isAdmin()).toBe(true);
      done();
    });
  });

  it('should restore user from localStorage on service instantiation', () => {
    localStorage.setItem('michelin_user', JSON.stringify(mockUser));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: ApiService, useValue: apiService }],
    });
    const restored = TestBed.inject(AuthService);
    expect(restored.currentUser()).toEqual(mockUser);
    expect(restored.isLoggedIn()).toBe(true);
  });
});
