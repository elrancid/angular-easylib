import { Logger } from './logger';

/**
 * Extend `Loggable` in components and set boolean `logs` property
 * to enable logs. Use `this.log()` and the other methods to print to console
 * if `logs` is `true`.
 */
export abstract class Loggable {

  public logs = false;

  // constructor(private Logger: LoggerService) {
  constructor() {
    this.log('Loggable constructor');
  }

  trace(...params: any): void {
    if (this.logs) {
      Logger.trace(...params);
    }
  }
  log(...params: any): void {
    if (this.logs) {
      Logger.log(...params);
    }
  }
  warn(...params: any): void {
    if (this.logs) {
      Logger.warn(...params);
    }
  }
  error(...params: any): void {
    if (this.logs) {
      Logger.error(...params);
    }
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
