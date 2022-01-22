import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public navigateObserver: Subject<string> = new Subject<string>();

  // public goto: Subject<string> = new Subject<string>();
  // public navigation: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  // public nextNavigation: Subject<string> = new Subject<string>();
  public navigationStart: Subject<string> = new Subject<string>();
  public navigationEnd: Subject<string> = new Subject<string>();

  public navigate(url: string): void {
    this.navigateObserver.next(url);
  }
}
