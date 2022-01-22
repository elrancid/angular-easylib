import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, tap, retry } from 'rxjs/operators';
import { MessageService } from '../../log/message.service';


@Injectable()
export class LoggingInterceptorInterceptor implements HttpInterceptor {

  constructor(
    private messenger: MessageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;

    // extend server response observable with logging
    return next.handle(request)
    .pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        event => ok = event instanceof HttpResponse ? 'succeeded' : '',
        // Operation failed; error is an HttpErrorResponse
        error => ok = 'failed'
      ),
      // Log when response observable either completes or errors
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${request.method} "${request.urlWithParams}"
            ${ok} in ${elapsed} ms.`;
        this.messenger.add(msg);
      })
    );
  }
}
