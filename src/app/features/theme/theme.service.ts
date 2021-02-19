import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  readonly THEME_KEY = 'theme';

  theme = 'sweet';
  defaultTheme: string;

  private themeChange = new Subject<string>();

  constructor() {
    this.defaultTheme = this.theme;
    const theme = localStorage.getItem(this.THEME_KEY) || this.defaultTheme;
    if (theme !== this.defaultTheme) {
      this.setTheme(theme);
    } else {
      this.theme = theme;
    }
    this.setStatusbar();
  }

  get theme$(): Observable<string> {
    return this.themeChange.asObservable();
  }

  setTheme(theme: string): void {
    const switched = this.setBodyClass(theme);
    if (switched) {
      this.setStatusbar();
      this.theme = theme;
      localStorage.setItem(this.THEME_KEY, this.theme);
      this.themeChange.next(this.theme);
    }
  }

  setBodyClass(theme: string): boolean {
    try {
      return document.body.classList.replace(`theme-${this.theme}`, `theme-${theme}`) as any;
    } catch (error) {
      // Do nothing.
    }
    return false;
  }

  setStatusbar(): void {
    try {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        const cssDeclaration = window.getComputedStyle(document.body);
        metaThemeColor.setAttribute('content', cssDeclaration.getPropertyValue('--primary-shadow'));
      }
    } catch {
      // Do nothing.
    }
  }
}
