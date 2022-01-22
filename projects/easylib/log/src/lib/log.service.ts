import { Injectable } from '@angular/core';
// import { CoreModule } from '../core.module';
import { Logger } from './logger';

/**
 * Use `LogService` to log to console.
 */
@Injectable({
  providedIn: 'root',
  // providedIn: CoreModule,
  // providedIn: 'any',
})
export class LogService {

  constructor() {
    // this.log('*** LogService constructor');
  }

  trace(...params: any): void {
    Logger.trace(...params);
  }
  log(...params: any): void {
    Logger.log(...params);
  }
  warn(...params: any): void {
    Logger.warn(...params);
  }
  error(...params: any): void {
    Logger.error(...params);
  }

  traceIf(...params: any): void {
    Logger.traceIf(...params);
  }
  logIf(...params: any): void {
    Logger.logIf(...params);
  }
  warnIf(...params: any): void {
    Logger.warnIf(...params);
  }
  errorIf(...params: any): void {
    Logger.errorIf(...params);
  }
}
