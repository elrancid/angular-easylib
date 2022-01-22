import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

// import { Loggable } from '../../log/loggable';
import { Loggable } from '@easylib/log';
// import { ApiService } from '../api.service';
// import { StorageService } from '../../../shared/utils/storage/storage.service';
import { StorageService } from '@easylib/util';
// import { MessageService } from '../../log/message.service';

import * as moment from 'moment';
import { ApiResponse } from '../api-response';

export interface RequestCacheEntry {
  url: string; // DB entity or lowercase call
  response: ApiResponse | null; // response array
  updated: string | null; // updated DB datetime
  retrieve: string | null; // retrieve datetime
  outdated: boolean;
}

// export abstract class RequestCache {
//   abstract init(): void;
//   // abstract get(req: HttpRequest<any>): HttpResponse<any> | null;
//   abstract get(url: string): RequestCacheEntry | null;
//   // abstract get(req: HttpRequest<any>): RequestCacheEntry | null;
//   abstract put(req: HttpRequest<any>, response: HttpResponse<any>): void
// }

const maxAge = 30000; // maximum cache age (ms)

@Injectable({
  providedIn: 'root'
})
export class RequestCache extends Loggable {
// export class RequestCache extends Loggable implements RequestCache {

  // public logs = true;

  // private cache: Map<string, RequestCacheEntry>;
  private cache: {[key: string]: RequestCacheEntry} = {};

  constructor(
    // private messenger: MessageService
    // private api: ApiService,
    private storage: StorageService,
  ) {
    super();
  }

  init(entityDatetime: Array<{name: string, updated: string}>): void {
    // Load cache from storage
    const storageCache = this.storage.getItem('cache');
    // this.log('RequestCache.init() °°° storage cache:', storageCache);
    if (!storageCache) {
      this.cache = {};
      // this.log('RequestCache.init() °°° created new cache:', this.cache);
    } else {
      this.cache = storageCache;
      // this.log('RequestCache.init() °°° loaded cache:', this.cache);
    }
    this.log('RequestCache.init() storage cache:', this.cache);

    // Set old cache as outdated
    const currentDate = moment();
    for (const [key, entry] of Object.entries(this.cache)) {
      this.log('RequestCache.init() --> key:', key, 'entry:', entry, 'retrieve:', entry.retrieve, 'outdated:', entry.outdated);
      const entryDate = moment(entry.retrieve);
      // this.log('RequestCache.init() -->--> entryDate:', entryDate.format('YYYY-MM-DD HH:mm:ss.SSS'));
      const diffHours = currentDate.diff(entryDate, 'hours');
      if (entry.retrieve !== null) this.log('RequestCache.init() -->--> key:', key, 'diffHours:', diffHours, 'entryDate:', entryDate.format('YYYY-MM-DD HH:mm:ss.SSS'), 'currentDate:', currentDate.format('YYYY-MM-DD HH:mm:ss.SSS'));
      if (diffHours >= 24) {
        this.log('RequestCache.init() -->--> 24 <= diffHours:', diffHours);
        this.cache[key].outdated = true;
      }
    }

    // Update entityDatetime from DB
    this.log('RequestCache.init() cache:', this.cache);
    this.log('RequestCache.init() entityDatetime:', entityDatetime);
    entityDatetime.forEach((element: {name: string, updated: string}) => {
      const key = element.name.toLowerCase();
      const cached = this.cache.hasOwnProperty(key) ? this.cache[key] : null;
      // this.log('RequestCache.init() °°° key:', key, 'element.updated:', element.updated, 'cached:', cached);
      if (cached) {
        // this.log('RequestCache.init() °°° cached.updated:', cached.updated, 'element.updated:', element.updated, 'cached.response:', cached.response);
        if (!cached.response) {
          this.cache[key].outdated = true;
          // this.log('RequestCache.init() °°° °°° set cache[' + key + '].outdated = true - no response');
        }
        else {
          if (cached.updated === element.updated) {
            // this.log('RequestCache.init() °°° °°° set cache[' + key + '].outdated = false');
            this.cache[key].outdated = false;
          } else {
            // this.log('RequestCache.init() °°° °°° set cache[' + key + '].outdated = true - cache:', cached.updated, 'updated:', element.updated);
            this.cache[key].updated = element.updated;
            this.cache[key].outdated = true;
          }
        }
      } else {
        const entry: RequestCacheEntry = {
          url: element.name,
          response: null,
          updated: element.updated,
          retrieve: null,
          outdated: true,
        };
        // this.log('RequestCache.init() °°° °°° new entry:', entry);
        this.cache[key] = entry;
      }
    });
    this.log('RequestCache.init() save new cache:', this.cache);
    // this.log('RequestCache.init() °°° °°° °°° cache[tipofase]:', this.cache.tipofase);
    // this.log('RequestCache.init() °°° °°° °°° cache[tipoattivita]:', this.cache.tipoattivita);
    this.storage.setItem('cache', this.cache);
  }

  public clear () {
    this.storage.setItem('cache', null);
  }

