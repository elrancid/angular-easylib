import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHeaders, HttpRequest, HttpResponse,
  HttpInterceptor, HttpHandler
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';

import { RequestCache, RequestCacheEntry } from '../cache/request-cache.service';
// import { searchUrl } from '../cache/package-search/package-search.service';
import { Loggable } from '../../Loggable';


/**
 * If request is cachable (e.g., package search) and
 * response is in cache return the cached response as observable.
 * If has 'x-refresh' header that is true,
 * then also re-run the package search, using response from next(),
 * returning an observable that emits the cached response first.
 *
 * If not in cache or not cachable,
 * pass request through to next()
 */
@Injectable()
export class CachingInterceptor extends Loggable implements HttpInterceptor {
  constructor(
    private cache: RequestCache
  ) {
    super();
    this.logs = true;
    this.logIf('CachingInterceptor.constructor() °°°°°°°°°°°°°°°°°°°°°');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.logIf('CachingInterceptor.intercept() °°° request.urlWithParams:', request.urlWithParams);
    // continue if not cachable.
    const cacheHeader = request.headers.get('X-cache');
    this.logIf('CachingInterceptor.intercept() °°° cacheHeader[' + (typeof cacheHeader) +']:', cacheHeader);
    if (!cacheHeader || (cacheHeader !== 'cache' && cacheHeader !== 'reload')) {
      return next.handle(request);
    }

    // const cachedEntry = this.cache.get(request);
    // this.logIf('CachingInterceptor.intercept() °°° cachedEntry:', cachedEntry);
    let cachedResponse = null;
    let cachedOutdated = true;
    // if (cachedEntry) {
    //   cachedResponse = cachedEntry.response;
    //   cachedOutdated = cachedEntry.outdated;
    //   this.logIf('CachingInterceptor.intercept() °°° cachedResponse:', cachedResponse);
    //   this.logIf('CachingInterceptor.intercept() °°° cachedOutdated:', cachedOutdated);
    // }

    // New header without X-cache:
    const keys = request.headers.keys();
    const newObj = {};
    keys.forEach((key) => {
      if (key !== 'X-cache') {
        newObj[key] = request.headers.get(key);
      }
    });
    this.logIf('CachingInterceptor.intercept() °°° newObj:', newObj);
    const httpHeaders = new HttpHeaders(newObj);
    this.logIf('CachingInterceptor.intercept() °°° USE: httpHeaders:', httpHeaders);
    request = request.clone({ headers: httpHeaders} );

    // cache-then-refresh
    // if (request.headers.get('x-refresh')) {
    if (cacheHeader === 'reload') {
      const results$ = this.sendRequest(request, next, this.cache);
      return cachedResponse ?
        results$.pipe( startWith(cachedResponse) ) :
        results$;
    } else {
      // cache-or-fetch
      return cachedOutdated ? this.sendRequest(request, next, this.cache) : of(cachedResponse);
    }
  }

  private sendRequest (request: HttpRequest<any>, next: HttpHandler, cache: RequestCache): Observable<HttpEvent<any>> {
    this.logIf('CachingInterceptor.sendRequest() °°° request:', request);
    // No headers allowed in npm search request
    // const noHeaderReq = request.clone({ headers: new HttpHeaders() });
    return next.handle(request).pipe(
      tap((event) => {
        this.logIf('CachingInterceptor.sendRequest() °°° handle pipe event:', event);
        // There may be other events besides the response.
        if (event instanceof HttpResponse) {
          this.logIf('CachingInterceptor.sendRequest() °°° event instanceof HttpResponse. call cache.put()...');
          // cache.put(request, event); // Update the cache.
        }
      })
    );
  }
}


/** Is this request cachable? */
// function isCachable(req: HttpRequest<any>) {
//   return false; // TODO
//   // Only GET requests are cachable
//   return req.method === 'GET' &&
//     // Only npm package search is cachable in this app
//     -1 < req.url.indexOf(searchUrl);
// }

/**
 * Get server response observable by sending request to `next()`.
 * Will add the response to the cache on the way out.
 */
// function sendRequest(
//   request: HttpRequest<any>,
//   next: HttpHandler,
//   cache: RequestCache
// ): Observable<HttpEvent<any>> {
//   this.logIf('CachingInterceptor.sendRequest() °°° request:', request);

//   // No headers allowed in npm search request
//   const noHeaderReq = request.clone({ headers: new HttpHeaders() });

//   return next.handle(noHeaderReq).pipe(
//     tap((event) => {
//       this.logIf('CachingInterceptor.sendRequest() °°° handle pipe event:', event);
//       // There may be other events besides the response.
//       if (event instanceof HttpResponse) {
//         cache.put(request, event); // Update the cache.
//       }
//     })
//   );
// }
