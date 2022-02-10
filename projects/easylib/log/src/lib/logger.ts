// import { Directive } from '@angular/core';
// import * as moment from 'moment';
// import moment from 'moment';
import { Util } from '@easylib/util';
// import { isFunction } from 'lodash-es';

/**
 * Use `Logger` static methods to log to console.
 */
// @Directive()
export class Logger {

  static trace(...params: any): void {
    Logger.callLog('trace', ...params);
  }
  static log(...params: any): void {
    Logger.callLog('log', ...params);
  }
  static warn(...params: any): void {
    Logger.callLog('warn', ...params);
  }
  static error(...params: any): void {
    Logger.callLog('error', ...params);
  }

  static traceIf(...params: any): void {
    Logger.callLogIf('trace', ...params);
  }
  static logIf(...params: any): void {
    Logger.callLogIf('log', ...params);
  }
  static warnIf(...params: any): void {
    Logger.callLogIf('warn', ...params);
  }
  static errorIf(...params: any): void {
    Logger.callLogIf('error', ...params);
  }

  private static callLogIf(logLevel: string, ...params: any): void {
    const firstElement = params.shift();
    // console.log('callLogIf() logLevel:', logLevel, 'params:', params, 'obj:', obj);
    if (
      (Util.isObject(firstElement) &&
      firstElement.hasOwnProperty('logs') &&
      (firstElement as any).logs === true)
      || firstElement === true
    ) {
      Logger.callLog(logLevel, ...params);
    }
  }

  /**
   * https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
   * @param logLevel 
   * @param params 
   */
  private static callLog(logLevel: string, ...params: any): void {
    // console.log('callLog() logLevel:', logLevel, 'params1:', JSON.parse(JSON.stringify(params)), 'params:', params);
    // console.log('callLog()... params[' + (typeof params) + '|' + params.length + ']:', params);
    // params.unshift('[' + moment().format('YYYY-MM-DD HH:mm:ss.SSS') + '][' + Logger.getCallerName() + ']');
    const momentTime = Util.moment();
    const time = momentTime.format('HH:mm:ss.SSS');
    params.unshift('\x1b[35m%s\x1b[32m%s\x1b[0m', time + ' ', Logger.getCallerName() + ':');
    let consoleMethod;
    switch (logLevel) {
      // tslint:disable-next-line: no-console
      case 'trace': consoleMethod = console.trace; break;
      case 'log': consoleMethod = console.log; break;
      case 'warn': consoleMethod = console.warn; break;
      case 'error': consoleMethod = console.error; break;
    }
    if (consoleMethod) {
      consoleMethod.apply(Logger, params);
    }

  }

