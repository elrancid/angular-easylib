import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  OutletContext,
  RouteReuseStrategy
} from '@angular/router';
import { Loggable } from '@easylib/log';
// import { RouterService } from 'src/app/core/router/router.service';
import { BrowserTabsService } from './browser-tabs.service';

// interface StoredRoute {
//   route: ActivatedRouteSnapshot;
//   handle: DetachedRouteHandle;
// }

// Helper per ricostruire l'intero URL da una rotta
// function getFullPath(routeSnapshot: ActivatedRouteSnapshot): string {
//   return routeSnapshot.pathFromRoot
//     .map(v => v.url.map(segment => segment.toString()).join('/'))
//     .join('/')
//     .trim()
//     .replace(/\/$/, ''); // Remove trailing slash
// }

@Injectable({
  providedIn: 'root'
})
export class BrowserTabsReuseStrategy extends Loggable implements RouteReuseStrategy {

  public logs = false;

  /**
   * Con il routing in loadChildren (lazy loading) nella seconda chiamata si perde il routeConfig
   * quindi non si ha più il valore routeConfig.path che nel caso di parametri è, ad esempio, users/:id.
   * Nel caso di salvataggio senza il parametro noReuse (che vorrebbe ricaricare la pagina ogni volta che
   * cambia un parametro) non si è più in grado di stabilire se il routing è effettivamente "users/:id".
   * Utilizziamo "lastConfigPath" per passare il parametro alla seconda chiamata.
   */
  private lastConfigPath!: string;

  constructor(
    private browserTabsService: BrowserTabsService,
    // private routerService: RouterService,
  ) {
    super();
    this.log('BrowserTabsReuseStrategy.constructor()');
    // this.browserTabsService.tabs
    // .subscribe((tabs) => {
    //   this.log('BrowserTabsReuseStrategy. *** subscribe tabs:', tabs);
    // });
    // this.browserTabsService.selectedIndex
    // .subscribe((selectedIndex) => {
    //   this.log('BrowserTabsReuseStrategy. *** subscribe selectedIndex:', selectedIndex);
    // });
  }

