import { Component, Input } from '@angular/core';

import { Loggable } from './loggable';

/**
 * Extend `Loggable` in components and set boolean `logs` property
 * to enable logs. Use `this.log()` and the other methods to print to console
 * if `logs` is `true`.
 */
@Component({
  template: '',
})
export class LoggableComponent extends Loggable {

  @Input() logs = false;

  constructor() {
    super();
  }

  // trace(...params: any): void {
  //   if (this.logs) {
  //     Logger.trace(...params);
  //   }
  // }
  // log(...params: any): void {
  //   if (this.logs) {
  //     Logger.log(...params);
  //   }
  // }
  // warn(...params: any): void {
  //   if (this.logs) {
  //     Logger.warn(...params);
  //   }
  // }
  // error(...params: any): void {
  //   if (this.logs) {
  //     Logger.error(...params);
  //   }
  // }
}
