import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'easy-button-flat',
  template: `
    <button
    mat-flat-button
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
export class ButtonFlatComponent extends ButtonComponent {
  constructor() {
    super();
  }
}
