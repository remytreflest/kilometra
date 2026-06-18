import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapMockComponent } from './map-mock.component';

describe('MapMockComponent', () => {
  let fixture: ComponentFixture<MapMockComponent>;
  let component: MapMockComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapMockComponent],
    })
      .overrideComponent(MapMockComponent, {
        set: { imports: [CommonModule], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MapMockComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the map container', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.map-mock')).toBeTruthy();
  });

  it('should render an SVG element', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('svg')).toBeTruthy();
  });

  it('should render the "Vous êtes ici" badge', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.map-badge')?.textContent?.trim()).toBe('Vous êtes ici');
  });
});
