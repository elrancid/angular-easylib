import { Injectable } from '@angular/core';
import { Location, PlatformLocation } from '@angular/common'
import { ActivatedRoute, Event, GuardsCheckEnd, NavigationEnd, Params, Router, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { Loggable } from '@easylib/log';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class RouterService extends Loggable {

  public override logs = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private platformLocation: PlatformLocation,
    private navigationService: NavigationService,
  ) {
    super();
    this.log('RouterService.constructor()');

    this.router.events.subscribe((event: Event) => {
      this.log('RouterService. ***°°°*** router events:', event);
      // if (event instanceof NavigationStart) {
      //   this.navigationService.nextNavigation.next(event.url);
      // }
      if (event instanceof GuardsCheckEnd) {
        this.navigationService.navigationStart.next(event.urlAfterRedirects);
        // this.navigationService.nextNavigation.next(event.urlAfterRedirects);
      }
      // if (event instanceof ResolveEnd) {
      //   this.navigationService.nextNavigation.next(event.urlAfterRedirects);
      // }
      // if (event instanceof NavigationError) {
      //     // Handle error
      //     console.error(event.error);
      // }
      if (event instanceof NavigationEnd) {
        this.navigationService.navigationEnd.next(event.urlAfterRedirects);
        // const navigationEnd = event as NavigationEnd;
        // if (this.navigationService.navigation.value !== navigationEnd.urlAfterRedirects) {
        //   this.navigationService.navigation.next(navigationEnd.urlAfterRedirects);
        // }
      }
    });

    this.navigationService.navigateObserver
    // .pipe(
    //   distinctUntilChanged(),
    // )
    .subscribe((link) => {
      this.log('RouterService - navigationService.navigateObserver.subscribe link:', link, 'router.url:', this.router.url);
      // if (link && link !== this.router.url) {
      if (link) {
        this.log('RouterService ..............goto navigate link:', link);
        this.navigate(link);
      }
    });

    // combineLatest([
    //   this.route.params,
    //   this.route.queryParams,
    //   // (params, qparams) => ({ params, qparams })
    // ])
    // .pipe(
    //   map((data) => {
    //     this.log('~~~~~~~~~~~~~~~ data:', data);
    //     // const entity = data[0];
    //     // const dataset = data[1];
    //     // return {
    //     //    isApple: (dataset.find(ds => ds.label === 'Apple') as DataItem).id === entity.fruitId,
    //     //    isOrange: (dataset.find(ds => ds.label === 'Orange') as DataItem).id === entity.fruitId
    //     // };
    //     return data;
    //   })
    // )
    // this.route.paramMap

    // this.route.queryParamMap
    // .pipe(
    //   takeUntil(this.stop$),
    // )
    // .subscribe((params) => {
    //   this.log('RegisterComponent.route.paramMap.params:', params, 'email:', params.get('email'));
    //   this.log('RegisterComponent.route.paramMap.params:', params);
    //   this.pinEmailForm(params.get('email'));
    // });
  }

  /**
   * Return location object data.
   * {
   *   protocol: ...
   *   hostname: ...
   * }
   */
  public getLocationData() {
    return (this.platformLocation as any).location;
  }

  /**
   * Return server origin
   */
  public getOrigin(): string {
    // return (this.platformLocation as any).location.origin; // not for developing because port differs.
    const location = (this.platformLocation as any).location;
    return location.protocol + '//' + location.hostname;
  }

  public printAll(): void {
    console.log('window.location.href:', window.location.href);
    console.log('platformLocation:', this.platformLocation);
    console.log('platformLocation.location:', (this.platformLocation as any).location);
    console.log('platformLocation.href:', (this.platformLocation as any).href);
    console.log('platformLocation.protocol:', (this.platformLocation as any).protocol);
    console.log('platformLocation.port:', (this.platformLocation as any).port);
    console.log('platformLocation.pathname:', (this.platformLocation as any).pathname);
    console.log('platformLocation.search:', (this.platformLocation as any).search);
    console.log('platformLocation.hash:', (this.platformLocation as any).hash);
    console.log('platformLocation.getBaseHrefFromDOM():', (this.platformLocation as any).getBaseHrefFromDOM());
    console.log('platformLocation.getState():', (this.platformLocation as any).getState());
    console.log('location:', this.location);
    console.log('location.path():', this.location.path());
    console.log('router:', this.router);
    console.log('router.url:', this.router.url);
    console.log('router.routerState.snapshot:', this.router.routerState.snapshot);
    console.log('router.routerState.snapshot.url:', this.router.routerState.snapshot.url);
    // const urlTree = this.router.parseUrl(this.router.routerState.snapshot.url);
    // const urlWithoutParams = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
    // const url = this.router.url.split('?')[0];
    console.log('route.snapshot:', this.route.snapshot);
    console.log('route.snapshot.url:', this.route.snapshot.url);
    console.log('route.snapshot.params:', this.route.snapshot.params);
    console.log('route.snapshot.queryParams:', this.route.snapshot.queryParams);
    console.log('route.snapshot.paramMap:', this.route.snapshot.paramMap);
    console.log('route.snapshot.paramMap.get(data):', this.route.snapshot.paramMap.get('data'));
    console.log('route.snapshot.queryParamMap:', this.route.snapshot.paramMap);
    console.log('route.snapshot.queryParamMap.get(data):', this.route.snapshot.paramMap.get('data'));
  }

  public setRoutes(routes: Routes): void {
    // this.log('ActivatedRoute:', this.route);
    // this.log('ActivatedRoute.snapshot:', this.route.snapshot);
    // this.log('ActivatedRoute.url:', this.route.url);
    // this.log('router:', this.router);
    // this.log('router.routerState:', this.router.routerState);
    // this.log('router.routerState.toString():', this.router.routerState.toString());
    // this.log('router.routerState.snapshot:', this.router.routerState.snapshot);

    this.log('router:', this.router);
    this.log('router.url:', this.router.url);
    this.log('router.routerState.snapshot:', this.router.routerState.snapshot);
    this.log('router.routerState.snapshot.url:', this.router.routerState.snapshot.url);

    // const urlTree = this.router.parseUrl(this.router.routerState.snapshot.url);
    // const urlWithoutParams = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
    const url = this.router.url.split('?')[0];

    this.log('route.snapshot:', this.route.snapshot);
    this.log('route.snapshot.url:', this.route.snapshot.url);
    this.log('route.snapshot.params:', this.route.snapshot.params);
    this.log('route.snapshot.queryParams:', this.route.snapshot.queryParams);
    this.log('route.snapshot.paramMap:', this.route.snapshot.paramMap);
    this.log('route.snapshot.paramMap.get(data):', this.route.snapshot.paramMap.get('data'));
    this.log('route.snapshot.queryParamMap:', this.route.snapshot.paramMap);
    this.log('route.snapshot.queryParamMap.get(data):', this.route.snapshot.paramMap.get('data'));
    this.router.resetConfig(routes);
    this.log('RouterService.setRoutes() navigate to:', url);
    const queryParams = this.route.snapshot.queryParams;
    this.router.navigate([url], {queryParams});
  }

  public addRouting(route: object): void {
    this.log('RouterService.addRouting() route:', route);
    this.router.config.push(route);
  }

  private navigate(url: string, queryParams: object | null = null): void {
    this.log('RouterService.navigate() url:', url, 'queryParams:', queryParams);
    // this.router.navigate([url], { queryParams, skipLocationChange: true });
    this.router.navigate([url], { ...queryParams });
    // this.router.navigate([url], { skipLocationChange: true, ...queryParams });
    // this.router.navigateByUrl(url, { skipLocationChange: true, ...queryParams });
    // See:
    // https://stackoverflow.com/questions/44864303/send-data-through-routing-paths-in-angular
    // https://medium.com/ableneo/how-to-pass-data-between-routed-components-in-angular-2306308d8255
    // https://netbasal.com/set-state-object-when-navigating-in-angular-7-2-b87c5b977bb
  }
  public setQueryParams(queryParams: object | null): void {
    this.log('RouterService.setQueryParams() queryParams:', queryParams);
    const url = this.router.url.split('?')[0];
    this.router.navigate([url], {queryParams});
  }

  public getQueryParams(): Params {
    return this.route.snapshot.queryParams;
  }
  public getQueryParam(param: string): string |  null {
    return this.route.snapshot.queryParamMap.get(param);
  }
  public getObservableQueryParams(): Observable<Params> {
    return this.route.queryParams;
  }

  public back(): void {
    this.location.back();
  }
}
