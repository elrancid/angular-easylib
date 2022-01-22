import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { LoggableComponent } from '@easylib/log';

@Component({
  selector: 'easy-select',
  templateUrl: './select.component.html',
  styles: [
    ':host { display: block; }',
    'mat-form-field { display: block; }',
  ],
  // styleUrls: ['./select.component.scss'],
})
export class SelectComponent extends LoggableComponent implements OnInit, OnDestroy {

  @Input() logs = false;

  @Input() label?: string;
  @Input() hint?: string;
  @Input() placeholder?: string;
  @Input() disabled: boolean = false;

  @Input() controlName?: string;
  @Input() form?: FormGroup;
  // private form$: Subscription; // for this.form.get(this.controlName).valueChanges

  @Input() formControl: FormControl;
  // private formControl$: Subscription;

  @Input() itemValuePath: string = "value";
  @Input() itemLabelPath: string = "label";

  private stop$ = new Subject();

  private _initEnded = false;

  /**
   * [items] = [
   *   { label: "label1" , value: "value1" }
   *   { label: "..." , value: "..." }
   * ]
   */
  private _items?: Array<any>;
  get items(): Array<any> | undefined {
    return this._items;
  }
  @Input() set items(items: Array<any> | undefined) {
    this._items = items;
    this.log('SelectComponent set items:', items);
    // this.log('SelectComponent set items() form:', this.form);
    // this.log('SelectComponent set items() controlName:', this.controlName);
    if (this.controlName) {
      this.log('SelectComponent set items() form.get(' + this.controlName+').value:', this.form?.get(this.controlName)?.value);
      // if (this.form) {
        const formValue = this.form?.get(this.controlName)?.value;
        if (formValue) {
          this.onFormValueUpdated(formValue);
        }
        // else {
          // this.updateFilterItems();
        // }
      // }
    }
  }
  // private _filters: object = null;
  // get filters (): object {
  //   return this._filters;
  // }
  // @Input() set filters (filters: object) {
  //   this._filters = filters;
  //   this.updateFilterItems();
  // };

  // public filteredItems: Array<any>;

  constructor() {
    super();
    this.formControl = new FormControl();
  }

  ngOnInit(): void {
    this.logIf('SelectComponent.ngOnInit()');
    this.logIf('SelectComponent.ngOnInit() form:', this.form, 'controlName:', this.controlName);
    if (!this.controlName) {
      return;
    }
    const formValue = this.form?.get(this.controlName)?.value;
    const formControlValue = this.formControl.value;
    this.logIf('SelectComponent.ngOnInit() formValue[' + (typeof formValue) + ']:', formValue, 'formControlValue[' + (typeof formControlValue) + ']:', formControlValue);
    this.logIf('SelectComponent.ngOnInit() itemValuePath:', this.itemValuePath, 'itemLabelPath:', this.itemLabelPath);
    if (formControlValue !== formValue) {
      this.onFormValueUpdated (formValue);
    }

    this.logIf('SelectComponent.ngOnInit() subscribe formControl...');
    // this.formControl$ = this.formControl.valueChanges
    this.formControl.valueChanges
    .pipe(
      takeUntil(this.stop$),
      // startWith(''),
      distinctUntilChanged(),
    )
    .subscribe((value) => {
      this.logIf('SelectComponent formControl.valueChanges subscribe() value[' + (typeof value) + ']:', value);
      if (this._initEnded) {
        this.onFormControlValueUpdated(value);
      }
    });

    this.logIf('SelectComponent.ngOnInit() subscribe form...');
    // this.form$ = this.form.get(this.controlName).valueChanges
    this.form?.get(this.controlName)?.valueChanges
    .pipe(
      takeUntil(this.stop$),
      distinctUntilChanged(),
    )
    .subscribe((value) => {
      this.logIf('SelectComponent form.get(' + this.controlName + ').valueChanges value[' + (typeof value) + ']:', value);
      if (this._initEnded) {
        this.onFormValueUpdated(value);
      }
    });
    this._initEnded = true;
    this.logIf('SelectComponent.ngOnInit() END');
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }

