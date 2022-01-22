import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'easy-button-stroked',
  template: `
    <button
    mat-stroked-button
    [type]="type"
    [color]="color"
    [disabled]="disabled"
    [matTooltip]="tooltip"
    attr.aria-label="{{ label }}">
      {{ label }}
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
  `]
})
export class ButtonStrokedComponent extends ButtonComponent {
  constructor() {
    super();
  }
}
