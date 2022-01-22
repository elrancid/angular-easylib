import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'easy-button-raised',
  template: `
    <button
    mat-raised-button
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
export class ButtonRaisedComponent extends ButtonComponent {
  constructor() {
    super();
  }
}
