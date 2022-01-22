import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, catchError, map, tap, retry } from 'rxjs/operators';

// import { LoggableComponent } from '../core/log/loggable.component';
// import { Loggable } from '../../../core/log/loggable';
import { Loggable } from '@easylib/log';

import { Moment } from 'moment';
import * as moment from 'moment';
import { Util } from '@easylib/util';

/**
 * For validators see https://angular.io/api/forms/Validators
 * For array see https://netbasal.com/angular-reactive-forms-the-ultimate-guide-to-formarray-3adbe6b0b61a
 */
export interface FieldStructure {
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'fieldArray',
  value?: any,
  fieldStructure?: FieldStructure, // for fieldArray
  disabled?: boolean,
  required?: boolean,         // Validators.required
  email?: boolean,            // Validators.email
  // min?: number,               // Validators.min
  // max?: number,               // Validators.max
  requiredTrue?: boolean      // Validators.requiredTrue
  minLength?: number,         // Validators.minLength
  maxLength?: number,         // Validators.maxLength
  pattern?: string | RegExp,  // Validators.pattern
  validation?: ValidatorFn,      // Custom validation
}

export type FormStructure = {[key: string]: FieldStructure};

/**
 * Extends this class to manage form.
 * Set var "formStructure" or call "setFormStructure()" function.
 * formStructure: {
 *   [field_name]: {
 *     type: string, // date, integer
 *     required: boolean, // default false
 *     value: any, // value to apply
 *     default: any, // TODO
 *     disabled: boolean, // optional. true makes formControl disabled
 *   },
 *   ...
 * }
 * Implements "onFormDataChanged()" to listen form data changes.
 */
// @Component({
//   template: '',
// })
// export abstract class FormManager extends LoggableComponent implements OnInit, OnDestroy {
export abstract class FormManager extends Loggable {

  // @Input() logs = false;
  protected logsForm = false;

  protected abstract formStructure: FormStructure;
  // protected formData: object = {};
  protected _formData: {[key:string]: any} = {};

  // @Input() set formData(formData: object) {
  public set formData(formData: {[key: string]: any}) {
    this.logIf(this.logsForm, '~~~ FormManager.set formData():', formData, 'formStructure:', this.formStructure);
    this.setFormDataValues(formData);
  }
  public get formData(): {[key: string]: any} {
    return this._formData;
  }
  protected oldFormData: {[key: string]: any} = {};
  public form?: FormGroup;
  // protected form$: Subscription; // form.valueChanges subscription
  protected formControls$: Array<Subscription> = []; // subscriptions for every form field
  protected formControls: {[key:string]: FormControl} = {};

  private isFormDataChanging = false;

  // constructor(
  //   // protected logger: LoggerService,
  // ) {
  //   // if (this.formStructure) {
  //   //   this.setFormStructure(this.formStructure);
  //   // }
  //   // this.logger.log(this, '~~~ FormManager.constructor()');
  //   // this.logger.log(this, '~~~ FormManager.constructor() classType:', this.classType);
  //   // this.logger.log(this, '~~~ FormManager.constructor() formData:', this.formData);
  // }

  init(): void {
    this.logIf(this.logsForm, '~~~ FormManager.init() formStructure:', this.formStructure);
    if (this.formStructure) {
      this.setFormStructure();
    }
  }

  destroy(): void {
    this.logIf(this.logsForm, '~~~ FormManager.destroy()');
    this.unsubscribeAll();
  }

  protected unsubscribeAll(): void {
    // this.form$.unsubscribe();
    this.formControls$.forEach((formControl$) => {
      formControl$.unsubscribe();
    });
  }

  protected onFormDataChanged(formData: {[key: string]: any}, oldFormData: {[key: string]: any}): void {};

  public onSubmit(): void {
    // this.logger.log(this, '~~~ FormManager.onSubmit()');
    if (this.form) {
      this.logIf(this.logsForm, '~~~ FormManager.onSubmit() form value:', this.form.value, 'formData:', this.formData);
    }
  }

  /**
   * For fieldArray: push a new FormControl in an array defined as simple fieldArray (array of fields)
   */
  public pushFieldArray(field: string): void {
    // this.form
  }
  /**
   * For fieldArray: remove a FormControl from an array defined as simple fieldArray (array of fields)
   */
  public removeFieldArray(field: string, index: number): void {
  }

