import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal, computed } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

function makeAuthService(loggedIn: boolean, admin = false) {
  const isLoggedInSignal = signal(loggedIn);
  const isAdminSignal = signal(admin);
  return {
    isLoggedIn: isLoggedInSignal,
    isAdmin: isAdminSignal,
    logout: jest.fn(),
  };
}

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;
  let authService: ReturnType<typeof makeAuthService>;
  let router: any;

  async function build(loggedIn: boolean, admin = false) {
    authService = makeAuthService(loggedIn, admin);
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    })
      .overrideComponent(SidebarComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await build(false);
    expect(component).toBeTruthy();
  });

  it('visibleLinks should include public links when not logged in', async () => {
    await build(false);
    const paths = component.visibleLinks.map(l => l.path);
    expect(paths).toContain('/accueil');
    expect(paths).toContain('/benchmark');
    expect(paths).not.toContain('/dashboard');
    expect(paths).not.toContain('/profil');
    expect(paths).not.toContain('/admin');
  });

  it('visibleLinks should include auth-required links when logged in', async () => {
    await build(true);
    const paths = component.visibleLinks.map(l => l.path);
    expect(paths).toContain('/dashboard');
    expect(paths).toContain('/profil');
    expect(paths).not.toContain('/admin');
  });

  it('visibleLinks should include /admin only for ADMIN role', async () => {
    await build(true, true);
    const paths = component.visibleLinks.map(l => l.path);
    expect(paths).toContain('/admin');
  });

  it('logout() should call auth.logout and navigate to /accueil', async () => {
    await build(true);
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/accueil']);
  });

  it('should render logout button when logged in', async () => {
    await build(true);
    const logoutBtn = fixture.nativeElement.querySelector('.logout-btn');
    expect(logoutBtn).toBeTruthy();
  });

  it('should render login link when not logged in', async () => {
    await build(false);
    const loginLink = fixture.nativeElement.querySelector('a.login-cta');
    expect(loginLink).toBeTruthy();
  });
});
