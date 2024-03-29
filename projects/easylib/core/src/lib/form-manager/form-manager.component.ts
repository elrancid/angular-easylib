import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { FormManager } from './form-manager';

/**
 * Extends this class to manage form.
 * Set var "formStructure" or call "setFormStructure()" function.
 * formStructure: {
 *   [field_name]: {
 *     type: string, // date, integer
 *     required: boolean, // default false
 *     value: any, // value to apply
 *     default: any, // TODO
 *   },
 *   ...
 * }
 * Implements "onFormDataChanged()" to listen form data changes.
 */
@Component({
  template: '',
})
export abstract class FormManagerComponent extends FormManager implements OnInit, OnDestroy {

  @Input() override logs = false;
  @Input() overridelogsForm = false;

  @Input() override set formData(formData: {[key: string]: any}) {
    this.logIf(this.logsForm, '~~~ FormManagerComponent.set formData():', formData);
    if (formData) {
      super.formData = formData as {[key: string]: any};
    }
  }
  @Output() formDataChange = new EventEmitter();

  public override get formData(): {[key: string]: any} {
    return super.formData;
    // return this._formData;
  }

  // get formData(): object {
  //   return this._formData;
  // }

  // constructor(
  //   // protected logger: LoggerService,
  // ) {
  //   super();
  //   this.logIf(this.logsForm, '~~~ FormManagerComponent constructor');
  //   // if (this.formStructure) {
  //   //   this.setFormStructure(this.formStructure);
  //   // }
  //   // this.logger.log(this, '~~~ FormManager.constructor()');
  //   // this.logger.log(this, '~~~ FormManager.constructor() classType:', this.classType);
  //   // this.logger.log(this, '~~~ FormManager.constructor() formData:', this.formData);
  // }

  override trace(...params: any): void { super.trace(params); }
  override log(...params: any): void { super.log(params); }
  override warn(...params: any): void { super.warn(params); }
  override error(...params: any): void { super.error(params); }
  override traceIf(...params: any): void { super.traceIf(params); }
  override logIf(...params: any): void { super.logIf(params); }
  override warnIf(...params: any): void { super.warnIf(params); }
  override errorIf(...params: any): void { super.errorIf(params); }

  ngOnInit(): void {
    this.logIf(this.logsForm, '~~~ FormManagerComponent.ngOnInit() formStructure:', this.formStructure);
    this.init();
  }

  ngOnDestroy(): void {
    this.logIf(this.logsForm, '~~~ FormManagerComponent.ngOnDestroy()');
    this.destroy();
  }

  protected override emitFormDataChanged(formData: {[key: string]: any}): void {
    this.logIf(this.logsForm, '~~~ FormManagerComponent.emitFormDataChanged() formData:', formData);
    this.formDataChange.emit(formData);
  }

  // trace(...params: any): void {
  //   super.trace(...params);
  // }
  // log(...params: any): void {
  //   super.log(...params);
  // }
  // warn(...params: any): void {
  //   super.warn(...params);
  // }
  // error(...params: any): void {
  //   super.error(...params);
  // }
  // traceIf(...params: any): void {
  //   super.traceIf(...params);
  // }
  // logIf(...params: any): void {
  //   super.logIf(...params);
  // }
  // warnIf(...params: any): void {
  //   super.warnIf(...params);
  // }
  // errorIf(...params: any): void {
  //   super.errorIf(...params);
  // }

}
