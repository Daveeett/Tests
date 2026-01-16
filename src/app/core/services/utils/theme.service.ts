import { Injectable, signal, effect } from '@angular/core';
import { LocalStorageService } from '../storage/local-storage.service';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'app-theme';

  private currentTheme = signal<Theme>('light');

  constructor(private localStorage: LocalStorageService) {
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
    });
  }

  public initializeTheme(): void {
    const savedTheme = this.getThemeFromStorage();
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(prefersDark ? 'dark' : 'light');
    }
  }

  public toggleTheme(): void {
    const newTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.saveThemeToStorage(theme);
  }

  public getCurrentTheme(): Theme {
    return this.currentTheme();
  }

  get theme() {
    return this.currentTheme.asReadonly();
  }

  public isDarkTheme(): boolean {
    return this.currentTheme() === 'dark';
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }

    root.setAttribute('data-theme', theme);
  }

  private saveThemeToStorage(theme: Theme): void {
    this.localStorage.setItem(this.THEME_STORAGE_KEY, theme);
  }

  private getThemeFromStorage(): Theme | null {
    const saved = this.localStorage.getItem(this.THEME_STORAGE_KEY);
    return saved === 'dark' || saved === 'light' ? saved : null;
  }
}
