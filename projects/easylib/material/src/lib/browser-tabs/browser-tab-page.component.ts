import { Component, ComponentRef, ElementRef, HostBinding, Input, ViewContainerRef } from '@angular/core';

import { LoggableComponent } from '@easylib/log';

/**
 * Extend `Loggable` in components and set boolean `logs` property
 * to enable logs. Use `this.log()` and the other methods to print to console
 * if `logs` is `true`.
 */
@Component({
  // selector: 'app-browser-tab-page',
  template: '<ng-content></ng-content>',
  // styles: [
  //   // ':host { display: block; height: 100%; }',
  //   ':host { display: block; height: 100%; overflow: auto; -webkit-overflow-scrolling: touch;',
  // ]
})
export class BrowserTabPageComponent extends LoggableComponent {

  @Input() logs = true;

  @HostBinding('attr.browser-tab-page') browserTabPage: string = '';

  constructor(
    // private elementRef: ElementRef,
    // private componentRef: ComponentRef<any>,
    // private viewContainerRef: ViewContainerRef,
  ) {
    super();
    // this.log('BrowserTabPageComponent.constructor()');
    // this.log('BrowserTabPageComponent.constructor() elementRef:', elementRef);
    // this.log('BrowserTabPageComponent.constructor() componentRef:', componentRef);
    // this.log('BrowserTabPageComponent.constructor() viewContainerRef:', viewContainerRef);
  }

  // destroy(): void {
  //   this.log('BrowserTabPageComponent.destroy()');
  //   // this.componentRef.destroy();
  // }
}
