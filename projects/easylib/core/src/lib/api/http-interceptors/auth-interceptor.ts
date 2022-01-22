import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, tap, retry } from 'rxjs/operators';

import { LogService } from '../../log/log.service';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private logs = false;

  constructor(private auth: AuthService, private logService: LogService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service.
    const authToken = this.auth.getAuthorizationToken();
    this.logService.logIf(this, 'AuthInterceptor - authToken:', authToken);

    if (authToken) {
      // // Clone the request and replace the original headers with
      // // cloned headers, updated with the authorization.
      // const authReq = req.clone({
      //   headers: req.headers.set('Authorization', authToken)
      // });

      // Clone the request and set the new header in one step.
      const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + authToken } });
      this.logService.logIf(this, 'new authReq:', authReq);

      // send cloned request with header to the next handler.
      return next.handle(authReq)
      .pipe(
        // map((event: HttpEvent<any>) => {
        //   this.logService.logIf(this, 'AuthInterceptor - map - event:', event);
        //   if (event instanceof HttpResponse) {
        //     this.logService.logIf(this, 'AuthInterceptor - map - event is HttpResponse');
        //     // console.log('event--->>>', event);
        //   }
        //   return event;
        // }),
        // tap(
        //   (event) => {
        //     // There may be other events besides the response.
        //     this.logService.logIf(this, 'AuthInterceptor - tap - event:', event);
        //     if (event instanceof HttpResponse) {
        //       this.logService.logIf(this, 'AuthInterceptor - tap - event is HttpResponse');
        //     }
        //     return event;
        //   },
        //   (error) => {
        //     this.logService.logIf(this, 'AuthInterceptor - error:', error);
        //     return throwError(error);
        //   }
        // ),
        catchError((error: HttpErrorResponse) => {
          this.logService.logIf(this, 'AuthInterceptor - catchError - error:', error);
          if (error.status === 401) {
            // user is not yet logged
            this.logService.logIf(this, 'AuthInterceptor - °°°°°°°°°°°°° user is not yet logged °°°°°°°°°°°°°');
            this.auth.setLogout();
          }
          // if (error.error instanceof ErrorEvent) {
          //   // A client-side or network error occurred. Handle it accordingly.
          //   this.logService.logIf(this, 'AuthInterceptor - error is an ErrorEvent. message:', error.error.message);
          // } else {
          //   // The backend returned an unsuccessful response code.
          //   // The response body may contain clues as to what went wrong,
          //   this.logService.logIf(this, `AuthInterceptor - Backend returned code ${error.status}, ` + `body was: ${error.error}`);
          // }
          // // return an observable with a user-facing error message
          return throwError(error);
        }),
        // finalize(() => {
        //   this.logService.logIf(this, 'AuthInterceptor - finalize');
        // })
      );
    } else {
      return next.handle(req);
      // .pipe(
      //   // map((event: HttpEvent<any>) => {
      //   //   this.logService.logIf(this, 'AuthInterceptor - map - event:', event);
      //   //   if (event instanceof HttpResponse) {
      //   //     this.logService.logIf(this, 'AuthInterceptor - map - event is HttpResponse');
      //   //     // console.log('event--->>>', event);
      //   //   }
      //   //   return event;
      //   // }),
      //   tap(
      //     (event) => {
      //       // There may be other events besides the response.
      //       this.logService.logIf(this, 'AuthInterceptor °°°°°°°°°°°°°°°° - tap - event:', event);
      //       if (event instanceof HttpResponse) {
      //         this.logService.logIf(this, 'AuthInterceptor - tap - event is HttpResponse');
      //         if (event.body &&
      //             event.body.status === 'response' &&
      //             event.body.result === 'data' &&
      //             event.body.data &&
      //             event.body.data.token &&
      //             event.body.data.user) {
      //           this.logService.logIf(this, 'AuthInterceptor - tap - new token:', event.body.data.token);
      //           this.auth.setAuthorizationToken(event.body.data.token);
      //           this.auth.setUser(event.body.data.user);
      //         }
      //       }
      //       return event;
      //     },
      //     // (error) => {
      //     //   this.logService.logIf(this, 'AuthInterceptor - error:', error);
      //     //   return throwError(error);
      //     // }
      //   ),
      //   // catchError((error: HttpErrorResponse) => {
      //   //   this.logService.logIf(this, 'AuthInterceptor - catchError - error:', error);
      //   //   if (error.error instanceof ErrorEvent) {
      //   //     // A client-side or network error occurred. Handle it accordingly.
      //   //     this.logService.logIf(this, 'AuthInterceptor - error is an ErrorEvent. message:', error.error.message);
      //   //   } else {
      //   //     // The backend returned an unsuccessful response code.
      //   //     // The response body may contain clues as to what went wrong,
      //   //     this.logService.logIf(this, `AuthInterceptor - Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      //   //   }
      //   //   // return an observable with a user-facing error message
      //   //   return throwError(error);
      //   // }),
      //   // finalize(() => {
      //   //   this.logService.logIf(this, 'AuthInterceptor - finalize');
      //   // })
      // );
    }

  }
}