  /**
   * Called when the form value is changed: changed the real form value (from outside).
   */
  onFormValueUpdated(formValue: any) {
    // const formValue = this.form.get(this.controlName).value;
    const formControlValue = this.formControl.value;
    this.log('SelectComponent.onFormValueUpdated() formValue[' + (typeof formValue) + ']:', formValue, 'formControlValue[' + (typeof formControlValue) + ']:', formControlValue, 'itemValuePath:', this.itemValuePath, 'itemLabelPath:', this.itemLabelPath);
    if (formControlValue !== formValue) {
      this.log('SelectComponent.onFormValueUpdated() apply formControl value:', formValue);
      this.formControl.setValue(formValue);
    }
    // if (!this._items || !this.itemValuePath || !this.itemLabelPath) {
    //   return;
    // }
    // if (formValue) {
    //   const foundElement = this._items.find((element) => {
    //     return element[this.itemValuePath] === formValue;
    //   });
    //   this.log('SelectComponent.onFormValueUpdated() foundElement:', foundElement);
    //   if (foundElement) {
    //     this.log('onFormValueUpdated() formControl - current value:', formControlValue, 'new value:', foundElement[this.itemLabelPath], 'form:', foundElement[this.itemValuePath]);
    //     if (foundElement[this.itemLabelPath] !== formControlValue) {
    //       this.formControl.setValue(foundElement[this.itemLabelPath]);
    //       this.log('onFormValueUpdated() aggiornato formControl value:', this.formControl.value);
    //     } else {
    //       this.log('onFormValueUpdated() valore già settato nel formControl... skip write');
    //     }
    //   }
    // } else {
    //   if (formControlValue !== '') {
    //     this.log('SelectComponent.onFormControlValueUpdated() set formControll empty');
    //     this.formControl.setValue('');
    //   }
    // }
  }

  /**
   * Called when the form control value is changed: changed the string in this form (from inside).
   */
  onFormControlValueUpdated(formControlValue: any) {
    const formValue = this.form?.get(this.controlName!)?.value;
    // const formControlValue = this.formControl.value;
    this.log('SelectComponent.onFormControlValueUpdated() formValue[' + (typeof formValue) + ']:', formValue, 'formControlValue[' + (typeof formControlValue) + ']:', formControlValue, 'itemValuePath:', this.itemValuePath);
    if (formValue !== formControlValue) {
      this.log('SelectComponent.onFormValueUpdated() apply form value:', formControlValue);
      this.form?.get(this.controlName!)?.setValue(formControlValue);
    }
    // if (!this._items) {
    //   return;
    // }
    // if (formControlValue) {
    //   const foundElement = this._items.find((element) => {
    //     // this.log('SelectComponent.onFormControlValueUpdated() element:', element, 'itemLabelPath:', this.itemLabelPath, 'element[itemLabelPath]:', element[this.itemLabelPath]);
    //     return element[this.itemLabelPath] === formControlValue;
    //   });
    //   this.log('SelectComponent.onFormControlValueUpdated() foundElement:', foundElement);
    //   if (foundElement) {
    //     this.log('SelectComponent.onFormControlValueUpdated() form - current value:', formValue, 'new value:', foundElement[this.itemValuePath], 'label:', foundElement[this.itemLabelPath]);
    //     if (foundElement[this.itemValuePath] !== formValue) {
    //       this.form.get(this.controlName).setValue(foundElement[this.itemValuePath]);
    //     } else {
    //       this.log('SelectComponent.onFormControlValueUpdated() valore già settato nel form... skip write');
    //     }
    //   }
    // } else {
    //   if (formValue !== null) {
    //     this.log('SelectComponent.onFormControlValueUpdated() set form null');
    //     this.form.get(this.controlName).setValue(null);
    //   }
    // }
    // this.updateFilterItems();
  }

  // updateFilterItems() {
  //   const formValue = this.form.get(this.controlName).value;
  //   const formControlValue = this.formControl.value;
  //   // default: get all items;
  //   let returnFilteredItems = this._items;
  //   if (this.filters) {
  //     returnFilteredItems = returnFilteredItems.filter((item) => {
  //       // this.log('SelectComponent.updateFilterItems() item:', item)
  //       let result = true;
  //       for (const [key, value] of Object.entries(this.filters)) {
  //         // this.log('SelectComponent.updateFilterItems() filter key:', key, 'value:', value, 'item[key]:', item[key]);
  //         if (item.hasOwnProperty(key) && item[key] !== value) {
  //           result = false;
  //         }
  //       }
  //       // this.log('SelectComponent.updateFilterItems() filter item:', item, 'result:', result);
  //       return result;
  //     });
  //   }
  //   this.log('SelectComponent.updateFilterItems() formControlValue[' + (typeof formControlValue) + ']:', formControlValue)
  //   if (formControlValue) {
  //     let foundElement = null;
  //     if (formValue) {
  //       // if formValue is set and formControlValue is the value relative to formValue, show all data
  //       foundElement = returnFilteredItems.find((element) => {
  //         return element[this.itemLabelPath] === formControlValue;
  //       });
  //       this.log('SelectComponent.updateFilterItems() foundElement:', foundElement);
  //     }
  //     if (!foundElement) {
  //       const filterValue = formControlValue.toLowerCase();
  //       this.log('SelectComponent.updateFilterItems() filterValue:', filterValue)
  //       returnFilteredItems = returnFilteredItems.filter((item) => {
  //         // this.logger.log(this, '*** item:', item);
  //         return item[this.itemLabelPath].toLowerCase().includes(filterValue);
  //       });
  //     }
  //   }
  //   this.filteredItems = returnFilteredItems;
  // }

}
