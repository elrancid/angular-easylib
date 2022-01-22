import { Directive, ViewContainerRef, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[dynamic]',
})
export class DynamicComponentDirective {

  constructor(
    public viewContainerRef: ViewContainerRef,
    // private elementRef: ElementRef,
  ) {
    // console.log('new DynamicComponentDirective viewContainerRef:', viewContainerRef);
    // console.log('new DynamicComponentDirective elementRef:', elementRef);
    // console.log('SubTest1Component.constructor() data:', this.data);
  }

}
