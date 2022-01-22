import { Component, ComponentRef, Directive, ElementRef, Input } from '@angular/core';
import { Loggable } from '@easylib/log';
import { BrowserTabsService } from './browser-tabs.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[browserTab]'
})
export class BrowserTabDirective extends Loggable {

  public logs = true;

  constructor(
    private comp: Component,
    private browserTabsService: BrowserTabsService,
    // private elementRef: ElementRef
  ) {
    super();
    // this.log('BrowserTabDirective.constructor() new BrowserTabDirective elementRef:', elementRef);
    this.log('BrowserTabDirective.constructor() new BrowserTabDirective component:', comp);
    this.log('BrowserTabDirective.constructor() browserTabsService:', browserTabsService);
    // const element = this.elementRef.nativeElement;
    // this.log('BrowserTabDirective.constructor() elementRef.nativeElement:', element);
  }

}
