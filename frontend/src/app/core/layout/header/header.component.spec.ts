import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal, computed } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

function makeAuthService(loggedIn: boolean, initials = 'JD') {
  return {
    isLoggedIn: signal(loggedIn),
    isAdmin: computed(() => false),
    currentUser: signal(loggedIn ? { id: 'u1', email: 'a@a.com', firstName: 'John', lastName: 'Doe', role: 'USER' } : null),
    initials: jest.fn().mockReturnValue(initials),
    logout: jest.fn(),
  };
}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let authService: ReturnType<typeof makeAuthService>;
  let router: any;

  async function build(loggedIn: boolean) {
    authService = makeAuthService(loggedIn);
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    })
      .overrideComponent(HeaderComponent, {
        set: { imports: [CommonModule, MatMenuModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await build(true);
    expect(component).toBeTruthy();
  });

  it('should render a header element', async () => {
    await build(true);
    const header = fixture.nativeElement.querySelector('header.app-header');
    expect(header).toBeTruthy();
  });

  it('should show user avatar button when logged in', async () => {
    await build(true);
    const avatar = fixture.nativeElement.querySelector('.header-avatar');
    expect(avatar).toBeTruthy();
  });

  it('should display initials in the avatar button', async () => {
    await build(true);
    const avatar = fixture.nativeElement.querySelector('.header-avatar');
    expect(avatar.textContent.trim()).toBe('JD');
  });

  it('logout() should call auth.logout and navigate to /accueil', async () => {
    await build(true);
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/accueil']);
  });

  it('should show login button when not logged in', async () => {
    await build(false);
    const loginBtn = fixture.nativeElement.querySelector('.login-btn');
    expect(loginBtn).toBeTruthy();
  });

  it('should not show avatar button when not logged in', async () => {
    await build(false);
    const avatar = fixture.nativeElement.querySelector('.header-avatar');
    expect(avatar).toBeNull();
  });
});
