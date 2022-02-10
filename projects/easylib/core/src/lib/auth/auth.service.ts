import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// import { LogService } from '../log/log.service';
// import { Loggable } from '../log/loggable';
import { Loggable } from '@easylib/log';
import { ApiService } from '../api/api.service';
// import { StorageService } from '../../shared/utils/storage/storage.service';
import { StorageService } from '@easylib/util';
import { Router } from '@angular/router';
// import { MemoryboxService } from '../services/memorybox.service';

interface HttpResultTokenType {
  access_token: string;
  token_type: string;
}
interface HttpResultUserType {
  user: object;
}

/**
 * Mock client-side authentication/authorization service
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends Loggable {
  public override logs = false;
  // private debugDatetime: Date;

  private token: string | null = null;
  // private _user: object;
  private user: BehaviorSubject<object | null> = new BehaviorSubject<object | null>(null);
  private user$: Observable<object | null> = this.user.asObservable();

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
    // private memoryboxService: MemoryboxService,
  ) {
    super();
    // this.debugDatetime = new Date();
    // this.log('debugDatetime: ' + this.debugDatetime.toString());
  }

  /**
   * Called by AuthInterceptor
   */
  public init(): void {
    this.log('init() ... read token from storage');
    this.token = this.storage.getItem('authToken');
    this.log('init() token[' + (typeof this.token) + ']:', this.token);
    if (this.token !== undefined) {
      const user = this.storage.getItem('user');
      this.log('init() from storage user[' + (typeof user) + ']:', user);
      this.log('init() from this user[' + (typeof this.user.value) + ']:', this.user.value);
      if (user) {
        this.setUser(user);
        this.executeAfterLogin();
      }
      else {
        this.log('try to call api to check the user...');
        this.callApiUser();
        // .then((result) => {
        //   this.log('User ok. result:', result);
        // })
        // .catch((error) => {
        //   this.log('Unauthenticated. error:', error);
        // });
      }
    }
  }

  private setUser(user: object | null): void {
    this.user.next(user);
    if (user === null) {
      this.storage.removeItem('user');
      this.router.navigate(['/login']);
    }
    else {
      this.storage.setItem('user', user);
      this.router.navigate(['/']);
    }
  }

  // getUser(): BehaviorSubject<object> {
  //   return this.user;
  // }
  // getUser(): object {
  //   return this.user.value;
  // }
  public isAuthenticated(): boolean {
    return !!this.user.getValue();
  }

  public getUser$(): Observable<object | null> {
    return this.user$;
  }

  getAuthorizationToken(): string | null {
    return this.token;
  }

  private setAuthorizationToken(token: string): void {
    this.log('token:', token);
    this.token = token;
    this.storage.setItem('authToken', this.token);
  }

  private clearAuthorizationToken(): void {
    this.log('clear token');
    this.token = null;
    this.storage.removeItem('authToken');
  }

  public setLogout(): void {
    this.clearAuthorizationToken();
    this.setUser(null);
  }

  public callApiRegister(formValue: object): Promise<any> {
    this.log('AuthService.callApiRegister()...');
    return this.api.post('register', formValue)
    .then((result) => {
      return this.parseResult(result);
    });
    // .then((result) => { // TODO: da rimuovere quando viene ritornato lo user assieme al token
    //   return this.callApiUserIfNecessary(result);
    // });
  }

  public callApiLogin(params: object): Promise<any> {
    this.log('AuthService.callApiLogin()...');
    return this.api.post('login', params)
    .then((result) => {
      this.executeAfterLogin();
      return this.parseResult(result);
    });
    // .then((result) => { // TODO: da rimuovere quando viene ritornato lo user assieme al token
    //   return this.callApiUserIfNecessary(result);
    // });
  }

  // TODO: da rimuovere quando viene ritornato lo user assieme al token
  // private callApiUserIfNecessary(previousResult: any): Promise<any> {
  //   this.log('AuthService.callApiUserIfNecessary() isAuthenticated?', this.isAuthenticated());
  //   if (!this.isAuthenticated()) {
  //     return this.callApiUser()
  //     .then((result) => {
  //       this.log('AuthService.callApiUserIfNecessary() user api result:', result);
  //       previousResult.user = result;
  //       return Promise.resolve(previousResult);
  //     })
  //     .catch((error) => {
  //       this.log('AuthService.callApiUserIfNecessary() user api error:', error);
  //       return Promise.reject(error);
  //     });
  //   }
  // }

  public callApiLogout(): Promise<any> {
    this.log('AuthService.callApiLogout()...');
    return this.api.get('logout')
    .then((result) => {
      this.log('AuthService.callApiLogout() result:', result);
      this.setLogout();
      return Promise.resolve(result);
    });
  }

  public callApiUser(): Promise<any> {
    this.log('AuthService.callApiUser()...');
    return this.api.get('user')
    .then((result) => {
      this.setUser(result);
      this.executeAfterLogin();
      return Promise.resolve(result);
    });
  }

  /**
   * Looking for token in http result
   * @param result http response
   * @return a promise with http result
   */
  private parseResult(result: object): Promise<any> {
    this.log('AuthService.getAuthUser() result:', result);
    if (
      result.hasOwnProperty('access_token') &&
      result.hasOwnProperty('token_type') &&
      (result as HttpResultTokenType).token_type === 'Bearer'
    ) {
      this.log('AuthService.getAuthUser() found bearer authorization token:', (result as HttpResultTokenType).access_token);
      this.setAuthorizationToken((result as HttpResultTokenType).access_token);
    }
    if (result.hasOwnProperty('user')) {
      this.setUser((result as HttpResultUserType).user);
    }
    return Promise.resolve(result);
  }

  /**
   * To do after login
   */
  private executeAfterLogin(): void {
    // this.memoryboxService.loadMemoryboxes();
  }
}
