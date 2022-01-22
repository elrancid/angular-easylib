import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

/**
 * 
 */
@Component({
  selector: 'easy-icon',
  template: `
    <mat-icon
    aria-hidden="false"
    aria-label="Example home icon"
    >{{ icon }}</mat-icon>
    <span *ngIf="information" class="cdk-visually-hidden">{{ information }}</span>
  `,
  styles: [`
    :host { display: inline-block; }
  `]
})
export class IconComponent {

  @Input() label?: string;
  // @Input() color: ThemePalette = 'primary'; // color: primary, accent, warn
  @Input() color: string = 'primary'; // color: primary, accent, warn

  /**
   * Information made available to screen-readers when the presence of an icon communicates some information.
   */
  @Input() information?: string;

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
  // @Input() loading = false; // disable icon and add spinner

  // @Output() clicked = new EventEmitter();

  constructor() {}
}
