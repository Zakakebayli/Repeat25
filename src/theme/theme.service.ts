import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;

  constructor() {
    this.darkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  private applyTheme(): void {
    if (this.darkMode) {
      document.body.style.setProperty('--ion-background-color', '#000000');
      document.body.style.setProperty('--ion-text-color', '#ffffff');
      document.body.style.setProperty('--ion-toolbar-background', '#1a1a1a');
      document.body.style.setProperty('--ion-item-background', '#1a1a1a');
      document.body.style.setProperty('--ion-card-background', '#1a1a1a');
    } else {
      document.body.style.setProperty('--ion-background-color', '#ffffff');
      document.body.style.setProperty('--ion-text-color', '#000000');
      document.body.style.setProperty('--ion-toolbar-background', '#3880ff');
      document.body.style.setProperty('--ion-item-background', '#ffffff');
      document.body.style.setProperty('--ion-card-background', '#ffffff');
    }
  }
}