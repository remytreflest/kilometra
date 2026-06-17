import { Component, EventEmitter, Output } from '@angular/core';

export type HomeScreen = 'home' | 'dashboard' | 'leaderboards' | 'activities' | 'profile';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @Output() navigate = new EventEmitter<HomeScreen>();

  onNavigate(screen: HomeScreen): void {
    this.navigate.emit(screen);
  }
}