  protected setFormStructure(formStructure?: {[key: string]: any}): void {
    // this.logger.log(this, '~~~ FormManager.setFormStructure() formStructure:', formStructure);
    this.logIf(this.logsForm, '~~~ FormManager.setFormStructure() formStructure:', formStructure);
    if (formStructure) {
      this.formStructure = formStructure;
    }
    if (this.form) {
      this.unsubscribeAll();
    }
    this.formControls$ = [];
    this.formControls = {};
    const form = new FormGroup({});
    for (const [key, detail] of Object.entries(this.formStructure)) {
      // this.logger.log(this, '~~~ FormManager.setFormStructure() key:', key, 'detail:', detail);
      switch (detail.type) {
      case 'array':
        if (detail.value) {
          this._formData[key] = detail.value;
        }
        else {
          this._formData[key] = [];
        }
        this.logIf(this.logsForm, '~~~ FormManager.setFormStructure() key:', key, 'value:', this._formData[key]);
        break;
      case 'fieldArray':
        break;
      default:
        const useValue = this._formData && this._formData.hasOwnProperty(key) ? this._formData[key] : detail.value;
        const dataValue = this.toDataValue(detail.type, useValue);
        const formValue = this.toFormValue(detail.type, useValue);
        const disabled: boolean = !!detail.disabled;
        this.logIf(this.logsForm, '~~~ FormManager.setFormStructure() key:', key, 'useValue:', useValue, 'dataValue:', dataValue, 'formValue:', formValue);
        if (this._formData[key] !== dataValue) {
          if (this._formData[key] !== undefined) {
            this.logIf(this.logsForm, '~~~ FormManager.setFormStructure() !!! CONTROLLARE !!! formData originale:', useValue, 'diverso da nuovo form data impostato:', dataValue);
          }
          this._formData[key] = dataValue;
        }
        // Validators
        const validators = [];
        if (detail.required) {
          validators.push(Validators.required);
        }
        if (detail.email) {
          validators.push(Validators.email);
        }
        // if (detail.min) {
        //   validators.push(Validators.min);
        // }
        // if (detail.max) {
        //   validators.push(Validators.max);
        // }
        if (detail.minLength) {
          validators.push(Validators.minLength(detail.minLength));
        }
        if (detail.maxLength) {
          validators.push(Validators.maxLength(detail.maxLength));
        }
        if (detail.requiredTrue) {
          validators.push(Validators.requiredTrue);
        }
        if (detail.pattern) {
          validators.push(Validators.pattern(detail.pattern));
        }
        if (detail.validation) {
          validators.push(detail.validation);
        }
        // Create FormControl
        const formControl = new FormControl({value: formValue, disabled}, validators);
        form.addControl(key, formControl);
        this.formControls$.push(
          formControl.valueChanges
          .pipe(
            distinctUntilChanged()
          )
          .subscribe((value) => {
            this.logIf(this.logsForm, '~~~ FormManager formControl.valueChanges:', value, 'key:', key, 'this:', this);
            this.setFormDataValue(key, value);
          })
        );
        this.formControls[key] = formControl;
        break;
      }
    }
    this.form = form;
    // this.form$ = this.form.valueChanges
    // .pipe(
    //   distinctUntilChanged()
    // )
    // .subscribe((value) => {
    //   this.logIf(this.logsForm, '~~~ FormManager form.valueChanges:', value);
    // });

    this.logIf(this.logsForm, '~~~ FormManager.setFormStructure() form:', this.form);
    this.formDataChanged();
  }

