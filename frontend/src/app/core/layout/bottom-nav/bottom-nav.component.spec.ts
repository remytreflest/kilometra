import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from './bottom-nav.component';

describe('BottomNavComponent', () => {
  let fixture: ComponentFixture<BottomNavComponent>;
  let component: BottomNavComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNavComponent],
    })
      .overrideComponent(BottomNavComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BottomNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a nav element', () => {
    const nav = fixture.nativeElement.querySelector('nav.bottom-nav');
    expect(nav).toBeTruthy();
  });

  it('should render 5 nav item links', () => {
    const links = fixture.nativeElement.querySelectorAll('a.nav-item');
    expect(links.length).toBe(5);
  });

  it('should have an Accueil nav item', () => {
    const links = fixture.nativeElement.querySelectorAll('a.nav-item');
    const labels = Array.from(links).map((a: any) => a.getAttribute('aria-label'));
    expect(labels).toContain('Accueil');
  });

  it('should have a Tableau de bord nav item', () => {
    const links = fixture.nativeElement.querySelectorAll('a.nav-item');
    const labels = Array.from(links).map((a: any) => a.getAttribute('aria-label'));
    expect(labels).toContain('Tableau de bord');
  });

  it('should have a Profil nav item', () => {
    const links = fixture.nativeElement.querySelectorAll('a.nav-item');
    const labels = Array.from(links).map((a: any) => a.getAttribute('aria-label'));
    expect(labels).toContain('Profil');
  });
});
