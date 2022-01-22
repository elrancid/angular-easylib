import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, FormArray, AbstractControl, AbstractControlOptions } from '@angular/forms';
import { empty, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, catchError, map, tap, retry, takeUntil } from 'rxjs/operators';

// import { LoggableComponent } from '../core/log/loggable.component';
// import { Loggable } from '../../../core/log/loggable';
import { Loggable } from '@easylib/log';

import { Moment } from 'moment';
import * as moment from 'moment';
import { Util } from '@easylib/util';

const emptyValue = null;

/**
 * For validators see https://angular.io/api/forms/Validators
 * For array see https://netbasal.com/angular-reactive-forms-the-ultimate-guide-to-formarray-3adbe6b0b61a
 */
export interface FieldStructure {
  type: 'string' | 'number' | 'boolean' | 'date' | 'custom' | 'array',
  value?: any,
  structure?: FieldStructure, // for array type
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
export type ArrayStructure = FieldStructure[];
// export type Structure = FieldStructure | ArrayStructure | FormStructure;
// export type Structure = FieldStructure | ArrayStructure;

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
  // protected formControls: {[key:string]: FormControl} = {};

  private isFormDataChanging = false;

  // private stop$: Subject<void> = new Subject();

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
      this.setFormStructure(this.formStructure);
    }
  }

  destroy(): void {
    this.logIf(this.logsForm, '~~~ FormManager.destroy()');
    this.unsubscribeAll();
    // this.stop$.next();
    // this.stop$.complete();
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
  // public pushFieldArray(field: string): void {
  //   // this.form
  // }
  /**
   * For fieldArray: remove a FormControl from an array defined as simple fieldArray (array of fields)
   */
  // public removeFieldArray(field: string, index: number): void {
  // }

  private getValidators(fieldStructure: FieldStructure): ValidatorFn | ValidatorFn[] | AbstractControlOptions | null | undefined {
    const validators = [];
    if (fieldStructure.required) {
      validators.push(Validators.required);
    }
    if (fieldStructure.email) {
      validators.push(Validators.email);
    }
    // if (fieldStructure.min) {
    //   validators.push(Validators.min);
    // }
    // if (fieldStructure.max) {
    //   validators.push(Validators.max);
    // }
    if (fieldStructure.minLength) {
      validators.push(Validators.minLength(fieldStructure.minLength));
    }
    if (fieldStructure.maxLength) {
      validators.push(Validators.maxLength(fieldStructure.maxLength));
    }
    if (fieldStructure.requiredTrue) {
      validators.push(Validators.requiredTrue);
    }
    if (fieldStructure.pattern) {
      validators.push(Validators.pattern(fieldStructure.pattern));
    }
    if (fieldStructure.validation) {
      validators.push(fieldStructure.validation);
    }
    return validators;
  }

  public pushFormArray(path: string, element?: any, notifyDataChanged: boolean = true) {
    this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() path:', path, 'element:', element, 'notifyDataChanged:', notifyDataChanged);
    // get FormArray
    const formArray = this.form?.get(path) as FormArray;
    this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() formArray:', formArray);
    if (typeof formArray.push === 'function') {
      // get metadata
      const arrayStructure = (formArray as any).fieldStructure as FieldStructure;
      if (arrayStructure.type === 'array' && arrayStructure.structure) {
        if (notifyDataChanged) {
          this.oldFormData = this._formData;
          this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() save oldFormData and prepare new formData...');
          this._formData = Util.cloneDeep(this._formData);
        }
        const fieldStructure = arrayStructure.structure;
        this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() fieldStructure:', fieldStructure);
        const length = formArray.length;
        this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() length:', length);
        // const formDataArray = this.getParentKeyByPath(this._formData, path);
        const formDataArray = this.getObjectPath(this._formData, path);
        this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() formDataArray:', formDataArray);
        // if (fieldStructure instanceof Object) {
        // if (fieldStructure.hasOwnProperty('type') && typeof (fieldStructure as FieldStructure).type === 'string') {
        if (fieldStructure) {
          // START FieldStructure
          this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() fieldStructure.type:', fieldStructure.type);
          switch (fieldStructure.type) {
          case 'custom':
            // Only create FormData
            formDataArray.push(element);
            this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() -custom- formDataArray:', formDataArray);
            break;
          case 'array':
            // TODO
            break;
          default:
            const dataValue = this.toDataValue(fieldStructure.type, element);
            const formValue = this.toFormValue(fieldStructure.type, element);
            const disabled: boolean = !!fieldStructure.disabled;
            this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() element:', element, 'dataValue:', dataValue, 'formValue:', formValue);
            // Create FormData
            formDataArray.push(element);
            // Create FormControl
            const formControl = new FormControl({value: formValue, disabled}, this.getValidators(fieldStructure));
            // force add metadata to FormControl
            (formControl as any).fieldStructure = fieldStructure;
            // force add FormData link to FormControl
            // (formControl as any).formDataParent = formArray;
            // (formControl as any).formDataKey = length;
            // this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() formDataParent:', formArray, 'formDataKey:', length, 'fieldStructure:', fieldStructure);
            this.logIf(this.logsForm, '~~~ FormManager.pushFormArray() addControl formControl:', formControl);
            formArray.push(formControl);
            // create subscription
            const formControlsubscription = formControl
            .valueChanges
            .pipe(
              // takeUntil(this.stop$),
              distinctUntilChanged(),
            )
            .subscribe((value) => {
              const index = formArray.controls.findIndex(control => control === formControl);
              this.logIf(this.logsForm, '~~~ FormManager formControl.valueChanges:', value, 'path:', path, 'formArray:', formArray, 'formControl:', formControl, 'index:', index, 'this:', this);
              this.setFormDataValue(path + '.' + index, value);
            });
            // push subscription to formControls$ array
            this.formControls$.push(formControlsubscription);
            // force add subscription to formControl
            (formControl as any).subscription = formControlsubscription;
            // this.formControls[key] = formControl;
            break;
          }
          // END FieldStructure
        }
        // else {
        //   // START FormStructure
        //   const groupStructure = (value as FormStructure);
        //   this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() *FormStructure* TODO!!!!!! prefixKey:', prefixKey, 'key:', key, 'groupStructure:', groupStructure);
        //   // END FormStructure
        // }
        if (notifyDataChanged) {
          this.formDataChanged();
        }
      }
    }
  }

  public removeAtFormArray(path: string, index: number, notifyDataChanged: boolean = true) {
    this.logIf(this.logsForm, '~~~ FormManager.removeFormArray() path:', path, 'index:', index);
    // get FormArray
    const formArray = this.form?.get(path) as FormArray;
    this.logIf(this.logsForm, '~~~ FormManager.removeFormArray() formArray:', formArray);
    let formDataArray = this.getObjectPath(this._formData, path);
    if (typeof formArray.push === 'function' && Array.isArray(formDataArray)) {
      if (notifyDataChanged) {
        this.oldFormData = this._formData;
        this.logIf(this.logsForm, '~~~ FormManager.removeFormArray() save oldFormData and prepare new formData...');
        this._formData = Util.cloneDeep(this._formData);
        formDataArray = this.getObjectPath(this._formData, path);
      }
      formArray.removeAt(index);
      formDataArray.splice(index, 1);
      if (notifyDataChanged) {
        this.formDataChanged();
      }
    }
  }

  private setFormStructureRecursive(
    prefixKey: string,
    structure: FormStructure,
    abstractControl: AbstractControl,
    formData: {[key: string]: any}
    ) {
    this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() prefixKey:', prefixKey, 'structure:', structure, 'abstractControl:', abstractControl, 'formData:', formData);
    for (const [key, value] of Object.entries(this.formStructure)) {
      if (value instanceof Object) {
        if (value.hasOwnProperty('type') && typeof (value as FieldStructure).type === 'string') {
          // START FieldStructure
          const fieldStructure = (value as FieldStructure);
          this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() *FieldStructure* type:', fieldStructure.type, 'key:', key, 'fieldStructure:', fieldStructure);
          switch (fieldStructure.type) {
          case 'custom':
            // Only create FormData
            if (fieldStructure.value) {
              formData[key] = fieldStructure.value;
            }
            else {
              formData[key] = emptyValue;
            }
            this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() -custom- key:', key, 'value:', formData[key]);
            break;
          case 'array':
            // Create FormData
            formData[key] = [];
            // Create FormArray
            const formArray = new FormArray([], this.getValidators(fieldStructure));
            // force add metadata to FormArray
            (formArray as any).fieldStructure = fieldStructure;
            this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() addControl key:', key, 'formArray:', formArray);
            (abstractControl as FormGroup).addControl(key, formArray);
            this.formControls$.push(
              formArray.valueChanges
              .pipe(
                // takeUntil(this.stop$),
                distinctUntilChanged(),
              )
              .subscribe((value) => {
                this.logIf(this.logsForm, '~~~ FormManager formArray.valueChanges:', value, 'prefixKey:', prefixKey, 'key:', key, 'this:', this);
                // this.setFormDataValue(prefixKey + key, value);
              })
            );
            if (fieldStructure.value && Array.isArray(fieldStructure.value)) {
              fieldStructure.value.forEach((element, index) => {
                this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() index:', index, 'element:', element);
                // for every value add to formArray
                this.pushFormArray(prefixKey + key, element, false);
              });
            }
            break;
          default:
            const useValue = formData && formData.hasOwnProperty(key) ? formData[key] : fieldStructure.value;
            const dataValue = this.toDataValue(fieldStructure.type, useValue);
            const formValue = this.toFormValue(fieldStructure.type, useValue);
            const disabled: boolean = !!fieldStructure.disabled;
            this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() key:', key, 'useValue:', useValue, 'dataValue:', dataValue, 'formValue:', formValue);
            // Create FormData
            if (!formData.hasOwnProperty('key') || formData[key] !== dataValue) {
              if (formData[key] !== emptyValue) {
                this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() !!! CONTROLLARE !!! formData originale:', useValue, 'diverso da nuovo form data impostato:', dataValue);
              }
              formData[key] = dataValue;
            }
            // Create FormControl
            const formControl = new FormControl({value: formValue, disabled}, this.getValidators(fieldStructure));
            // force add metadata to FormControl
            (formControl as any).fieldStructure = fieldStructure;
            // (formControl as any).formDataParent = formData;
            // (formControl as any).formDataKey = key;
            this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() addControl key:', key, 'formControl:', formControl);
            (abstractControl as FormGroup).addControl(key, formControl);
            this.formControls$.push(
              formControl.valueChanges
              .pipe(
                // takeUntil(this.stop$),
                distinctUntilChanged(),
              )
              .subscribe((value) => {
                this.logIf(this.logsForm, '~~~ FormManager formControl.valueChanges:', value, 'prefixKey:', prefixKey, 'key:', key, 'this:', this);
                this.setFormDataValue(prefixKey + key, value);
              })
            );
            // this.formControls[key] = formControl;
            break;
          }
          // END FieldStructure
        }
        // else {
        //   // START FormStructure
        //   const groupStructure = (value as FormStructure);
        //   this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() *FormStructure* TODO!!!!!! prefixKey:', prefixKey, 'key:', key, 'groupStructure:', groupStructure);
        //   // END FormStructure
        // }
      }
      // else if (Array.isArray(value)) {
      //   // START ArrayStructure
      //   const arrayStructure = (value as ArrayStructure);
      //   this.logIf(this.logsForm, '~~~ FormManager.setFormStructureRecursive() *ArrayStructure* prefixKey:', prefixKey, 'key:', key, 'arrayStructure:', arrayStructure);
      //   // END ArrayStructure
      // }
    }

  }

  protected setFormStructure(formStructure: FormStructure): void {
    this.logIf(this.logsForm, '~~~ FormManager.setFormStructure() formStructure:', formStructure);
    this.formStructure = formStructure;
    if (this.form) {
      this.unsubscribeAll();
    }
    this.formControls$ = [];
    // this.formControls = {};
    this.form = new FormGroup({});
    this.setFormStructureRecursive('', this.formStructure, this.form, this._formData);

    this.logIf(this.logsForm, '~~~ FormManager.setFormStructure() form:', this.form);
    this.formDataChanged();
  }

  // private getObjectPath(path: string, rootObj: {[key:string]: any}): any {
  //   const pathArr = path.split('.');
  //   const firstStep = pathArr.shift();
  //   if (firstStep) {
  //     let result: {[key:string]: any} = rootObj[firstStep] as {[key:string]: any};
  //     result = rootObj[firstStep];
  //     if (pathArr.length >= 0) {
  //       pathArr.forEach((keyStep: string) => {
  //         // console.log('keyStep:', keyStep);
  //         if (result.hasOwnProperty(keyStep)) {
  //           result = result[keyStep];
  //         }
  //         else {
  //           result = {};
  //         }
  //       });
  //     }
  //     if (result !== {}) {
  //       return result;
  //     }
  //   }
  //   return undefined;
  // }

  private getObjectPath(root: {[key: string]: any}, path: string): any {
    const [parent, key] = this.getParentKeyByPath(root, path);
    return parent[key];
  }
  private getParentKeyByPath(root: {[key: string]: any}, path: string): [any, string] {
    let formDataParent: {[key: string]: any} = root;
    let formDataKey: string = path;
    const deepPath = (path.indexOf('.') > 0);
    if (deepPath) {
      const pathArr = path.split('.');
      this.logIf(this.logsForm, '~~~ FormManager.getParentKeyByPath() deepPath pathArr:', pathArr);
      const firstStep = pathArr.shift();
      formDataParent = root[firstStep!];
      formDataKey = pathArr[0];
    }
    return [formDataParent, formDataKey];
  }

  /**
   * Set a single form field value.
   * @param path form path
   * @param value form value
   */
  protected setFormDataValue(path: string, value: any): void {
    this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() path:', path, 'value:', value);
    // get FormControl
    const abstractControl = this.form?.get(path) as AbstractControl;
    if (!abstractControl) return;
    this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() abstractControl:', abstractControl);
    const fieldStructure = (abstractControl as any).fieldStructure as FieldStructure;
    this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() fieldStructure:', fieldStructure);

    if (fieldStructure.type !== 'array') {
      const formControl = this.form?.get(path) as FormControl;
      // get FormData
      let [ formDataParent, formDataKey ] = this.getParentKeyByPath(this._formData, path);
      this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() this._formData:', this._formData, 'formDataParent:', formDataParent, 'formDataKey:', formDataKey);
      if (formDataParent && formDataKey) {
        const formDataValue = formDataParent[formDataKey];
        const newDataValue = this.toDataValue(fieldStructure.type, value);
        // compare current formData value
        if (formDataValue !== newDataValue) {
          // update oldFormData and _formData
          this.oldFormData = this._formData;
          this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() type:', fieldStructure.type, 'path:', path, 'value:', value, 'newDataValue:', newDataValue, 'set formData...');
          this._formData = Util.cloneDeep(this._formData);
          // set new data
          [ formDataParent, formDataKey ] = this.getParentKeyByPath(this._formData, path);
          formDataParent[formDataKey] = newDataValue;

          this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() formDataParent:', formDataParent, 'this._formData:', this._formData);
          this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() _formData:', this._formData, 'formDataParent[formDataKey]:', newDataValue);
          // this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() ok ~~~ _formData:', this._formData);
          const formValue = this.toFormValue(fieldStructure.type, value);
          this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() formValue:', formValue);
          if (!this.areValuesEquals(formControl?.value, formValue)) {
            this.logIf(this.logsForm, '~~~ FormManager.setFormDataValue() type:', fieldStructure.type, 'path:', path, 'value:', value, 'formValue:', formValue, 'set form...');
            formControl?.setValue(formValue);
          }
          this.formDataChanged();
        }
      }
    }
    else {
      this.warnIf(this.logsForm, '~~~ FormManager.setFormDataValue() -array- TODO!!!!!!!!');
    }
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
          if (type === 'array') {
            if (Array.isArray(value)) {
              this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() -array- type:', type, 'value[' + (typeof value) + ']:', value);
              const elementStructure = this.formStructure[key].structure;
              const elementType = elementStructure?.type;
              this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() elementStructure:', elementStructure, 'elementType:', elementType);
              const formDataArray = this._formData[key];
              const newDataArrayValue = (formDataArray as Array<any>).map((element) => {
                return this.toDataValue(elementType!, element);
              });
              this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() newFormData[key]:', newFormData[key], 'newDataArrayValue:', newDataArrayValue);
              if (value.length !== formDataArray && !Util.isEqual(newFormData[key], newDataArrayValue)) {
                this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() not equals: set new values...');
                // set FormData
                newFormData[key] = newDataArrayValue;

                // get formControls
                this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() ... get formControls...');
                const currentFormArray = this.form?.get(key) as FormArray;
                this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() ... currentFormArray:', currentFormArray, 'length:', currentFormArray.length);
                for (let i=0; i < currentFormArray.length; i++) {
                  const currentFormControl = currentFormArray.get('' + i) as FormControl;
                  this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() ... #' + i, 'currentFormControl:', currentFormControl);
                  // force get subscription from formControl
                  const formControlSubscription = (currentFormControl as any).subscription as Subscription;
                  this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() ... #' + i, 'formControlSubscription:', formControlSubscription);
                  // get subscription index
                  const currentFormSubscriptionIndex = this.formControls$.findIndex((subscription: Subscription, index: number) => {
                  this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() ... #' + i, 'currentFormSubscriptionIndex:', currentFormSubscriptionIndex);
                    return formControlSubscription === subscription;
                  });
                  this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() ... #' + i, 'currentFormSubscriptionIndex:', currentFormSubscriptionIndex);
                  if (currentFormSubscriptionIndex >=0) {
                    // Remove from formControls$ array
                    this.logIf(this.logsForm, '~~~ FormManager.setFormDataValues() ... #' + i, 'FOUND! index:', currentFormSubscriptionIndex);
                    this.formControls$.splice(currentFormSubscriptionIndex, 1);
                    // unsubscribe
                    formControlSubscription.unsubscribe();
                  }
                  else {
                    this.warnIf(this.logsForm, '~~~ FormManager.setFormDataValues() ... #' + i, 'WARNING!! SUBSCRIPTION NOT FOUND IN ARRAY !!!!!!');
                  }
                }
                // reset formDataArray
                currentFormArray.clear();
                // add new FormControls in FormArray
                value.forEach((element: any) => {
                  this.pushFormArray(key, element, false);
                })
                this.warnIf(this.logsForm, '~~~ FormManager.setFormDataValues() ... new formArray:', currentFormArray);
              }
            }
            else {
              this.log('~~~ FormManager.setFormDataValues() ......!!! CONTROLLARE !!! value{' + (typeof value) + '}:', value, 'non è un array');
            }
          }
          else {
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

  /**
   * Reset data to formStructure default values
   */
  public reset() {
    // TODO: fare reset anche per arrayField
    this.logIf(this.logsForm, '~~~ FormManager.reset()');
    const newFormData: {[key: string]: any} = {};
    for (const [key, formFieldStructure] of Object.entries(this.formStructure)) {
      newFormData[key] = formFieldStructure.hasOwnProperty('value') ? formFieldStructure.value : emptyValue;
    }
    this.setFormDataValues(newFormData);
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
      return emptyValue;
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
      return emptyValue;
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
      return emptyValue;
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
