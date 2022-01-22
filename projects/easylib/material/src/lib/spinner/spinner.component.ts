import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'easy-spinner',
  template: `
    <mat-spinner
    [diameter]="size"
    [color]="color"
    ></mat-spinner>
  `,
  styles: [
    ':host { display: inline-block; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }',
  ]
})
export class SpinnerComponent {

  @Input() size = 40;
  @Input() color: ThemePalette = 'accent'; // color: primary, accent, warn

  constructor() { }

}
