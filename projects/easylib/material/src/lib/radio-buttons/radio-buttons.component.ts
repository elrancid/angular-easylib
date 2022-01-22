import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { ThemePalette } from '@angular/material/core';
import { LoggableComponent } from '@easylib/log';

@Component({
  selector: 'easy-radio-buttons',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['./radio-buttons.component.scss']
})
export class RadioButtonsComponent extends LoggableComponent implements OnInit, OnDestroy {

  // @Input() label: string;
  @Input() controlName?: string;
  // @Input() hint: string;
  @Input() form?: FormGroup;
  @Input() itemValuePath?: string;
  @Input() itemLabelPath?: string;
  @Input() items?: Array<any>;
  @Input() color: ThemePalette = 'primary';

  // private stop$: Subject<void> = new Subject();

  constructor() {
    super();
  }

  ngOnInit(): void {
    // console.log('RadioButtonsComponent.ngOnInit() logs:', this.logs);
    // this.log('RadioButtonsComponent.ngOnInit() form:', this.form);
    // this.form.valueChanges
    // .pipe(
    //   takeUntil(this.stop$),
    //   // distinctUntilChanged(),
    // )
    // .subscribe((value) => {
    //   this.log('RadioButtonsComponent.ngOnInit() form.valueChanges:', value);
    // });
  }

  ngOnDestroy(): void {
    // this.stop$.next();
    // this.stop$.complete();
  }

}
