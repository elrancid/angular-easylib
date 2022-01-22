import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ThemeMode, ThemeSize } from './theme-manager.module';
import { LoggableComponent } from '@easylib/log';
import { ThemeService } from './theme.service';


@Component({
  selector: 'easy-theme-manager',
  template: '',
  styles: [
    'body.theme-size-xs { zoom: 0.8; -moz-transform: scale(0.8); -moz-transform-origin: 0 0; }',
    'body.theme-size-s { zoom: 0.9; -moz-transform: scale(0.9); -moz-transform-origin: 0 0; }',
    'body.theme-size-l { zoom: 1.1; -moz-transform: scale(1.1); -moz-transform-origin: 0 0; }',
    'body.theme-size-xl { zoom: 1.2; -moz-transform: scale(1.2); -moz-transform-origin: 0 0; }',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ThemeManagerComponent extends LoggableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() logs = false;

  @Input() themeMode!: ThemeMode;
  @Input() themeSize!: ThemeSize;
  
  @Output() theme = new EventEmitter<'light' | 'dark'>();

  @Input() stylesheetLinkElementId: string = 'app-theme';
  @Input() stylesheetLightFile: string = 'light';
  @Input() stylesheetDarkFile: string = 'dark';

  private stop$: Subject<void> = new Subject();

  private listenerInstance: any;
  private currentThemeMode!: ThemeMode;
  private currentThemeSize: ThemeSize = 'm';

  private _document?: Document;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2,
    private themeService: ThemeService,
  ) {
    super();
    this._document = document as Document;
  }

  ngOnInit(): void {
    // if (window.matchMedia) {
    //   const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    //   if (matched) {
    //     this.log('ThemeManagerComponent.ngOnInit() Currently in dark mode');
    //   }
    //   else {
    //     this.log('ThemeManagerComponent.ngOnInit() Currently not in dark mode');
    //   }
    // }
    this.addPrefersColorSchemeListener();
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
    this.renderer.removeClass(this._document?.body, 'dark-theme');
    this.removePrefersColorSchemeListener();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.themeMode) {
      const themeMode: ThemeMode = changes.themeMode.currentValue;
      this.log('themeMode: ', themeMode);
      switch (themeMode) {
        case 'light':
          this.setLight();
          break;
        case 'dark':
          this.setDark();
          break;
        case 'auto':
          this.setThemeMode(this.getCurrentColorScheme());
          break;
      }
      this.currentThemeMode = themeMode;
    }
    if (changes.themeSize) {
      const themeSize: ThemeSize = changes.themeSize.currentValue;
      this.log('themeSize: ', themeSize);
      this.setThemeSize(themeSize);
    }
  }

  private prefersColorSchemeListener(event: any): void {
    this.log('ThemeManagerComponent.prefersColorSchemeListener() changed! event:', event, `matches: ${event.matches ? 'dark' : 'light'}`);
    if (this.currentThemeMode === 'auto') {
      this.setThemeMode(event.matches ? 'dark' : 'light');
    }
  }

  private addPrefersColorSchemeListener(): void {
    if (!this.listenerInstance) {
      this.log('ThemeManagerComponent.addPrefersColorSchemeListener() this:', this);
      this.listenerInstance = this.prefersColorSchemeListener.bind(this);
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.listenerInstance);
    }
  }

  private removePrefersColorSchemeListener(): void {
    if (this.listenerInstance) {
      this.log('ThemeManagerComponent.removePrefersColorSchemeListener() this:', this);
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.listenerInstance);
      this.listenerInstance = null;
    }
  }

  private getCurrentColorScheme(): string {
    if (!window.matchMedia) {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private setThemeMode(mode: string): void {
    switch (mode) {
      case 'light': this.setLight(); break;
      case 'dark': this.setDark(); break;
    }
  }

  private setLight(): void {
    this.log('setLight');
    this.renderer.removeClass(this._document?.body, 'dark-theme');
    if (this.stylesheetLinkElementId && this.stylesheetLightFile && this.stylesheetDarkFile) {
      this.themeService.switchTheme(this.stylesheetLinkElementId, this.stylesheetLightFile);
    }
    this.theme.emit('light');
  }

  private setDark(): void {
    this.log('setDark');
    this.renderer.addClass(this._document?.body, 'dark-theme');
    if (this.stylesheetLinkElementId && this.stylesheetLightFile && this.stylesheetDarkFile) {
      this.themeService.switchTheme(this.stylesheetLinkElementId, this.stylesheetDarkFile);
    }
    this.theme.emit('dark');
  }

  // THEME SIZE

  private setThemeSize(size: ThemeSize): void {
    this.log('ThemeManagerComponent.setThemeSize() size:', size);
    if (this.currentThemeSize !== 'm') {
      this.removeThemeSize(this.currentThemeSize);
    }
    if (size !== 'm') {
      this.renderer.addClass(this._document?.body, 'theme-size-' + size);
    }
    this.currentThemeSize = size;
  }

  private removeThemeSize(size: string): void {
    this.log('ThemeManagerComponent.removeThemeSize()');
    this.renderer.removeClass(this._document?.body, 'theme-size-' + size);
  }

}
