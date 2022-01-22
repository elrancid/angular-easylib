import { Component, Input } from '@angular/core';
import { ButtonComponent } from './button.component';

// http://google.github.io/material-design-icons/#icon-font-for-the-web
@Component({
  selector: 'easy-button-icon',
  template: `
    <button
    mat-icon-button
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
export class ButtonIconComponent extends ButtonComponent {

  // @Input() label?: string;
  @Input() img?: string;
  @Input() icon?: string;
  // @Input() color: string = 'primary';
  // @Input() disabled: boolean = false;

  constructor() {
    super();
  }
}
