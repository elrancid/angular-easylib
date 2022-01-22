import { Component, Input } from '@angular/core';

// import { LoggerService } from '../../logger.service';

@Component({
  selector: 'easy-form-array-switch',
  template: `
    <ng-container *ngIf="formArrayName" [formArrayName]="formArrayName">
      <ng-content></ng-content>
    </ng-container>
    <ng-container *ngIf="!formArrayName">
      <ng-content></ng-content>
    </ng-container>
  `,
  styles: [],
})
export class FormArraySwitchComponent {
  @Input() formArrayName?: string | number | null;
}
