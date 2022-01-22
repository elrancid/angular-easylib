import { TestBed } from '@angular/core/testing';

import { LoggingInterceptorInterceptor } from './logging-interceptor.interceptor';

describe('LoggingInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoggingInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LoggingInterceptorInterceptor = TestBed.inject(LoggingInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
