import { Component, Input } from '@angular/core';
import { InputComponent } from './input.component';
import html from './input.component.html';

@Component({
  selector: 'easy-input-array',
  // templateUrl: './input-array.component.html',
  template: '<ng-container [formGroup]="form"><ng-container [formArrayName]="formArrayName">' + html + '</ng-container></ng-container>',
  styles: [
    ':host { display: block; }',
    'mat-form-field { display: block; }',
  ],
})
export class InputArrayComponent extends InputComponent {

  @Input() formArrayName!: string | number | null;

}
