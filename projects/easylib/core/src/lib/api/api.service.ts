import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, startWith, tap, retry } from 'rxjs/operators';

import { Util } from '@easylib/util';

// import { LoggerService } from '../logger.service';
// import { Loggable } from '../log/loggable';
import { Loggable } from '@easylib/log';
import { RequestCache, RequestCacheEntry } from '../api/cache/request-cache.service';
import { CacheRequestType } from '../api/cache/cache-request-type';

import { ApiResponse } from './api-response';
import { HttpOptions, HttpOptionsFull } from './http-options';
import { RouterService } from '../router/router.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends Loggable {
  public logs = false;
  // debugDatetime: Date;

  private pathUrl = 'http://localhost:80/api/';
  // private pathUrl = 'https://storybox.life/api/';

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    // 'Accept': 'application/json',
    // 'Response-Type': 'json',
    // 'Referrer-Policy': 'no-referrer',
    // 'Referer': 'http://pacman.manaly.it:80/api/',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // 'Content-Type': 'multipart/form-data',
    // Authorization: 'my-auth-token'
  });

  // private httpOptions = {
  //   headers: this.httpHeaders
  //   // responseType: 'json'
  // };

  constructor(
    private http: HttpClient,
    private cache: RequestCache,
    private router: RouterService,
  ) {
    super();
    // const location = this.router.getLocationData();
    // this.pathUrl = location.protocol + '//' + location.hostname + '/api/';
    this.pathUrl = this.router.getOrigin() + '/api/';
  }

  // private getPathUrl(): string {
  //   this.router.printAll();
  //   return this.pathUrl;
  // }

  // debugInstance() {
  //   this.log('debugDatetime: ' + this.debugDatetime.toString());
  // }

  // updateAuthorization(newToken: string) {
  //   this.httpOptions.headers = this.httpOptions.headers.set('Authorization', newToken);
  // }

  /**
   * After user. Load 'pacman/entityDatetime' fromDB for cache
   */
  // async init(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.log('ApiService.init() call pacman/entityDatetime');
  //     this.callApiGet('pacman/entityDatetime')
  //     .then((result: Array<object>) => {
  //       this.log('ApiService.init() result:', result);
  //       this.cache.init(result);
  //       resolve();
  //     })
  //     .catch((error) => {
  //       this.log('ApiService.init() error:', error);
  //       reject(error);
  //     });
  //   });
  // }

  async resetCache(): Promise<void> {
    this.cache.clear();
    // return this.init();
  }

  public async callApiGet(url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none): Promise<any> {
    return this.callApi('GET', url, params, cacheRequestType);
  }
  public async callApiPost(url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none): Promise<any> {
    return this.callApi('POST', url, params, cacheRequestType);
  }
  public async callApiPut(url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none): Promise<any> {
    return this.callApi('PUT', url, params, cacheRequestType);
  }
  public async callApiPatch(url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none): Promise<any> {
    return this.callApi('PATCH', url, params, cacheRequestType);
  }
  public async callApiDelete(url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none): Promise<any> {
    return this.callApi('DELETE', url, params, cacheRequestType);
  }

  /**
   * Call an API with specified method and return a promise.
   * @param method GET, POST, PUT, PATCH, DELETE
   * @param url Url to call withoit prefix
   * @param params Params to add
   * @param cacheRequestType string:
   *   null: no cache
   *   'cache': return cache if present
   *   'reload': return cache if present and reload the cache
   * @returns Promise<any>
   */
  public async callApi(
    method: string,
    url: string,
    params?: object,
    cacheRequestType: CacheRequestType = CacheRequestType.none,
  ): Promise<any> {
    this.log('ApiService.callApi() method:', method, 'url:', url, 'params:', params, 'cacheRequestType:', cacheRequestType);
    return new Promise((resolve, reject) => {
      // this.log('ApiService.callApi() call getApi...');
      this.getApi(method, url, params, cacheRequestType)
      .subscribe(
        (response: object) => {
          this.log('ApiService.callApi() next method="' + method + '" url="' + url + '" response:', response);
          return resolve(response);
        },
        (error) => {
          this.log('ApiService.callApi() error method="' + method + '" url="' + url + '" error:', error);
          return reject(error);
        },
        () => {
          this.log('ApiService.callApi() complete method="' + method + '" url="' + url + '"');
        }
      );
    });
  }

  public sendMultipartFormData(
    url: string,
    params?: object,
    cacheRequestType: CacheRequestType = CacheRequestType.none,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const method = 'POST';
      this.logs = true;
      this.log('ApiService.sendMultipartFormData() method:', method, 'url:', url, 'params:', params, 'cacheRequestType:', cacheRequestType);
      const headers = new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      });
      this.log('ApiService.sendMultipartFormData() params:', params);
      const formData: FormData = new FormData();
      if (Util.isObject(params)) {
        this.log('ApiService.sendMultipartFormData() params is Object...');
        Object.entries(params).forEach((entry) => {
          const [key, value] = entry;
          this.log('ApiService.sendMultipartFormData() key:', key, 'value:', value);
          if (Util.isArray(value)) {
            (value as Array<any>).forEach((element) => {
              this.log('ApiService.sendMultipartFormData() element:', element);
              let fileName: any;
              if (element instanceof File && typeof element.name == 'string') {
                fileName = element.name;
                this.log('ApiService.sendMultipartFormData() element name:', fileName, 'type:', element.type);
              }
              this.log('ApiService.sendMultipartFormData() °°°°° APPEND key:', key, 'fileName:', fileName, 'element:', element);
              formData.append(key+'[]', element, fileName);
            });
          }
          else {
            this.log('ApiService.sendMultipartFormData() °°°°° APPEND key:', key, 'value:', value);
            formData.append(key, value);
          }
        });
        // for (const key in params) {
        //   // this.log('ApiService.sendMultipartFormData() key:', key);
        //   if (params.hasOwnProperty(key)) {
        //     const value = params[key];
        //     this.log('ApiService.sendMultipartFormData() key:', key, 'value:', value);
        //     formData.append(key, value);
        //   }
        // }
      }


      // let params = new HttpParams();
      // let formData = new FormData();
      // formData.append('upload', this.selectedFileEl.nativeElement.files[0])
      // const options = {
      //     headers: new HttpHeaders().set('Authorization', this.loopBackAuth.accessTokenId),
      //     params: params,
      //     reportProgress: true,
      //     withCredentials: true,
      // }
      // this.http.post('http://localhost:3000/api/FileUploads/fileupload', formData, options)
      

      // this.getApi(method, url, formData, cacheRequestType, headers)
      // const request = new HttpRequest('POST', this.pathUrl + url, formData, {
      //   headers,
      //   reportProgress: true,
      //   withCredentials: true,
      // });
      // this.http.request<ApiResponse>(request)
      this.http.post<ApiResponse>(this.pathUrl + url, formData, {
        // headers,
        reportProgress: true,
        withCredentials: true,
      })
      .pipe(
        // retry(3), // retry a failed request up to 3 times
        map((response: ApiResponse) => {
          this.log('ApiService.sendMultipartFormData() pipe() map() response:', response);
          if (response.data) {
            return response.data;
          }
          return response;
        }),
        catchError((error) => {
          this.log('ApiService.sendMultipartFormData() - catchError - error:', error);
          return this.handleError(error);
        }),
      )
      .subscribe(
        (response: object) => {
          this.log('ApiService.sendMultipartFormData() next method="' + method + '" url="' + url + '" response:', response);
          return resolve(response);
        },
        (error) => {
          this.log('ApiService.sendMultipartFormData() error method="' + method + '" url="' + url + '" error:', error);
          return reject(error);
        },
        () => {
          this.log('ApiService.sendMultipartFormData() complete method="' + method + '" url="' + url + '"');
          this.logs = false;
        }
      );
    });
  }

  public getApiGet(url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none): Observable<any> {
    return this.getApi('GET', url, params, cacheRequestType);
  }
  public getApiPost(url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none): Observable<any> {
    return this.getApi('POST', url, params, cacheRequestType);
  }
  public getApiPut(url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none): Observable<any> {
    return this.getApi('PUT', url, params, cacheRequestType);
  }
  public getApiPatch(url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none): Observable<any> {
    return this.getApi('PATCH', url, params, cacheRequestType);
  }
  public getApiDelete(url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none): Observable<any> {
    return this.getApi('DELETE', url, params, cacheRequestType);
  }

  public getApi(method: string, url: string, params?: object, cacheRequestType: CacheRequestType = CacheRequestType.none, headers?: HttpHeaders): Observable<any> {
    this.log('ApiService.getApi() method:', method, 'url:', url, 'params:', params,
    'cacheRequestType[' + (typeof cacheRequestType) + ']:', cacheRequestType);
    // this.log('ApiService.getApi() °°° url.trim()[' + (typeof (url.trim())) + ']:', url.trim());
    if (!url.trim()) {
      this.log('ApiService.getApi() !url.trim() !!!!!!!! return...');
      // if not search term, return empty hero array.
      return of({
        status: 'error',
        result: 'Not Found',
        message: 'Url not set',
      });
    }

    // Check cache
    let cacheResponse: ApiResponse | null = null;
    let cacheOutdated = true;
    let cacheUrl = '';
    switch (cacheRequestType) {
      case CacheRequestType.cache:
      case CacheRequestType.forceCache:
      case CacheRequestType.cacheReload:
      case CacheRequestType.forceCacheReload:
      case CacheRequestType.reload: {
        // this.log('ApiService.getApi() °°° cacheRequestType:', cacheRequestType);
        // create httpParamsString
        let httpParamsString = '';
        if (params && Util.isObject(params)) {
          let httpParams = new HttpParams();
          Object.entries(params).forEach((entry) => {
            const key = entry[0];
            const value = entry[1];
            // this.log('ApiService.getApi() °°° ...key:', key, 'value:', value);
            httpParams = httpParams.set(key, value);
          });
          // this.log('ApiService.getApi() °°° ...httpParams:', httpParams);
          httpParamsString = httpParams.toString();
          // this.log('ApiService.getApi() °°° ...httpParams.toString()[' + (typeof httpParamsString) + ']:', httpParamsString);
        }
        // get cache url + params
        cacheUrl = url + (httpParamsString !== '' ? '?' + httpParamsString : '');
        this.log('ApiService.getApi() cache get url:', url);
        const cacheEntry = this.cache.get(cacheUrl);
        this.log('ApiService.getApi() cacheEntry:', cacheEntry);
        if (cacheEntry) {
          cacheResponse = cacheEntry.response;
          cacheOutdated = cacheEntry.outdated;
          // this.log('ApiService.getApi() °°° cacheResponse:', cacheResponse);
          // this.log('ApiService.getApi() °°° cacheOutdated:', cacheOutdated);
          this.log('ApiService.getApi() cachedResponse:',
            Util.isArray(cacheResponse) ? 'Array' :
            Util.isObject(cacheResponse) ? 'Object' : cacheResponse,
            'cachedOutdated:', cacheOutdated
          );
        }
      }
      break;
    }

    // Check if return only cache
    switch (cacheRequestType) {
      case CacheRequestType.cache:
      case CacheRequestType.forceCache:
        if (cacheResponse && !cacheOutdated) {
          // exit return only with cache data
          return of(cacheResponse);
        }
    }

    // Get HTTP request
    let result$ = this.getHttpRequest(method, url, params, headers);

    // Check if return cache first
    if (cacheResponse && (
        cacheRequestType === CacheRequestType.forceCache ||
        cacheRequestType === CacheRequestType.forceCacheReload ||
        (cacheRequestType === CacheRequestType.cacheReload && !cacheOutdated)
      )
    ) {
      this.log('ApiService.getApi() °°° call cache reload. startWith cacheResponse:', cacheResponse);
      result$ = result$.pipe(startWith(cacheResponse));
    }

    return result$.pipe(
      // retry(3), // retry a failed request up to 3 times
      map((response: ApiResponse) => {
        let returnData: ApiResponse;
        // Storybox:
        // if (response.data) {
        //   returnData = response.data;
        // }
        // else {
          returnData = response;
        // }

        // switch (response.status) {
        // case 'response':
        //   // this.log('status: response...');
        //   switch (response.result) {
        //     case 'data':
        //       // this.log('result: data');
        //       returnData = response.data;
        //       break;
        //     case 'message':
        //       // this.log('result: message');
        //       returnData = response.message;
        //       break;
        //     default:
        //       // this.log('result unknown');
        //       returnData = response;
        //       break;
        //   }
        //   break;
        // case 'error':
        //   // this.log('status: error...');
        //   switch (response.result) {
        //     case 'data':
        //       // this.log('result: data');
        //       returnData = throwError(response.data);
        //       break;
        //     case 'message':
        //       // this.log('result: message');
        //       returnData = throwError(response.message);
        //       break;
        //     default:
        //       // this.log('result unknown');
        //       returnData = throwError(response);
        //       break;
        //   }
        //   break;
        // default:
        //   // this.log('status: unknown');
        //   returnData = response;
        //   break;
        // }
        this.log('ApiService.getApi() response:', response, 'returnData:', returnData);
        if (cacheRequestType !== CacheRequestType.none) {
          this.log('ApiService.getApi() cacheRequestType:', cacheRequestType);
          this.log('ApiService.getApi() put cache url:', cacheUrl, 'returnData:', returnData);
          this.cache.put(cacheUrl, returnData);
        }
        return returnData;
      }),
      // catchError(this.handleError<ApiResponse>('getApi'))
      catchError((error) => {
        this.log('ApiService.getApi() - catchError - error:', error);
        return this.handleError(error);
      }),
    );
  }

  private mergeHeaders(headers1: HttpHeaders, headers2?: HttpHeaders): HttpHeaders {
    if (!headers2) {
      return headers1;
    }
    else {
      this.log('§§§§§§§§§§§§§§§§§ newHeaders...');
      const objHeader1: {[key: string]: any} = {};
      headers1.keys().forEach((key) => {
        this.log('§§§§§§§§§§§§§§§§§ headers1 key:', key, 'values:', headers1.getAll(key));
        objHeader1[key] = headers1.get(key);
      });
      this.log('§§§§§§§§§§§§§§§§§ objHeader1:', objHeader1);
      const objHeader2: {[key:string]: any} = {};
      headers2.keys().forEach((key) => {
        this.log('§§§§§§§§§§§§§§§§§ headers2 key:', key, 'values:', headers2.getAll(key));
        objHeader2[key] = headers2.get(key);
      })
      this.log('§§§§§§§§§§§§§§§§§ objHeader2:', objHeader2);
      Object.assign(objHeader1, objHeader2);
      this.log('§§§§§§§§§§§§§§§§§ new objHeader:', objHeader1);
      const newHeaders = new HttpHeaders(objHeader1);
      this.log('§§§§§§§§§§§§§§§§§ newHeaders:', newHeaders);
      newHeaders.keys().forEach((key) => {
        this.log('§§§§§§§§§§§§§§§§§ newHeaders key:', key, 'values:', newHeaders.getAll(key));
      });
      return newHeaders;
    }
  }

  private getHttpRequest(method: string, url: string, params?: object, headers?: HttpHeaders): Observable<ApiResponse> {
    this.log('ApiService.getHttpRequest() method:', method, 'url:', url, 'params:', params);
    const options: HttpOptions = {
      headers: this.mergeHeaders(this.httpHeaders, headers),
      responseType: 'json',
      observe: 'body',
    };
    switch (method) {
      case 'GET':
      case 'DELETE':
        options.params = this.getHttpParams(params);
        break;
      case 'POST':
      case 'PUT':
      case 'PATCH':
        options.body = params;
        break;
    }
    this.log(method + ' - options:', options);
    return this.http.request<ApiResponse>(method, this.pathUrl + url, options);
  }

  public getApiFull(method: string, url: string, params?: object): Observable<any> {
    if (!url.trim()) {
      // if not search term, return empty hero array.
      return of({
        status: 'error',
        result: 'Not Found',
        message: 'Url not set',
      });
    }
    this.log('url:', this.pathUrl + url);
    this.log('params:', params);
    return this.getHttpFullRequest(method, url, params)
    .pipe(
      map((httpResponse: HttpResponse<ApiResponse>) => {
        this.log('ApiService.getApiFull() map httpResponse:', httpResponse);
        // display headers
        this.log('ApiService.getApiFull() map httpResponse.headers:', httpResponse.headers);
        const keys = httpResponse.headers.keys();
        keys.map((key) => {
          this.log('ApiService.getApiFull() map ' + key + ':', httpResponse.headers.get(key));
        });
        // access the body directly, which is typed as `Config`.
        const response = { ... httpResponse.body };
        this.log('ApiService.getApiFull() map response:', response);
        switch (response.status) {
          case 'response':
            this.log('status: response...');
            switch (response.result) {
              case 'data':
                this.log('result: data');
                return response.data;
              case 'message':
                this.log('result: message');
                return response.message;
              default:
                this.log('result unknown');
                return response;
            }
          case 'error':
            this.log('status: error...');
            switch (response.result) {
              case 'data':
                this.log('result: data');
                return throwError(response.data);
              case 'message':
                this.log('result: message');
                return throwError(response.message);
              default:
                this.log('result unknown');
                return throwError(response);
            }
          default:
            this.log('status: unknown');
            return response;
        }
      }),
      catchError((error) => {
        this.log('ApiService.getApiFull() - catchError - error:', error);
        return this.handleError(error);
      }),
    );
  }

  private getHttpFullRequest(method: string, url: string, params?: object, headers?: HttpHeaders): Observable<HttpResponse<ApiResponse>> {
    this.log('ApiService.getHttpFullRequest() method:', method, 'url:', url, 'params:', params);
    const options: HttpOptionsFull = {
      headers: this.mergeHeaders(this.httpHeaders, headers),
      responseType: 'json',
      observe: 'response',
    };
    switch (method) {
      case 'GET':
      case 'DELETE':
        options.params = this.getHttpParams(params);
        break;
      case 'POST':
      case 'PUT':
      case 'PATCH':
        options.body = params;
        break;
    }
    this.log(method + ' - options:', options);
    return this.http.request<ApiResponse>(method, this.pathUrl + url, options);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // this.error('ApiService.handleError() error:', error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this.log('Error is an ErrorEvent. message:', error.error.message);
      return throwError(error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      this.log('Backend returned code', error.status, ', body was:', error.error);
      let returnError: any = error.error;
      if (returnError.errors) {
        returnError = returnError.errors;
        if (Util.isArray(returnError)) {
          returnError = (returnError as Array<any>).join(' ');
        }
      }
      return throwError(returnError);
    }
    // return an observable with a user-facing error message
  }

  /**
   * Create and return HttpParams object
   * @param params standard object with params
   */
  private getHttpParams(params?: {[key:string]: any}): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          this.log('params[' + key + ']{' + (typeof params[key]) + '}:', params[key]);
          if (Util.isObject(params[key])) {
            httpParams = httpParams.set(key, JSON.stringify(params[key]));
          } else {
            httpParams = httpParams.set(key, params[key]);
          }
          this.log('get httpParams[' + key + ']:', httpParams.get(key));
        }
      }
    }
    return httpParams;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  // private handleError2<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead
  //     // TODO: better job of transforming error for user consumption
  //     this.log(`${operation} failed: ${error.message}`);
  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }

  // private getHttpGet(url: string, params?: object): Observable<ApiResponse> {
  //   const options = {
  //     headers: this.httpHeaders,
  //     params: this.getHttpParams(params)
  //   };
  //   this.log('GET - options:', options);
  //   return this.http.get<ApiResponse>(this.pathUrl + url, options);
  //   // return this.http.request<ApiResponse>('GET', this.pathUrl + url, options);
  // }

  // private getHttpPost(url: string, params?: object): Observable<ApiResponse> {
  //   this.log('POST - params:', params);
  //   return this.http.post<ApiResponse>(this.pathUrl + url, params, {headers: this.httpHeaders});
  // }

  /**
   * GET hero by id. Return `undefined` when id not found
   */
  // getHeroNo404<Data>(id: number): Observable<Hero> {
  //   const url = `${this.heroesUrl}/?id=${id}`;
  //   return this.http.get<Hero[]>(url)
  //   .pipe(
  //     map(heroes => heroes[0]), // returns a {0|1} element array
  //     tap(h => {
  //       const outcome = h ? `fetched` : `did not find`;
  //       this.log(`${outcome} hero id=${id}`);
  //     }),
  //     catchError(this.handleError<Hero>(`getHero id=${id}`))
  //   );
  // }

  /**
   * GET hero by id. Will 404 if id not found
   */
  // getHero(id: number): Observable<Hero> {
  //   const url = `${this.heroesUrl}/${id}`;
  //   return this.http.get<Hero>(url).pipe(
  //     tap(_ => this.log(`fetched hero id=${id}`)),
  //     catchError(this.handleError<Hero>(`getHero id=${id}`))
  //   );
  // }

  /**
   * GET heroes whose name contains search term
   */
  // searchHeroes(term: string): Observable<object[]> {
  //   if (!term.trim()) {
  //     // if not search term, return empty hero array.
  //     return of([]);
  //   }
  //   // Add safe, URL encoded search parameter if there is a search term
  //   const options = term ? { params: new HttpParams().set('name', term) } : {};
  //   return this.http.get<object[]>(`${this.apiUrl}/?name=${term}`, options).pipe(
  //     tap(_ => this.log(`found heroes matching "${term}"`)),
  //     catchError(this.handleError<object[]>('searchHeroes', []))
  //   );
  // }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  // addHero (hero: Hero): Observable<Hero> {
  //   return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
  //     tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
  //     catchError(this.handleError<Hero>('addHero'))
  //   );
  // }

  /** DELETE: delete the hero from the server */
  // deleteHero (hero: Hero | number): Observable<Hero> {
  //   const id = typeof hero === 'number' ? hero : hero.id;
  //   const url = `${this.heroesUrl}/${id}`;

  //   return this.http.delete<Hero>(url, this.httpOptions).pipe(
  //     tap(_ => this.log(`deleted hero id=${id}`)),
  //     catchError(this.handleError<Hero>('deleteHero'))
  //   );
  // }

  /** PUT: update the hero on the server */
  // updateHero (hero: Hero): Observable<any> {
  //   return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
  //     tap(_ => this.log(`updated hero id=${hero.id}`)),
  //     catchError(this.handleError<any>('updateHero'))
  //   );
  // }

  /** Log a HeroService message with the MessageService */
  // private log(message: string) {
  //   this.messageService.add(`HeroService: ${message}`);
  // }

}
