import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

// https://netbasal.com/disabling-form-controls-when-working-with-reactive-forms-in-angular-549dd7b42110
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[disabledControl]'
})
export class DisabledControlDirective {

  @Input() set disabledControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control![action]();
  }

  constructor(private ngControl: NgControl) {}
}