  private static getCallerName(depth: number = 5): string {
    const stack = new Error().stack;
    if (stack) {
      // console.log('stack:', stack);
      const stackArr = stack.split('\n', depth + 2);
      // console.log('stackArr:', stackArr);
      let rowStackArr = stackArr[depth - 1].split('at ', 2);
      // console.log('rowStackArr[1]:', rowStackArr[1]);
      if (rowStackArr[1].search(/^[\w\d]+.log(If)? \([\w]/) === 0) {
        rowStackArr = stackArr[depth].split('at ', 2);
      }
      // console.log('rowStackArr[1]:', rowStackArr[1]);
      if (rowStackArr[1].search(/^[\w\d]+.log(If)? \([\w]/) === 0) {
        rowStackArr = stackArr[depth + 1].split('at ', 2);
      }
      // console.log('rowStackArr[1]:', rowStackArr[1]);
      return rowStackArr.length > 1 ? rowStackArr[1] : rowStackArr[0].trim();
    }
    else {
      return '';
    }

    // const stackArr = stack.split('\n', depth + 2);
    // // console.log('stackArr:', stackArr);
    // let re = /([^(]+)@|at ([^(]+) \(/g;
    // // console.log('stackArr[depth + 1]:', stackArr[depth + 1]);
    // let aRegexResult = re.exec(stackArr[depth + 1]);
    // // console.log('aRegexResult:', aRegexResult);
    // if (!aRegexResult) {
    //   re = /([^(]+)@|at ([^(]+)/g;
    //   // console.log('********** stackArr[depth + 1]:', stackArr[depth + 1]);
    //   aRegexResult = re.exec(stackArr[depth + 1]);
    //   // console.log('********** aRegexResult:', aRegexResult);
    // }
    // return aRegexResult[1] || aRegexResult[2];

    // try {
    //   throw new Error();
    // } catch (e) {
    //   // const re = /(\w+)@|at (\w+) \(/g;
    //   const stack = e.stack;
    //   const stackArr = stack.split('\n', 3);
    //   const result = /(\w+)@|at ([\w\d\s]+) \(/g.exec(stackArr[2]);
    //   console.log('stack[' + (typeof stack) + ']:', stack);
    //   console.log('stackArr[' + (typeof stackArr) + ']:', stackArr);
    //   console.log('result[' + (typeof result) + ']:', result);
    //   console.log('result[' + (typeof result) + ']:', result);
    //   console.log('callerName:', result[2]);
    // }
    // console.log('callerName:', callerName);

    // {
    //   const stack = new Error().stack;
    //   console.log('stack:', stack);
    //   const stackArr = stack.split('\n', 3);
    //   console.log('stackArr:', stackArr);
    //   const re = /([^(]+)@|at ([^(]+) \(/g;
    //   const aRegexResult = re.exec(stackArr[2]);
    //   callerName = aRegexResult[1] || aRegexResult[2];
    // }
    // console.log('callerName:', callerName);

    // Logger.logs.push(message);
    // console.log(message);
    // Add each number to the total
    // console.log('log()... params[' + params.length + ']:', params)
    // let i = 0;
    // for (const arg of arguments) {
    //   console.log('argument[' + i + ']:', arg);
    //   i++;
    // }
    // console.log.call(arguments);

    // console.log('arguments.callee.caller:', arguments.callee.caller);
    // console.log('arguments.callee.caller.name:', arguments.callee.caller.name);
    // console.log('args.callee.caller:', args.callee.caller);
    // console.log('log.caller:', Logger.log.caller);
    // console.log('log.caller.name:', Logger.log.caller.name);

  }
}

/**
 * For color see: http://voidcanvas.com/make-console-log-output-colorful-and-stylish-in-browser-node/
 * @param logLevel trace | log | warn | error
 * @param params strings or object to log
 */
// private callLog(logLevel: string, ...params: any): void {
//   // console.log('callLog()... params[' + (typeof params) + '|' + params.length + ']:', params);
//   params.unshift('[' + moment().format('YYYY-MM-DD HH:mm:ss.SSS') + '][' + this.getCallerName(3) + ']');
//   console[logLevel].apply(this, params);
// }
// private callLogIf(logLevel: string, ...params: any): void {
//   if (this.logs) {
//     params.unshift('\x1b[34m%s\x1b[32m%s\x1b[0m', moment().format('HH:mm:ss.SSS') + ' ', this.getCallerName(3) + ':');
//     console[logLevel].apply(this, params);
//   }
// }

// private getCallerName(depth: number = 3): string {
//   const stack = new Error().stack;
//   // console.log('stack:', stack);
//   const stackArr = stack.split('\n', depth + 2);
//   const rowStackArr = stackArr[depth + 1].split('at ', 2);
//   return rowStackArr.length > 1 ? rowStackArr[1] : rowStackArr[0].trim();
// }

// console.log('stackArr:', stackArr);
// let re = /([^(]+)@|at ([^(]+) \(/g;
// // console.log('stackArr[depth + 1]:', stackArr[depth + 1]);
// let aRegexResult = re.exec(stackArr[depth + 1]);
// // console.log('aRegexResult:', aRegexResult);
// if (!aRegexResult) {
//   re = /([^(]+)@|at ([^(]+)/g;
//   // console.log('********** stackArr[depth + 1]:', stackArr[depth + 1]);
//   aRegexResult = re.exec(stackArr[depth + 1]);
//   // console.log('********** aRegexResult:', aRegexResult);
// }
// return aRegexResult[1] || aRegexResult[2];

// trace(...params: any): void {
//   this.callLog('trace', ...params);
// }
// traceIf(...params: any): void {
//   this.callLogIf('trace', ...params);
// }
// log(...params: any): void {
//   this.callLog('log', ...params);
// }
// logIf(...params: any): void {
//   this.callLogIf('log', ...params);
// }
// warn(...params: any): void {
//   this.callLog('warn', ...params);
// }
// warnIf(...params: any): void {
//   this.callLogIf('warn', ...params);
// }
// error(...params: any): void {
//   this.callLog('error', ...params);
// }
// errorIf(...params: any): void {
//   this.callLogIf('error', ...params);
// }

// private callLogIf(logLevel: string, ...params: any) {
//   const obj = params.shift();
//   // console.log('callLogIf()... obj:', obj, 'obj.logs:', obj.logs);
//   // if (_.isObject(obj) && obj.logs) {
//   if (this.logs) {
//     // console.log('callLog()... params[' + (typeof params) + '|' + params.length + ']:', params);
//     params.unshift('[' + moment().format('YYYY-MM-DD HH:mm:ss.SSS') + '][' + this.getCallerName() + ']');
//     console[logLevel].apply(this, params);
//   }
// }

// console.trace
// console.debug
// console.log
// console.info
// console.warn
// console.error
// console.table

// const label = 'Adolescent Irradiated Espionage Tortoises';
// console.group(label);
// console.info('Leo');
// console.info('Mike');
// console.info('Don');
// console.info('Raph');
// console.groupEnd(label);

// const spacing = '5px';
// const styles = `padding: ${spacing}; background-color: darkblue; color: white; font-style:
// italic; border: ${spacing} solid crimson; font-size: 2em;`;
// console.log('%cVariety is the spice of life', styles);

// console.time("answer time");
// alert("Click to continue");
// console.timeLog("answer time");
// alert("Do a bunch of other stuff...");
// console.timeEnd("answer time");
