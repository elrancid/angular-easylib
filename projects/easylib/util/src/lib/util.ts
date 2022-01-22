import * as moment from 'moment';
import { isString, isObject, isArray, cloneDeep } from 'lodash-es';

export class Util {

  /**
   * Parse value to number.
   * @param value String value
   * @return Number value, null if fails.
   */
  static toNumber(value: any): number|null {
    // https://flaviocopes.com/how-to-convert-string-to-number-javascript/
    if (!value) {
      return null;
    }
    const num = +value;
    if (value === '' || isNaN(num)) {
      return null;
    }
    return num;
  }

  /**
   * Parse value to string.
   * @param value Number value
   * @return String value, null if fails.
   */
  static toString(value: any): string|null {
    if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
      return null;
    }
    if (value instanceof moment) {
      return moment(value).format('YYYY-MM-DD');
    }
    // https://stackoverflow.com/questions/5765398/whats-the-best-way-to-convert-a-number-to-a-string-in-javascript
    return value.toString();
  }

  /**
   * Copy object with Object.assign
   * @param value the object to clone
   */
  static copyObject(obj: object): object {
    // const newObj = {};
    // Object.assign(newObj, obj);
    // return newObj;
    return { ...obj };
  }

  /**
   * Clone deep an object or array
   * @param value the object to clone
   */
  static cloneDeep(value: any): any {
    // return JSON.parse(JSON.stringify(value));
    return cloneDeep(value);
  }

  static isEqual(value1: any, value2: any): boolean {
    return JSON.stringify(value1) === JSON.stringify(value2);
    // return _.isEqual(value1, value2);
  }

  // ********************************* FROM LODASH *****************************

  /**
   * Checks if value is classified as a String primitive or object.
   * @param value — The value to check.
   * @return — Returns true if value is correctly classified, else false.
   */
  static isString(value?: any): value is string {
    return isString(value);
  }

  /**
   * Checks if value is the language type of Object. (e.g. arrays, functions,
   * objects, regexes, new Number(0), and new String(''))
   * @param value — The value to check.
   * @return — Returns true if value is an object, else false.
   */
  static isObject(value?: any): value is object {
    return isObject(value);
  }

  /**
   * Checks if value is classified as an Array object.
   * @param value — The value to check.
   * @return — Returns true if value is correctly classified, else false.
   */
  static isArray(value?: any): value is object {
    return isArray(value);
  }
}
