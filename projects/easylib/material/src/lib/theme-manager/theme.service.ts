import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  switchTheme(elementId: string, cssFile: string) {
    const themeLink = this.document.getElementById(elementId) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = cssFile + '.css';
    }
  }
}