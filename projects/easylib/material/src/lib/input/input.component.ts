import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { InputType } from './input.module';
import html from './input.component.html';

// import { LoggerService } from '../../logger.service';

@Component({
  selector: 'easy-input',
  // templateUrl: './input.component.html',
  template: '<ng-container [formGroup]="form">' + html + '</ng-container>',
  styles: [
    ':host { display: block; }',
    'mat-form-field { display: block; }',
  ],
  // styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {

  @Input() label?: string;
  @Input() controlName!: string;
  @Input() hint?: string;
  @Input() placeholder?: string;
  /**
   * Custom error message function
   */
  @Input() errorMessage?: (control: AbstractControl) => string;

  /**
   * Set password true to hide text and show button to "show/hide" text.
   */
  @Input() password: boolean = false;
  hide: boolean = false;
  /**
   * type = 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' |
   * 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
   */
  @Input() type?: InputType;

  @Input() form!: FormGroup;
  formControl!: FormControl;
  required: boolean = false;

  /**
   * Set modifying false to prevent field modify. Default: true.
   */
  @Input() readonly: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.hide = this.password ? true : false;
    this.formControl = this.form.controls[this.controlName] as FormControl;
    // console.log('form:', this.form);
    // console.log('controlName:', this.controlName);
    // console.log('form.controls[' + (this.form.controls.length) + ']:', this.form.controls);
    // this.logger.log('form.controls[controlName]:', this.form.controls[this.controlName]);
    // this.required = this.hasRequiredFieldAbstraction(this.form.controls[this.controlName]);
    // console.log('required:', this.required);
  }

  getErrorMessage(): string {
    const formControl = this.form.controls[this.controlName];
    if (this.errorMessage) {
      return this.errorMessage(formControl);
    }
    // console.log('formControl:', formControl);
    // console.log('formControl.errors:', formControl.errors);
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }
    if (formControl.hasError('email')) {
      return 'Not a valid email';
    }
    if (formControl.hasError('requiredTrue')) {
      return 'Must be selected';
    }
    if (formControl.hasError('minLength')) {
      return 'Too short';
    }
    if (formControl.hasError('maxLength')) {
      return 'Too long';
    }
    if (formControl.hasError('pattern')) {
      return 'Not pattern';
    }
    return '';
  }

  // hasRequiredFieldAbstraction = (abstractControl: AbstractControl): boolean => {
  //   if (abstractControl.validator) {
  //     const validator = abstractControl.validator({}as AbstractControl);
  //     if (validator && validator.required) {
  //       return true;
  //     }
  //   }
  //   // if (abstractControl['controls']) {
  //   //     for (const controlName in abstractControl['controls']) {
  //   //         if (abstractControl['controls'][controlName]) {
  //   //             if (hasRequiredField(abstractControl['controls'][controlName])) {
  //   //                 return true;
  //   //             }
  //   //         }
  //   //     }
  //   // }
  //   return false;
  // }
}
