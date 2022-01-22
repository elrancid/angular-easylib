import { Component, Input } from '@angular/core';
import { ButtonIconComponent } from './button-icon.component';

@Component({
  selector: 'easy-button-fab',
  template: `
    <button
    mat-fab
    [type]="type"
    [color]="color"
    [disabled]="disabled"
    [matTooltip]="tooltip"
    attr.aria-label="{{ label }}">
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
      <img *ngIf="img" src="{{ img }}">
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
    img { width: 100%; height: 100%; }
  `]
})
export class ButtonFabComponent extends ButtonIconComponent {}
