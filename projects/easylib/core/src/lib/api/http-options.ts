import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

export interface HttpOptions {
  body?: any;
  headers?: HttpHeaders | { [header: string]: string | string[]; };
  reportProgress?: boolean;
  observe: 'body';
  params?: HttpParams | { [param: string]: string | string[]; };
  responseType?: 'json';
  withCredentials?: boolean;
  // observe?: 'body';
  // observe: 'events';
  // responseType?: 'arraybuffer' | 'json';
}
export interface HttpOptionsFull {
  body?: any;
  headers?: HttpHeaders | { [header: string]: string | string[]; };
  reportProgress?: boolean;
  observe: 'response';
  params?: HttpParams | { [param: string]: string | string[]; };
  responseType?: 'json';
  withCredentials?: boolean;
  // observe?: 'body';
  // observe: 'events';
  // responseType?: 'arraybuffer' | 'json';
}

