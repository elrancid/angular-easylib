// import { Logger } from 'src/app/core/log/logger';
// import { Logger } from '@easylib/log';

export default class Storage extends AbstractStorage {
  private static logs = true;

  private static storageName = 'pacman';

  private static storage = {};

  /**
   * Initialize storage from localStorage
   */
  static init(storageName: string): void {
    // Logger.logIf(Storage.logs, 'Storage.init() storageName:', storageName);
    if (storageName) {
      Storage.storageName = storageName;
    }
    Storage.storage = JSON.parse(localStorage.getItem(Storage.storageName));
    if (Storage.storage === null) {
      Storage.storage = {};
      Storage.saveStorage();
    // } else {
    //   Logger.logIf(Storage.logs, 'Storage.init() storage:', Storage.storage);
    }
  }

  /**
   * Save storage to localStorage
   */
  static saveStorage(): void {
    // Logger.logIf(Storage.logs, 'Storage.saveStorage() storage:', Storage.storage);
    localStorage.setItem(Storage.storageName, JSON.stringify(Storage.storage));
  }

  /**
   * Set item to storage.
   * @param key String key to store item
   * @param value Item to store
   */
  static setItem(key: string, value: any): void {
    // Logger.logIf(Storage.logs, 'Storage.setItem() key:', key, 'value:', value);
    Storage.storage[key] = value;
    Storage.saveStorage();
  }

  /**
   * Get item from storage.
   * @param key Item's string key
   * @return Stored item
   */
  static getItem(key: string): any {
    // Logger.logIf(Storage.logs, 'Storage.getItem() key:', key, 'value:', Storage.storage[key]);
    return Storage.storage[key];
  }

  /**
   * Remove item from storage.
   * @param key Item's string key
   */
  static removeItem(key: string): void {
    // Logger.logIf(Storage.logs, 'Storage.removeItem() key:', key);
    delete Storage.storage[key];
    Storage.saveStorage();
  }

  /**
   * Clear storage.
   */
  static clear(): void {
    // Logger.logIf(Storage.logs, 'Storage.clear()');
    localStorage.removeItem(Storage.storageName);
    Storage.storage = null;
  }

}