  /**
   * Set a single form field value.
   * @param key form key
   * @param value form value
   * @param updateAll default `true`.
   * If `true` it set `this.oldFormData`, and calls `this.formDataChanged()`.
   * Called `false` from `setFormData()`.
   */
   protected setFormDataValue(key: string, value: any, updateAll: boolean = true): void {
    const type = this.formStructure[key].type;
    const newDataValue = this.toDataValue(type, value);
    // compare current formData value
    if (this._formData[key] !== newDataValue) {
      // this.oldFormData = Object.assign({}, this._formData);
      // this.oldFormData = { ...this._formData };
      this.oldFormData = this._formData;
      // set new data
      // this.logger.log(this, '~~~ FormManager.setDataValue() type:', type, 'key:', key, 'value:', value);
      this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() type:', type, 'key:', key, 'value:', value, 'newDataValue:', newDataValue, 'set formData...');
      this._formData = {
        ...this._formData,
        [key]: newDataValue,
      };
      // this._formData[key] = newDataValue;
      this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() _formData:', this._formData, '_formData[key]:', this._formData[key]);
      // this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() ok ~~~ _formData:', this._formData);
      const formValue = this.toFormValue(type, value);
      if (!this.areValuesEquals(this.form?.get(key)?.value, formValue)) {
        this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() type:', type, 'key:', key, 'value:', value, 'formValue:', formValue, 'set form...');
        // this.form.patchValue({ [key]: value });
        this.form?.get(key)?.setValue(formValue);
      }
      this.formDataChanged();
    }
  }

  /**
   * Reset data to formStructure default values
   */
  public reset() {
    // TODO: fare reset anche per arrayField
    this.logIf(this.logsForm, '~~~ FormManager.reset()');
    const newFormData: {[key: string]: any} = {};
    for (const [key, formFieldStructure] of Object.entries(this.formStructure)) {
      newFormData[key] = formFieldStructure.hasOwnProperty('value') ? formFieldStructure.value : undefined;
    }
    this.setFormDataValues(newFormData);
  }

  /**
   * Set new formData object with passed values.
   * Called from "this.formData = dataObject;".
   * @param formData new form data
   */
  protected setFormDataValues(formData: {[key: string]: any}): void {
    this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() formData:', formData);
    // prepare new data
    const newFormData: {[key: string]: any} = {}
    // this.oldFormData = this._formData;
    // this._formData = {};
    if (formData) {
      const newFormObjectToPatch: {[key: string]: any} = {};
      for (const [key, value] of Object.entries(formData)) {
        if (this.formStructure.hasOwnProperty(key)) {
          const type = this.formStructure[key].type;
          // get formData value
          const newDataValue = this.toDataValue(type, value);
          this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() key: "' + key + '" _formData[' + key + ']:', this._formData[key], 'type:', type,'value[' + (typeof value) + ']:', value, 'newDataValue:', newDataValue);
          if (value !== newDataValue) {
            this.log('~~~ FormManager.setFormDataValues() ......!!! CONTROLLARE !!! value{' + (typeof value) + '}:', value, 'diverso da newDataValue{' + (typeof newDataValue) + '}:', newDataValue);
          }
          if (this._formData[key] !== newDataValue) {
            this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() ......save new value:', newDataValue);
            newFormData[key] = newDataValue;
          }
          // get form field value
          const currentFormValue = this.form?.get(key)?.value;
          const newFormValue = this.toFormValue(type, newDataValue);
          if (currentFormValue !== newFormValue) {
            newFormObjectToPatch[key] = newFormValue;
            this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() .........newFormObjectToPatch[' + key + ']:', newFormObjectToPatch[key]);
          }
          // const formDataValueFromFormValue = this.toDataValue(type, currentFormValue);
          // this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() _formData[key]', this._formData[key], 'currentFormValue:', currentFormValue, 'formDataValueFromFormValue:', formDataValueFromFormValue, '_formData[' + key + '] !== formDataValueFromFormValue?', this._formData[key] !== formDataValueFromFormValue);
          // if (this._formData[key] !== formDataValueFromFormValue) {
          //   newFormObjectToPatch[key] = this.toFormValue(type, value);
          //   this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() .........type:', type, 'newFormObjectToPatch[' + key + ']:', newFormObjectToPatch[key]);
          //   // this.formData[key] = this.toDataValue(type, value);
          // }
        }
      }
      this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() _formData:', this._formData);
      this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() newFormData:', newFormData);
      if (!Util.isEqual(newFormData, {})) {
        this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() -> _formData = newFormData');
        this._formData = {
          ...this._formData,
          ...newFormData,
        }
      }
      this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() newFormObjectToPatch:', newFormObjectToPatch);
      if (this.form && !Util.isEqual(newFormObjectToPatch, {})) {
        this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() -> patchValue and formDataChanged...');
        this.form.patchValue(newFormObjectToPatch);
        this.formDataChanged();
      }
    }
  }
/*
  // OLD
  protected setFormDataValues(objectValues: {[key: string]: any}): void {
    this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() objectValues:', objectValues);
    const formObject: {[key: string]: any} = {};
    this.oldFormData = Object.assign({}, this._formData);
    for (const [key, value] of Object.entries(objectValues)) {
      if (this.formStructure.hasOwnProperty(key) && this._formData[key] !== value) {
        const type = this.formStructure[key].type;
        formObject[key] = this.toFormValue(type, value);
        // this.formData[key] = this.toDataValue(type, value);
        const newDataValue = this.toDataValue(type, value);
        if (this._formData[key] !== newDataValue) {
          this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() !!! CONTROLLARE !!! formData originale:', this.formData[key], 'diverso da nuovo form data impostato:', newDataValue);
          this._formData[key] = newDataValue;
        }
        // this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() key:', key, 'value:', value,
        // 'type:', type, 'formData:', this.formData[key], 'form', formObject[key]);
      }
    }
    this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() formData:', this._formData);
    this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() formObject:', formObject);
    if (this.form) {
      this.form.patchValue(formObject);
    }
    this.formDataChanged();
  }
*/

