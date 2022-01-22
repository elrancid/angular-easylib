import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

/**
 * 
 */
@Component({
  selector: 'easy-button',
  template: `
    <button
    mat-button
    [type]="type"
    [color]="color"
    [disabled]="disabled"
    [matTooltip]="tooltip"
    attr.aria-label="{{ label }}">
      {{ label }}
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
  `]
})
export class ButtonComponent {

  @Input() label?: string;
  // @Input() color: ThemePalette = 'primary'; // color: primary, accent, warn
  @Input() color: string = 'primary'; // color: primary, accent, warn
  @Input() disabled: boolean = false;
  @Input() type: string = 'button';
  @Input() tooltip: string = '';

  @Output() press: EventEmitter<any> = new EventEmitter();
  @HostListener('click', ['$event']) clickInside(event: Event) {
    if (!this.disabled) {
      this.press.emit();
    }
    // event.preventDefault();
    // event.stopPropagation();
    // return false;
  }

  // @Input() placeholder: string;
  // @Input() accessibility = true;

  // @Input() tooltip: string;
  // @Input() loading = false; // disable button and add spinner

  // @Output() clicked = new EventEmitter();

  constructor() {}

  // onClick(evt) {
  //   this.logIf('onClick evt:', evt);
  //   this.clicked.emit(evt);
  // }
}
