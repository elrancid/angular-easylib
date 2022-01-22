import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
// import * as _moment from 'moment';
// // tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
// const moment = _rollupMoment || _moment;

import * as moment from 'moment';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
// import * as moment from 'moment-business-days-it';

// import { LocaleService } from '../../locale/locale.service';
import { LoggableComponent } from 'src/app/core/log/loggable.component';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},

    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]},
    // {provide: MAT_DATE_FORMATS, useValue: {
    //   parse: {
    //     // dateInput: ['L', 'LL'],
    //     dateInput: 'LL',
    //   },
    //   display: {
    //     dateInput: 'LL',
    //     monthYearLabel: 'MMM YYYY',
    //     dateA11yLabel: 'LL',
    //     monthYearA11yLabel: 'MMMM YYYY',
    //   },
    // }},
  ],
})
export class DateComponent extends LoggableComponent {

  @Input() logs = false;

  @Input() label: string;
  @Input() hint: string;
  @Input() placeholder: string;

  @Input() form: FormGroup;
  @Input() controlName: string;
  // private formControl: AbstractControl;
  // private stop$ = new Subject<void>();

  /**
   * Set modifying false to prevent field modify. Default: true.
   */
  // @Input() modifying = true;

  // @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() required: boolean;
  @Input() errorMessage: string;
  @Input() clearButtonVisible: boolean;

  // @ViewChild('picker', {static: false}) private pickerElement: ElementRef;

  // public dateClass = (momentDate: any) => {
  //   return (momentDate.day() === 0 ? 'date-picker-holiday' : undefined);
  // }

  constructor(
    // private locale: LocaleService,
  ) {
    super();
  }

  // ngOnInit(): void {
  //   this.log(this, 'DateComponent.ngOnInit() form:', this.form, 'controlName:', this.controlName);
  //   this.formControl = this.form.get(this.controlName);
  //   this.formControl.valueChanges
  //   .pipe(
  //     takeUntil(this.stop$),
  //     distinctUntilChanged()
  //   )
  //   .subscribe((value) => {
  //     this.log('DateComponent ********* formControl.valueChanges:', value);
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.log('RegisterComponent.ngOnDestroy()');
  //   this.stop$.next();
  //   this.stop$.complete();
  // }

  // onChange(evt: any) {
  //   this.log(this, 'evt:', evt);
  //   // this.log(this, 'evt.target.value:', evt.target.value);
  //   // if (this.form) {
  //   //   this.log(this, 'form.value[' + this.controlName + ']:', this.form.value[this.controlName]);
  //   // }
  //   if (this.form && this.controlName && this.form.get(this.controlName)) {
  //     this.log(this, 'value:', this.form.value);
  //     // this.form.get(this.controlName).setValue(evt.target.value);
  //   }
  // }

  onDateChange(evt: any): void {
    this.log(this, '******************** onDateChange evt:', evt);
    this.log(this, 'evt.target.value:', evt.target.value);
    this.log(this, 'this.form.get(this.controlName).value:', this.form.get(this.controlName).value);
    // if (this.form) {
    //   this.log(this, 'form.value[' + this.controlName + ']:', this.form.value[this.controlName]);
    // }
    // TODO: questo è stato fatto se ci sono 2 form input collegati alla stessa proprietà. Da sistemare.
    // if (this.form && this.controlName && this.form.get(this.controlName)) {
    //   if (!this.form.get(this.controlName).value.isSame(evt.target.value)) {
    //     this.log(this, 'value:', this.form.value);
    //     this.form.get(this.controlName).setValue(evt.target.value);
    //   }
    // }
  }

  onFocus(evt: any): void {
    this.log(this, 'evt:', evt);
    // this.log(this, 'pickerElement:', this.pickerElement);
    this.log(this, 'evt.target:', evt.target);
    this.log(this, 'evt.target.nativeElement:', evt.target.nativeElement);
    setTimeout(() => {
      evt.target.focus();
    }, 0);
    // this.pickerElement.nativeElement.open();
    // this.pickerElement.open();
    // this.log(this, 'evt.target.value:', evt.target.value);
    // if (this.form) {
    //   this.log(this, 'form.value[' + this.controlName + ']:', this.form.value[this.controlName]);
    // }
    // if (this.form && this.controlName && this.form.get(this.controlName)) {
    //   this.log(this, 'value:', this.form.value);
    //   this.form.get(this.controlName).setValue(evt.target.value);
    // }
  }

  getErrorMessage(): string {
    this.log('°°°°°°°°°°°°°°°°°°°°°°° form.controls[controlName]:', this.form.controls[this.controlName]);
    return this.form.controls[this.controlName].hasError('required') ? 'You must enter a value (dd/mm/yyyy)' :
    this.form.controls[this.controlName].invalid ? 'Enter a valid date (dd/mm/yyyy)' :
    '';
  }
}