  /**
   * 
   * @param request 
   */
  // get(request: HttpRequest<any>): HttpResponse<any> | null {
  get(url: string): RequestCacheEntry | null {
    url = this.normalizeUrl(url);
    this.log('RequestCache.get() url:', url, 'cache:', this.cache);
    if (!this.cache.hasOwnProperty(url)) {
      // cache not yet created
      const entry: RequestCacheEntry = {
        url,
        response: null,
        updated: null,
        retrieve: moment().toISOString(),
        outdated: true,
      };
      this.log('RequestCache.get() --> new cache to add:', entry);
      this.cache[url] = entry;
    }
    this.log('RequestCache.get() --> return:', this.cache[url]);
    return this.cache[url];
    // const cached = this.cache.get(url);
    // this.log('RequestCache.get() °°°°°°° request:', request, 'url:', url, 'cached:', cached);
    // if (!cached) {
    //   return null;
    // }
    // const isExpired = cached.lastRead < (Date.now() - maxAge);
    // // this.messenger.add(`Found ${expired}cached response for "${url}".`);
    // this.log('RequestCache.get() Found ' + (isExpired ? 'expired ' : '') + 'cached response for "' + url + '".');
    // return isExpired ? null : cached.response;
  }

  /**
   * 
   * @param request 
   */
  // get (request: HttpRequest<any>): RequestCacheEntry | null {
  //   let url = request.urlWithParams;
  //   url = url.toLowerCase();
  //   url = url.substring(url.indexOf('/api/') + 5);
  //   this.log('RequestCache.get() °°°°°°° request:', request, 'request.urlWithParams:', url);
  //   this.log('RequestCache.get() °°°°°°° cache:', this.cache);
  //   let entry = null;
  //   if (!this.cache.hasOwnProperty(url)) {
  //     // cache not yet created
  //     entry = {
  //       url,
  //       response: null,
  //       updated: (new Date()).toString(),
  //       outdated: true,
  //     };
  //     this.log('RequestCache.get() °°°°°°° new cache to add:', entry);
  //     // this.cache[url] = entry;
  //   } else {
  //     entry = this.cache[url];
  //   }
  //   this.log('RequestCache.get() °°°°°°° return entry:', entry);
  //   return entry;
  //   // const cached = this.cache.get(url);
  //   // this.log('RequestCache.get() °°°°°°° request:', request, 'url:', url, 'cached:', cached);
  //   // if (!cached) {
  //   //   return null;
  //   // }
  //   // const isExpired = cached.lastRead < (Date.now() - maxAge);
  //   // // this.messenger.add(`Found ${expired}cached response for "${url}".`);
  //   // this.log('RequestCache.get() Found ' + (isExpired ? 'expired ' : '') + 'cached response for "' + url + '".');
  //   // return isExpired ? null : cached.response;
  // }

  /**
   * 
   * @param request 
   * @param response 
   */
  put(url: string, response: ApiResponse): void {
    url = this.normalizeUrl(url);
    this.log('RequestCache.put() url:', url, 'cache:', this.cache);
    // this.log('RequestCache.put() °°°°°°° this.cache[' + url + ']:', this.cache[url]);
    // this.messenger.add(`Caching response from "${url}".`);
    // const entry: RequestCacheEntry = {
    //   url,
    //   response,
    //   updated: Date.now().toString(),
    //   outdated: false
    // };
    // this.log('RequestCache.get() °°°°°°° set cache url:', url, 'entry:', entry);
    this.cache[url].response = response;
    this.cache[url].outdated = false;
    this.cache[url].retrieve = moment().format('YYYY-MM-DD HH:mm:ss.SSSZ');
    this.log('RequestCache.put() --> new this.cache[' + url + ']:', this.cache[url]);
    this.storage.setItem('cache', this.cache);
    // this.log('RequestCache.put() Request cache size:', this.cache.size);
    // this.messenger.add(`Request cache size: ${this.cache.size}.`);
  }

  /**
   * 
   * @param request 
   * @param response 
   */
  // put (request: HttpRequest<any>, response: HttpResponse<any>): void {
  //   const url = request.urlWithParams;
  //   this.log('RequestCache.put() °°°°°°° request:', request, 'request.urlWithParams:', url);
  //   this.log('RequestCache.get() °°°°°°° cache:', this.cache);
  //   return;
  //   // this.messenger.add(`Caching response from "${url}".`);

  //   // const entry = { url, response, lastRead: Date.now() };
  //   // this.cache.set(url, entry);

  //   // // remove expired cache entries
  //   // const expired = Date.now() - maxAge;
  //   // this.cache.forEach((entry) => {
  //   //   if (entry.lastRead < expired) {
  //   //     this.cache.delete(entry.url);
  //   //   }
  //   // });

  //   // this.log('RequestCache.put() Request cache size:', this.cache.size);
  //   // this.messenger.add(`Request cache size: ${this.cache.size}.`);
  // }

  private normalizeUrl(url: string): string {
    // return url.toLowerCase().replace('/', '_');
    return url.toLowerCase();
  }
}