  /**
   * Alias per this.get(key).value
   */
  protected getFormValue(path: string): any {
    if (!this.form || !this.form.get(path)) {
      return undefined;
    }
    return this.form?.get(path)?.value;
  }

  formDataChanged(): void {
    if (this.isFormDataChanging) {
      return;
    }
    this.isFormDataChanging = true;
    setTimeout(() => {
      // this.onFormDataChanged({ ...this._formData }, this.oldFormData);
      this.onFormDataChanged(this._formData, this.oldFormData);
      this.emitFormDataChanged(this._formData);
      this.isFormDataChanging = false;
    }, 0);
  }

  /**
   * Used only to implements in FormManagerComponent
   * @param formData 
   */
  protected emitFormDataChanged(formData: {[key: string]: any}): void {}

  /**
   * Retrieve data value from form value
   * @param type String type of form data
   * @param value Form value
   */
  protected toDataValue(type: string, value: any): any {
    // this.logger.log(this, '~~~ FormManager.toDataValue() type:', type, 'value[' + (typeof value) + ']:', value);
    if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
      // this.logger.log(this, '~~~ FormManager.toDataValue() value is undefined or null or NaN');
      return undefined;
    }
    switch (type) {
    case 'date': // string in format 'YYYY-MM-DD'
      return Util.toString(value);
      // this.logger.log(this, '~~~ FormManager.toDataValue() date... result:', result);
    case 'number': // number
    case 'integer': // number
    case 'real': // number
      return Util.toNumber(value);
      // this.logger.log(this, '~~~ FormManager.toDataValue() number... result:', result);
    }
    return value;
  }
  /**
   * Retrieve form value from data value
   * @param type String type of form data
   * @param value Data value
   */
  protected toFormValue(type: string, value: any): any {
    if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
      return undefined;
    }
    switch (type) {
      case 'date': // moment
        if (value !== '') {
          return moment(value);
        }
        break;
      case 'number': // number
      case 'integer': // number
      case 'real': // number
        return Util.toNumber(value);
        // return Util.toString(value);
    }
    return value;
  }

  /**
   * Check if two given values are equals. Use to compare string, number and Moment.
   * @param value1 First value
   * @param value2 Second value
   * @returns true if values are equals.
   */
  protected areValuesEquals(value1: any, value2: any): boolean {
    // if (value1 instanceof moment && value2 instanceof moment) {
    if (moment.isMoment(value1) && moment.isMoment(value2)) {
      // return value1.isSame(value2, 'seconds');
      return value1.format('DD/MM/YYYY HH:mm.ss') === value2.format('DD/MM/YYYY HH:mm.ss')
    }
    return value1 === value2;
  }

  // private valueFormToData(type: string, value: any): any {
  //   this.logger.log(this, '~~~ FormManager.valueFormToData() value[' + (typeof value) + ']:', value);
  //   let returnData = value;
  //   switch (type) {
  //     case 'date': // moment to string
  //       if (value instanceof moment) {
  //         returnData = moment(value).format('YYYY-MM-DD');
  //       }
  //       break;
  //     case 'number': // string to number
  //     case 'integer': // number
  //     case 'real': // number
  //       returnData = Util.stringToNumber(value);
  //       break;
  //   }
  //   this.logger.log(this, '~~~ FormManager.valueFormToData() returnData[' + (typeof returnData) + ']:', returnData);
  //   return returnData;
  // }

  // private valueDataToForm(type: string, value: any): any {
  //   // this.logger.log(this, '~~~ FormManager.valueDataToForm() value[' + (typeof value) + ']:', value);
  //   let returnData = value;
  //   switch (type) {
  //     case 'date': // string to moment
  //       if (value && value !== '') {
  //         returnData = moment(value);
  //       }
  //       break;
  //     case 'number': // number to string
  //     returnData = Util.stringToNumber(value);
  //     break;
  //   }
  //   // this.logger.log(this, '~~~ FormManager.valueDataToForm() returnData[' + (typeof returnData) + ']:', returnData);
  //   return returnData;
  // }

  // private valueFormToData(key: string, value: any): any {
  //   this.logger.log(this, '~~~ FormManager.valueFormToData() value[' + (typeof value) + ']:', value);
  //   let returnData = value;
  //   switch (this.formStructure[key].type) {
  //     case 'date': // moment to string
  //       if (value instanceof moment) {
  //         returnData = moment(value).format('YYYY-MM-DD');
  //       }
  //       break;
  //     case 'number': // string to number
  //       returnData = Util.stringToNumber(value);
  //       break;
  //   }
  //   this.logger.log(this, '~~~ FormManager.valueFormToData() returnData[' + (typeof returnData) + ']:', returnData);
  //   return returnData;
  // }

  // private valueDataToForm(key: string, value: any): any {
  //   this.logger.log(this, '~~~ FormManager.valueDataToForm() value[' + (typeof value) + ']:', value);
  //   let returnData = value;
  //   switch (this.formStructure[key].type) {
  //     case 'date': // string to moment
  //       if (value && value !== '') {
  //         returnData = moment(value);
  //       }
  //       break;
  //     case 'number': // number to string
  //     returnData = Util.stringToNumber(value);
  //     break;
  //   }
  //   this.logger.log(this, '~~~ FormManager.valueDataToForm() returnData[' + (typeof returnData) + ']:', returnData);
  //   return returnData;
  // }

  // private createFormGroup() {
  //   this.logger.log(this, '~~~ FormManager.createFormGroup()');
  //   this.logger.log(this, '~~~ FormManager.ngOnInit() formData:', this.formData);
  //   const formDataKeys = Object.keys(this.formData);
  //   this.logger.log(this, '~~~ FormManager.ngOnInit() Object.keys(formData):', formDataKeys);
  //   const form = new FormGroup({});
  //   // formDataKeys.forEach((key) => {
  //   //   this.logger.log(this, '~~~ FormManager.ngOnInit() addControl key:', key, 'value:', this.formData[key]);
  //   //   // Object
  //   //   form.addControl(key, new FormControl({value: this.formData[key], disabled: false}, Validators.required));
  //   // });
  //   for (const [key, value] of Object.entries(this.formData)) {
  //     this.logger.log(this, '~~~ FormManager.ngOnInit() addControl key:', key, 'value:', value);
  //     form.addControl(key, new FormControl({value, disabled: false}, Validators.required));
  //   }
  //   // this.form.addControl('data', new FormControl({value: null, disabled: false}, Validators.required));
  //   // this.form.addControl('dipendente', new FormControl({value: null, disabled: false}, Validators.required));
  //   this.logger.log(this, '~~~ FormManager.ngOnInit() form:', form);
  //   this.form = form;
  // }
}

// export class FormManagerReal extends FormManager {
//   protected formStructure: {[key: string]: any};
//   protected onFormDataChanged(formData: object, oldFormData: object) {
//     throw new Error('Method not implemented.');
//   }
// }
