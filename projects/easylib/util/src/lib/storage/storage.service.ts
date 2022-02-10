import { Injectable } from '@angular/core';

// const APP_PREFIX = '@EL-';

import { Util } from '../util';
// import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: {[key:string]: any} = {};

  // public logs = false;


  /**
   * Called from ngrx meta-reducer
   * @param storageName array or string with storage to load
   * @returns object with storage on key
   */
  // public loadInitialState(storageName: string | Array<string>): object {
  //   console.log('StorageService.loadInitialState() storageName:', storageName);
  //   const initialState = {};
  //   if (storageName) {
  //     if (Util.isString(storageName)) {
  //       storageName = [ storageName ];
  //     }
  //     storageName.forEach((storageKey) => {
  //       if (!this.storage.hasOwnProperty(storageKey)) {
  //         console.log('StorageService.loadInitialState() load from localStorage... storageKey:', storageKey);
  //         const value = JSON.parse(localStorage.getItem(storageKey));
  //         console.log('StorageService.loadInitialState() loaded from localStorage: storageKey:', storageKey, 'value:', value);
  //         if (value) {
  //           this.storage[storageKey] = value;
  //         }
  //       }
  //       if (this.storage[storageKey]) {
  //         initialState[storageKey] = this.storage[storageKey];
  //         console.log('StorageService.loadInitialState() set initialState[' + storageKey + ']:', initialState[storageKey]);
  //       }
  //     });
  //   }
  //   console.log('StorageService.loadInitialState() return initialState:', initialState);
  //   return initialState;
  // }

  constructor() {}

  /**
   * Load values from LocalStorage.
   * @param storageName a string or an array of strings with key to load
   */
  public init(storageName: string | Array<string>): void {
    // console.log('StorageService.init() storageName:', storageName);
    if (storageName) {
      if (Util.isString(storageName)) {
        storageName = [ storageName ];
      }
      storageName.forEach((storageKey) => {
        if (!this.storage.hasOwnProperty(storageKey)) {
          // console.log('StorageService.loadInitialState() load from localStorage... storageKey:', storageKey);
          const storageValue = localStorage.getItem(storageKey);
          // console.log('StorageService.loadInitialState() load from localStorage... storageValue[' + (typeof storageValue) + ']:', storageValue);
          if (storageValue) {
            const value = JSON.parse(storageValue);
            // console.log('StorageService.loadInitialState() loaded from localStorage: storageKey:', storageKey, 'value:', value);
            if (value) {
              this.storage[storageKey] = value;
            }
          }
        }
      });
    }
  }

  /**
   * Save storage value to LocalStorage
   * @param key the key to get
   */
  private saveStorage(key: string): void {
    // console.log('StorageService.init() key:', key);
    localStorage.setItem(key, JSON.stringify(this.storage[key]));
  }

  /**
   * Set an item in storage. It can accept a path with dot notation.
   * @param key the key or path to use
   * @param value the value to store
   */
  public setItem(key: string, value: any): void {
    // console.log('StorageService.setItem() key:', key, 'value:', value);
    const keys = key.split('.');
    const storageName = keys.shift();
    if (storageName) {
      if (keys.length === 0) {
        this.storage[storageName] = value;
      }
      else {
        let storagePointer = this.storage[storageName];
        while (keys.length > 1) {
          const newKey = keys.shift();
          if (newKey) {
            storagePointer = storagePointer[newKey];
          }
        }
        storagePointer[keys[0]] = value;
      }
      this.saveStorage(storageName);
      // console.log('StorageService.setItem() storage:', this.storage);
    }
  }

  /**
   * Get an item from storage. It can accept a path with dot notation.
   * @param key the key or path to use
   * @returns the value
   */
  public getItem(key: string): any {
    // console.log('StorageService.getItem() key:', key, 'storage:', this.storage);
    // console.logService.log(this, '~~~ storage:', this.storage);
    const keys = key.split('.');
    let returnValue = this.storage;
    if (!returnValue.hasOwnProperty(key)) {
      this.init(key);
    }
    while (keys.length > 0) {
      const newKey = keys.shift();
      if (newKey) {
        returnValue = returnValue[newKey];
      }
    }
    return returnValue;
  }

  /**
   * Remove an item from storage. It can accept a path with dot notation.
   * @param key the key or path to use
   */
  public removeItem(key: string): void {
    // console.log('StorageService.removeItem() key:', key);
    const keys = key.split('.');
    const storageName = keys.shift();
    if (storageName) {
      if (keys.length === 0) {
        delete this.storage[storageName];
        localStorage.removeItem(storageName);
      }
      else {
        let storagePointer = this.storage[storageName];
        while (keys.length > 1) {
          const newKey = keys.shift();
          if (newKey) {
            storagePointer = storagePointer[newKey];
          }
        }
        delete storagePointer[keys[0]];
        this.saveStorage(storageName);
      }
      // console.log('StorageService.removeItem() storage:', this.storage);
    }
  }

  // clear(): void {
  //   // console.logService.logIf(this, 'clear() localStorage:', localStorage.getItem(this.storageName));
  //   localStorage.removeItem(this.storageName);
  //   this.storage = null;
  //   // console.logService.logIf(this, 'clear() localStorage:', localStorage.getItem(this.storageName));
  //   // localStorage.clear();
  // }

}
