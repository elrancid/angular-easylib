import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

import { ThemePalette } from '@angular/material/core';

// import { Loggable } from '../../Loggable';
import { Loggable } from '@easylib/log';

@Component({
  selector: 'easy-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent extends Loggable implements OnInit {

  @Input() label?: string;
  @Input() labelPosition: "before" | "after" = 'after'; // after (default) or before
  // @Input() disabled = false;
  @Input() controlName?: string;
  @Input() form?: FormGroup;
  @Input() checked?: boolean;
  @Input() color?: ThemePalette = 'primary';
  // @Output() change: EventEmitter<boolean>;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  onChange(event: any): void {
    this.logIf('ToggleComponent.onChange() event(MatSlideToggleChange):', event);
  }
}
