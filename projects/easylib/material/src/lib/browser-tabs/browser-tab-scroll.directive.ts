import { Component, ComponentRef, Directive, ElementRef, Input } from '@angular/core';
import { Loggable } from '@easylib/log';
import { distinctUntilChanged } from 'rxjs/operators';
import { BrowserTabsService } from './browser-tabs.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[browser-tab-scroll]',
  host: {'(scroll)': 'browserTabScroll($event)'}
})
export class BrowserTabScrollDirective extends Loggable {

  public override logs = false;

  private scrollY: number = 0;
  private scrollX: number = 0;

  private element: Element;

  constructor(
    // private comp: Component,
    private browserTabsService: BrowserTabsService,
    private elementRef: ElementRef
  ) {
    super();
    this.element = elementRef.nativeElement;
    // this.log('BrowserTabScrollDirective.constructor() new BrowserTabScrollDirective elementRef:', elementRef);
    // this.log('BrowserTabDirective.constructor() new BrowserTabDirective elementRef:', elementRef);
    // this.log('BrowserTabDirective.constructor() new BrowserTabDirective elementRef.nativeElement:', elementRef.nativeElement);
    // this.log('BrowserTabDirective.constructor() new BrowserTabDirective elementRef.nativeElement.scrollTo:', elementRef.nativeElement.scrollTo);
    // this.log('BrowserTabDirective.constructor() new BrowserTabDirective component:', comp);
    // this.log('BrowserTabDirective.constructor() browserTabsService:', browserTabsService);
    // const element = this.elementRef.nativeElement;
    // this.log('BrowserTabDirective.constructor() elementRef.nativeElement:', element);

    // this.browserTabsService.scrollY$
    // // .pipe(distinctUntilChanged())
    // .subscribe((scrollY) => {
    //   if (this.scrollY !== scrollY) {
    //     this.log('BrowserTabScrollDirective. *** subscribe scrollY:', scrollY);
    //     this.scrollY = scrollY;
    //   }
    // });
    // this.browserTabsService.scrollX$
    // // .pipe(distinctUntilChanged())
    // .subscribe((scrollX) => {
    //   if (this.scrollX !== scrollX) {
    //     this.log('BrowserTabScrollDirective. *** subscribe scrollX:', scrollX);
    //     this.scrollX = scrollX;
    //   }
    // });

    this.browserTabsService.scrollPosition$
    // .pipe(distinctUntilChanged())
    .subscribe((position: [number, number]) => {
      if (this.scrollY !== position[1] || this.scrollX !== position[0]) {
        this.log('BrowserTabScrollDirective. *** subscribe scrollX:', scrollX);
        this.scrollToPosition(position);
      }
    });
  }

  scrollToPosition(position: [number, number]) {
    this.log("BrowserTabScrollDirective.scrollToPosition() x:", position[0], 'y:', position[1]);
    this.element.scrollTo({ top: position[1], left: position[0] });
    this.scrollX = position[0];
    this.scrollY = position[1];
  }

  browserTabScroll(event: Event) {
    // this.log("BrowserTabScrollDirective.browserTabScroll() event", event);
    // this.log("BrowserTabScrollDirective.browserTabScroll() event.target", event.target);
    // this.log("BrowserTabScrollDirective.browserTabScroll() scrollY", (event.target as any).scrollTop);
    // this.log('BrowserTabDirective.constructor() new BrowserTabDirective elementRef.nativeElement.scrollTop:', this.elementRef.nativeElement.scrollTop);
    // this.log("BrowserTabScrollDirective.browserTabScroll() scrollX", (event.target as any).scrollLeft);
    const component = (event.target as any);
    this.scrollY = component.scrollTop;
    this.scrollX = component.scrollLeft;
    // this.browserTabsService.scrollY$.next(this.scrollY);
    // this.browserTabsService.scrollX$.next(this.scrollX);
    this.browserTabsService.scrollPosition$.next([this.scrollX, this.scrollY]);
  }

}