  /**
   * Helper per ricostruire l'intero URL da una rotta
   * @param route 
   * @returns 
   */
  private getFullPath(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join('/'))
      .join('/')
      .trim()
      .replace(/\/+/g, '/')
      .replace(/\/$/, '');
      // .replace(/^\//, ''); // Remove trailing slash
  }
  /**
   * Helper per prendere l'URL dalla configurazione (app-routing.module)
   * @param route 
   * @returns 
   */
  private getConfigPath(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig && route.routeConfig.path) {
      return route.routeConfig.path;
    }
    return '';
  }
  /**
   * 
   * @param route 
   * @param saveLastConfigPath 
   * @param logPrefix 
   * @returns 
   */
  private getPath(route: ActivatedRouteSnapshot, saveLastConfigPath: boolean, logPrefix?: string): string {
    const fullPath = this.getFullPath(route);
    let configPath = this.getConfigPath(route);
    // this.log(logPrefix, 'configPath: "' + configPath + '" fullPath: "' + fullPath + '" url: "' + route.url.join('/') + '" component:', (route.component ? 'YES' : 'no'),' params:', route.params, 'route:', route);
    this.log(logPrefix, 'configPath: "' + configPath + '" fullPath: "' + fullPath + '" url: "' + route.url.join('/') + '" params:', route.params, 'route:', route);
    // if (!!configPath && !!fullPath && fullPath.endsWith('/' + configPath)) {
    //   lastFullPath = fullPath;
    //   this.log(logPrefix, '******************* sub path - lastFullPath:', lastFullPath);
    // }
    if (route.data.noReuse === true) {
      return fullPath;
    }
    if (!configPath && !!fullPath) {
      configPath = this.lastConfigPath;
    }
    this.log(logPrefix, 'lastConfigPath:', this.lastConfigPath, 'configPath:', configPath);
    if (!!configPath) {
      if (saveLastConfigPath) {
        this.lastConfigPath = configPath;
      }
      return configPath;
    }
    return fullPath;
  }
  /**
   * 
   * @param route 
   * @returns 
   */
  private saveRestore(route: ActivatedRouteSnapshot): boolean {
    if (route.data.noStore === true) {
      return false;
    }
    return true;
  }


  // Oggetto Dictionary dove tengo le rotte salvate
  // storedRoutes: Record<string, StoredRoute> = {};

  // Dovremmo salvare questa rotta? Default: false
  /**
   * Determines if this route (and its subtree) should be detached to be reused later.
   * @param routeSnapshot 
   * @returns 
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // this.log('<- shouldDetach route:', route);
    const path = this.getPath(route, false, '<- shouldDetach');
    return this.saveRestore(route);
  }

  // Salviamo la rotta (default: non la salva mai)
  /**
   * Stores the detached route
   * @param routeSnapshot 
   * @param routeHandle 
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // this.log('.. store routeSnapshot:', routeSnapshot, 'routeHandle:', routeHandle);
    const path = this.getPath(route, false, '.. store');
    this.browserTabsService.storeRoute(path, route, handle);

    // const key = getFullPath(routeSnapshot); // Ex. users/1, users/2, users/3, ...
    // this.log('.. store key:', key);
    // this.browserTabsService.storeRoute(key, route, handle);
  }

  // Dovremmo riprenderci questa rotta dallo store? Default: false
  /**
   * Determines if this route (and its subtree) should be reattached
   * @param routeSnapshot 
   * @returns 
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // this.log('-> shouldAttach route:', route);
    const path = this.getPath(route, true, '-> shouldAttach');
    if (this.saveRestore(route)) {
      const isStored = !!path && this.browserTabsService.isStoredRoute(path);
      if (isStored) {
        this.log('-> shouldAttach return true');
        return true;
      }
    }
    this.log('-> shouldAttach return false');
    return false;

    // const key = this.getFullPath(route);
    // this.log('-> shouldAttach key:', key);
    // return !!route.routeConfig && this.browserTabsService.isStoredRoute(key);
  }

  // Ritorniamo la rotta dallo store (default: non la salva mai, quindi non c'è mai)
  /**
   * Retrieves the previously stored route
   * @param routeSnapshot 
   * @returns 
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // this.log('__ retrieve route:', route);
    const path = this.getPath(route, true, '__ retrieve');
    const storedRoute = this.browserTabsService.retrieveStoredRoute(path);
    this.log('__ retrieve return storedRoute:', storedRoute);
    return storedRoute;
    // return this.browserTabsService.retrieveStoredRoute(path);

    // const key = this.getFullPath(route);
    // this.log('__ retrieve key:', key);
    // const retrievedRoutedHandler = this.browserTabsService.retrieveStoredRoute(key);
    // this.log('__ retrieve retrievedRoutedHandler:', retrievedRoutedHandler);
    // return (!route.routeConfig || !retrievedRoutedHandler) ? null : retrievedRoutedHandler;
  }

  // Dovremmo riutilizzare questa rotta? Default: solo se non ha la stessa configurazione.
  /**
   * Determines if a route should be reused
   * @param next 
   * @param previous 
   * @returns 
   */
  shouldReuseRoute(next: ActivatedRouteSnapshot, previous: ActivatedRouteSnapshot): boolean {
    // this.log('?? shouldReuseRoute previous:', previous, 'next:', next);
    this.log('?? shouldReuseRoute previous:', this.getConfigPath(previous), 'next:', this.getConfigPath(next));
    const path = this.getPath(next, true, '?? shouldReuseRoute');
    if (next.data.noReuse === true) {
      this.log('   shouldReuseRoute return false');
      return false;
    }
    const configPath = this.getConfigPath(next);
    const fullPath = this.getFullPath(next);
    if (configPath === '' && fullPath === '') {
      return true;
    }
    const isSameConfig = previous.routeConfig === next.routeConfig;
    // this.log('?? shouldReuseRoute return isSameConfig:', isSameConfig);
    // return isSameConfig;

    // Check tab change
    const isTabChanged = this.browserTabsService.isTabChanged();
    this.log('?? __________ shouldReuseRoute return isSameConfig:', isSameConfig, '&& !isTabChanged:', !isTabChanged, '<---------------------------');
    return isSameConfig && !isTabChanged;

    // this.log('?? shouldReuseRoute previous.routeConfig:', previous.routeConfig, 'next.routeConfig:', next.routeConfig);
    // this.log('?? shouldReuseRoute previous:', getFullPath(previous), 'next:', getFullPath(next));
    // this.log('?? shouldReuseRoute return:', previous.routeConfig === next.routeConfig);
    // return previous.routeConfig === next.routeConfig;
    // const isSameConfig = previous.routeConfig === next.routeConfig;
    // const shouldReuse = !next.data.noReuse;
    // this.log('?? shouldReuseRoute return:', isSameConfig && shouldReuse);
    // return isSameConfig && shouldReuse;
  }

  // private deactivateOutlet(handle: DetachedRouteHandle): void {
  //   let contexts: Map<string, OutletContext> = handle['contexts'];
  //   console.log('°° deactivateOutlet handle:', handle, 'contexts:', contexts);
  //   contexts.forEach((context: OutletContext, key: string) => {
  //       if (context.outlet) {
  //         console.log('°° deactivateOutlet key:', key, 'context.outlet:', context.outlet);
  //         // Destroy the component
  //           context.outlet.deactivate();
  //           // Destroy the contexts for all the outlets that were in the component
  //           context.children.onOutletDeactivated();
  //       }
  //   });
  // }

  // deactivateAllHandles() {
  //   for (const key in this.handlers) {
  //       this.deactivateOutlet(this.handlers[key])
  //   }
  //   this.handlers = {}
  // }

}
