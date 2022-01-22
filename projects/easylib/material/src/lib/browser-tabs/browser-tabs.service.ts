import { Component, ComponentRef, Injectable, Input } from '@angular/core';
import { Loggable } from '@easylib/log';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
// import { Tab, Tabs } from './browser-tabs.module';
import { ActivatedRouteSnapshot, DetachedRouteHandle, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';

// import { Router, Event } from '@angular/router';

// import { RouterService } from 'src/app/core/router/router.service';
import { NavigationService } from '@easylib/core';
import { distinctUntilChanged, pairwise } from 'rxjs/operators';
import { BasicTab } from '../tabs/tabs.module';

/**
 * Interface for browser tab pages (component).
 * Defines tab label and icon.
 * Eg: export class MyPageComponent implements OnInit, OnDestroy, ComponentTab, OnComponentTabActivate {
 */
export declare interface ComponentTab extends Component {
  browserTabLabel?: string;
  browserTabIcon?: string;
  onTabActivate?: Function;
  browserUpButtonRouterLink?: string;
}
/**
 * Interface for browser tab pages (component).
 * Defines function called when page is activated.
 * Eg: export class MyPageComponent implements OnInit, OnDestroy, ComponentTab, OnComponentTabActivate {
 */
export declare interface OnComponentTabActivate {
  onComponentTabActivate(): void;
}

export declare interface StoredRoute {
  route: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
  position: Position;
}

// export declare interface StoredRouteTab {
//   // links?: Array<string>;
//   storedRoutes: Record<string, StoredRoute>;
// }

// type StoredRouteTabs = Map<id: string, storeRouteTab: StoredRouteTab>;
// type StoredRouteTabs = Map<number, StoredRouteTab>;

export declare interface BrowserTab extends BasicTab {
  // icon?: string | null;
  // label?: string | null;
  id?: number;
  // links?: Array<string>;
  // storedRoutes?: Record<string, StoredRoute>;
  storedRoutes?: Map<string, StoredRoute>;
  // route?: string;
  navigation?: {
    history: Array<string>;
    index: number;
  }
}
export declare type BrowserTabs = Array<BrowserTab>;

export declare type Position = [number, number];

export declare interface TabRouteInfo {
  routerLink?: string,
  title: string,
  icon?: string,
}
export declare interface TabRouteInfos {
  [key: string]: TabRouteInfo,
}

// export declare type NavigationAction = "back" | "next";

@Injectable({
  providedIn: 'root'
})
export class BrowserTabsService extends Loggable {

  public logs = false;
  private logNavigation = false;
  private logStorage = false;

  // private logsLevel = 1; // 0: none, 1: info, 2: log

  @Input() mandatoryTab = false;
  @Input() defaultRoute = '/';
  @Input() defaultTabRoute = '/';

  private navigating = false;

  private tabsIdCounter = 1;
  // @Input() selectedIndex: number;
  // public selectedTabIndex: number;

  // private _tabs: Tabs = [];
  public tabs$ = new BehaviorSubject<BrowserTabs>([]);
  // public _selectedIndex: number = -1;
  public selectedIndex$ = new BehaviorSubject<number>(-1);
  // private currentIndex: number;
  // private previousIndex: number;
  /**
   * Tab corrente o il precedente appena prima di cambiare tab.
   * Serve per andare a salvare l'handle nel posto giusto dopo che è stato
   * cambiato route, sia nel caso di cambio tab, sia nel caso di cambio route.
   */
  private previousTab: BrowserTab | null = null;
  private previousRoute: string | null = null;
  private currentTab: BrowserTab | null = null;
  // private currentRoute: string;

  private destroyComponent = false; // used when close tab to destroy component instead of store

  // public scrollY$ = new BehaviorSubject<number>(0);
  // public scrollX$ = new BehaviorSubject<number>(0);
  public scrollPosition$ = new BehaviorSubject<Position>([0,0]);

  // private storedRouteTabs: StoredRouteTabs = new Map();

  // public browserTabLabel$ = new Subject();
  // public browserTabIcon$ = new Subject();

  // private changedTab = false;
  private addedTab = false;
  private dontSaveNavigationUrl = false;

  // private navigationAction: NavigationAction = null;

  // private tabRouteInfos: TabRouteInfos;

  public backButtonEnabled$ = new BehaviorSubject<boolean>(false);
  public nextButtonEnabled$ = new BehaviorSubject<boolean>(false);

  public upButtonRouterLink$ = new BehaviorSubject<string | null>(null);

  private currentStoredRoute: StoredRoute | null = null;

  constructor(
    // private routerService: RouterService,
    private navigationService: NavigationService,
    // private router: Router,
  ) {
    super();
    this.log('BrowserTabsService.constructor()');

    // this.tabs$
    // .pipe(distinctUntilChanged())
    // .subscribe((tabs) => {
    //   this.log('BrowserTabsService. *** subscribe tabs:', tabs);
    // });

    this.selectedIndex$
    .pipe(
      distinctUntilChanged(),
      pairwise(),
    )
    .subscribe(([previousSelectedIndex, selectedIndex]) => {
      // this.log('BrowserTabsService. *** subscribe selectedIndex:', selectedIndex, 'previousSelectedIndex:', previousSelectedIndex, 'addedTab:', this.addedTab);
      // this.selectedIndexChange(previousSelectedIndex !== -1);
      this.selectedIndexChange();
    });

    this.navigationService.navigationStart
    // .pipe(distinctUntilChanged())
    .subscribe((route: string) => {
      this.navigationStartChange(route);
    });

    this.navigationService.navigationEnd
    // .pipe(distinctUntilChanged())
    .subscribe((route: string) => {
      this.navigationEndChange(route);
    });

    // this.checkMandatoryTab();
  }

  private navigationStartChange(route: string): void {
    // this.navigating = true;
    if (route !== null) {
      // this.log('BrowserTabsService.navigationService.navigationStart.subscribe ***   ***   *** :', route);

      // if (this.currentTab) {
      //   // this.previousTab = this.currentTab;
      //   this.previousRoute = this.currentTab.route;
      // }
      // metto il previousTab al corrente se non è stato cambiato tab
      // if (!this.changedTab) {
      // }
      // else {
      //   this.changedTab = false;
      // }

      this.currentStoredRoute = null;
      let currentTab = this.getCurrentTab();
      if (!currentTab) {
        // Chiamata pagina senza avere il tab!
        // this.log('BrowserTabsService.navigationService.navigationStart.subscribe *** *** *** CHIAMATA PAGINA "' + route + '" SENZA AVERE IL TAB');
        if (this.logNavigation) {
          this.log('route:', route, 'NO TAB');
        }
        // Save url on new tab
        this.addedTab = true;
        if (this.shouldAddMandatoryTab()) {
          if (this.logNavigation) {
            this.log('add mandatory tab...');
          }
          this.navigating = true;
          this.addTab();
        }
        else if (route !== this.defaultRoute) {
          if (this.logNavigation) {
            this.log('add tab...');
          }
          this.navigating = true;
          this.addTab(route);
        }
      }
      if (this.logNavigation) {
        this.log('currentTab:', currentTab, 'route:', route);
      }
      // else {
        // if (this.currentTab) {
        //   this.currentTab.route = route;
        // }
        // this.setNavigationUrl(route);
        // this.log('route:', route, 'currentTab:', currentTab);
      // }
      // this.currentRoute = url;
      // ADD navigation
      if (!currentTab) {
        currentTab = this.getCurrentTab();
      }
      if (currentTab) {
        let currentRoute;
        if (currentTab.navigation!.index >= 0) {
          currentRoute = currentTab.navigation!.history[currentTab.navigation!.index];
        }
        if (currentRoute !== route) {
          currentTab.navigation!.index ++;
          currentTab.navigation!.history[currentTab.navigation!.index] = route;
          if (this.logNavigation) {
            this.log('ADDED NAVIGATION:', route, 'to tab #', currentTab.id, 'history:', currentTab.navigation!.history, 'index:', currentTab.navigation!.index);
          }
        }
      }
    }
  }

  private navigationEndChange(route: string): void {
    if (route !== null) {
      if (this.logNavigation) {
        this.log('route:', route);
      }
      // this.updatePreviousValues();
      // if (this.currentTab) {
      //   this.previousTab = this.currentTab;
      // }
      // setTimeout(() => {
        this.activateCurrentComponent();
        // this.setNavigationUrl(route);
      // });
    }
    // this.navigating = false;
  }

  public addTab(route: string | null = null): void {
    if (!route) {
      route = this.defaultTabRoute;
    }
    const tab: BrowserTab = {
      navigation: {
        history: [route],
        index: 0,
      }
    };
    this.addedTab = true;
    if (this.logNavigation) {
      this.log('BEFORE - tab:', tab);
    }
    this.updateDefaultTabsValues([tab]);
    const tabs: BrowserTabs = this.tabs$.value;
    tabs.push(tab);
    if (this.logNavigation) {
      this.log('AFTER - tab:', tab);
    }
    this.tabs$.next(tabs);
    const newIndex = this.tabs$.value.length - 1;
    this.currentTab = tab;
    // this.log('BrowserTabsService.addTab() newIndex:', newIndex);
    setTimeout(() => {
      this.selectedIndex$.next(newIndex);
      // this.log('BrowserTabsService.addTab() goto home...');
      // this.navigationService.goto.next('/');
      // this.routerService.navigate('home');
    });
  }

  private selectedIndexChange(): void {
    // this.log('forceGotoCurrentRoute:', forceGotoCurrentRoute);
    // this.previousIndex = this.currentIndex;
    // this.currentIndex = selectedIndex;

    // if (this.currentTab) {
    //   this.previousTab = this.currentTab;
    // }
    // const currentTab = this.getCurrentTab();
    this.currentTab = this.getCurrentTab();
    // this.log('currentTab:', currentTab);
    // if (this.currentTab !== currentTab) {
      // this.currentTab = this.getCurrentTab();
      // this.currentTab = currentTab;
      if (this.logNavigation) {
        this.log('currentTab:', this.currentTab, 'navigating:', this.navigating);
      }
      // this.log('new currentTab:', currentTab);
      // if (!this.previousTab) {
      //   this.previousTab = this.currentTab;
      // }
  
      // On tab change, don't save url on navigation history
      // if (!this.addedTab) { // if wasn't added tab
      //   this.dontSaveNavigationUrl = true;
      // }
      // else { // reset
      //   this.dontSaveNavigationUrl = false;
      //   this.addedTab = false;
      // }
      // if (forceGotoCurrentRoute) {
      if (!this.navigating) {
        if (this.logNavigation) {
          this.log('!this.navigating.... gotoCurrentRoute()');
        }
        this.gotoCurrentRoute();
      }
    // }
    this.navigating = false;
    setTimeout(() => {
      this.updatePreviousValues();
    });
  }

  private updatePreviousValues() {
    this.previousTab = this.getCurrentTab();
    this.log('########## previousTab:', this.previousTab);
    this.previousRoute = this.getTabRoute(this.previousTab!);
  }

  // public setTabRouteInfos(tabRouteInfos: TabRouteInfos): void {
  //   this.tabRouteInfos = tabRouteInfos;
  // }

  public setMandatoryTab(mandatory: boolean): void {
    this.mandatoryTab = mandatory;
  }

  /**
   * Check if there
   */
  private checkMandatoryTab(): void {
    if (this.tabs$.value.length === 0 && this.mandatoryTab) {
      this.addTab();
    }
  }
  private shouldAddMandatoryTab(): boolean {
    if (this.tabs$.value.length === 0 && this.mandatoryTab) {
      return true;
    }
    return false;
  }

  public setTabs(tabs: BrowserTabs): void {
    this.updateDefaultTabsValues(tabs);
    this.tabs$.next(tabs);
  }

  public closeTab(index: number): void {
    if (this.logNavigation || this.logStorage) {
      this.log('BrowserTabsService.closeTab() index:', index, 'selectedTabIndex:', this.selectedIndex$.value);
    }
    this.destroyComponent = true;
    const tabs: BrowserTabs = this.tabs$.value;
    // const newSelectedTabIndex = index;
    const removedTabs = tabs.splice(index, 1);
    // if (this.selectedTabIndex > (this.tabs$.length - 1)) {
    //   this.selectedTabIndex --;
    // }
    if (this.selectedIndex$.value >= index) {
      if (this.selectedIndex$.value > index) {
        this.selectedIndex$.next(this.selectedIndex$.value - 1);
      }
      else {
        if (tabs.length === 0) {
          this.selectedIndex$.next(-1);
        }
        else {
          this.selectedIndex$.next(this.selectedIndex$.value);
          // this.selectedIndexChange(true);
        }
      }
    }
    this.tabs$.next(tabs);
    this.checkMandatoryTab();
    // this.gotoCurrentRoute();
    // setTimeout(() => {
      removedTabs[0].storedRoutes!.forEach((element, route) => {
        if (this.logStorage) {
          this.log('BrowserTabsService.closeTab() removed route:', route, 'element:', element, 'element.handle:', element.handle);
        }
        if (element.handle) {
          const componentRef: ComponentRef<any> = (element.handle as any).componentRef as ComponentRef<any>;
          if (this.logStorage) {
            this.log('BrowserTabsService.closeTab() componentRef:', componentRef);
          }
          componentRef.destroy();
        }
      });
    // });
  }

  private updateDefaultTabsValues(tabs: BrowserTabs): void {
    if (tabs) {
      tabs.forEach((tab) => {
        if (!tab.id) {
          tab.id = this.tabsIdCounter ++;
        }
        if (!tab.label) {
          tab.label = 'New Tab';
        }
        if (!tab.navigation) {
          tab.navigation = {
            history: [],
            index: -1
          }
          // if (tab.route) {
          //   tab.navigation.history.push(tab.route);
          //   tab.navigation.index ++;
          // }
        }
        if (!tab.storedRoutes) {
          tab.storedRoutes = new Map<string, StoredRoute>();
        }
        // if (!tab.route) {
        //   tab.route = '/';
        // }
        // if (!tab.links) {
        //   tab.links = [];
        // }
        // if (!tab.route) {
        //   tab.route = this.defaultTabRoute;
        // }
      });
      // this.log('BrowserTabsService.updateDefaultTabsValues() tabs:', tabs);
    }
  }

  // public getTabId(index: number): number {
  //   const tabs: Tabs = this.tabs$.value;
  //   if (index >= 0 && index < tabs.length) {
  //     return tabs[index].id;
  //   }
  //   return null;
  // }
  // public getCurrentTabId(): number {
  //   return this.getTabId(this.selectedIndex$.value);
  // }

  public isTabChanged(): boolean {
    const currentTab = this.getCurrentTab();
    if (this.logNavigation) {
      this.log('BrowserTabsService.isTabChanged() previousTab:', this.previousTab, 'currentTab:', currentTab);
    }
    // if (!!this.previousTab && !!this.currentTab && this.previousTab !== this.currentTab) {
    if (this.previousTab !== currentTab) {
      return true;
    }
    return false;
  }

  private activateCurrentComponent(): void {
    if (this.currentStoredRoute) {
      const handle = this.currentStoredRoute.handle as any;
      if (handle.componentRef && handle.componentRef.instance) {
        const component = handle.componentRef.instance;
        if (this.logNavigation) {
          this.log('BrowserTabsService.activateCurrentComponent() component:', component);
        }
        this.activateComponent(component);
      
        // setTimeout(() => {
        if (this.logNavigation) {
          this.log('BrowserTabsService.activateCurrentComponent() +++++++ SET POSITION:', this.currentStoredRoute.position);
        }
        this.scrollPosition$.next(this.currentStoredRoute.position);
        // });
      }
    }
    else {
      if (this.logNavigation) {
        this.log('BrowserTabsService.activateCurrentComponent() NO component');
      }
      const currentTab = this.getCurrentTab();
      if (currentTab) {
        currentTab.label = 'New Tab';
        currentTab.icon = null;
      }
    }
    // this.navigating = false;
  }

  public activateComponent(component: ComponentTab): void {
    setTimeout(() => {
      if (this.logNavigation) {
        this.log('BrowserTabsService.activateComponent() component:', component);
      }
      const currentTab = this.getCurrentTab();
      if (component.browserTabLabel && typeof component.browserTabLabel === 'string') {
        if (this.logNavigation) {
          this.log('BrowserTabsService.activateComponent() component.browserTabLabel:', component.browserTabLabel);
        }
        currentTab!.label = component.browserTabLabel;
      }
      else {
        currentTab!.label = '';
      }
      if (component.browserTabIcon && typeof component.browserTabIcon === 'string') {
        if (this.logNavigation) {
          this.log('BrowserTabsService.activateComponent() component.browserTabIcon:', component.browserTabIcon);
        }
        currentTab!.icon = component.browserTabIcon;
      }
      else {
        currentTab!.icon = null;
      }
      if (component.browserUpButtonRouterLink && typeof component.browserTabLabel === 'string') {
        if (this.logNavigation) {
          this.log('BrowserTabsService.activateComponent() component.browserUpButtonRouterLink:', component.browserUpButtonRouterLink);
        }
        this.upButtonRouterLink$.next(component.browserUpButtonRouterLink);
      }
      else {
        this.upButtonRouterLink$.next(null);
      }
      if (component.onTabActivate && typeof component.onTabActivate === 'function') {
        // console.log('BrowserTabsComponent.onActivate() component.onTabActivate:', component.onTabActivate);
        component.onTabActivate();
      }
    });
  }

  /*
  private setNavigationUrl(route: string): void {
    const currentTab = this.getCurrentTab();
    this.log('route:', route, 'navigationAction:', this.navigationAction, 'dontSaveNavigationUrl:', this.dontSaveNavigationUrl, 'currentTab:', currentTab);
    // this.currentTab = this.getCurrentTab();
    if (currentTab && !this.dontSaveNavigationUrl) {
      this.log('previousTab:', this.previousTab, 'currentTab:', currentTab);
      // if (!this.currentTab) {
      //   this.currentTab = this.getCurrentTab();
      //   this.log('BrowserTabsService.setNavigationUrl() ~~~~~~~~~~~ currentTab:', this.currentTab);
      // }
      const navigation = currentTab.navigation;
      this.log('BEFORE - navigation index:', navigation.index, 'navigationHistory:', navigation.history);
      switch (this.navigationAction) {
        case "back": // back button pressed
          if (navigation.index > 0) {
            navigation.index --;
            navigation.history[navigation.index] = route;
          }
          break;
        case "next": // next button pressed
          if (navigation.history.length > (navigation.index + 1)) {
            navigation.index ++;
            navigation.history[navigation.index] = route;
          }
          break;
        default: // standard navigation
          navigation.index ++;
          navigation.history[navigation.index] = route;
          if (navigation.history.length > (navigation.index + 1)) {
            navigation.history.splice(navigation.index + 1, (navigation.history.length - navigation.index + 1));
          }
          break;
      }
      this.navigationAction = null;
      this.log('AFTER - navigation index:', navigation.index, 'navigationHistory:', navigation.history);
      // enable back button
      if (!this.backButtonEnabled$.value && navigation.index > 0) {
        this.backButtonEnabled$.next(true);
      } // disable back button
      else if (navigation.index === 0 && this.backButtonEnabled$.value) {
        this.backButtonEnabled$.next(false);
      }
      // enable next button
      if (navigation.history.length > (navigation.index + 1) && !this.nextButtonEnabled$.value) {
        this.nextButtonEnabled$.next(true);
      } // disable next button
      else if (this.nextButtonEnabled$.value && navigation.history.length <= (navigation.index + 1)) {
        this.nextButtonEnabled$.next(false);
      }
    }
    if (this.dontSaveNavigationUrl && currentTab) {
      const navigation = currentTab.navigation;
      this.log('navigation index:', navigation.index, 'navigationHistory:', navigation.history);
      this.dontSaveNavigationUrl = false;
    }
  }
  */

  /**
   * Called when select tab change
   */
  private gotoCurrentRoute(): void {
    const currentTab = this.getCurrentTab();
    // this.log('BrowserTabsService.gotoCurrentRoute() ~~~~~~~~~~~ tab:', tab);
    if (this.logNavigation) {
      this.log('BrowserTabsService.gotoCurrentRoute() ~~~~~~~~~~~ currentTab:', currentTab, 'previousTab:', this.previousTab);
    }
    // this.log('BrowserTabsService.gotoCurrentRoute() ~~~~~~~~~~~ currentRoute:', this.currentRoute);
    // this.log('BrowserTabsService.gotoCurrentRoute() currentTab.route:', (this.currentTab ? this.currentTab.route : undefined));
    // if (!!this.currentTab && !!this.previousTab && this.currentTab !== this.previousTab) {
    if (!!currentTab && currentTab !== this.previousTab) {
      if (currentTab.navigation && currentTab.navigation.history.length > 0 && currentTab.navigation.index >= 0) {
        const route = currentTab.navigation.history[currentTab.navigation.index];
        if (this.logNavigation) {
          this.log('navigate to:', route);
        }
        this.navigationService.navigate(route);
      }
      // if (this.currentTab.route) {
      //   // this.log('BrowserTabsService.gotoCurrentRoute() ~~~~~~~~~~~ currentTab.currentRoute:', this.currentTab.route);
      //   this.log('navigate to:', this.currentTab.route);
      //   this.navigationService.navigate(this.currentTab.route);
      //   // if (this.currentRoute) {
      //     // if (this.currentRoute !== tab.currentRoute) {
      //     // }
      //     // else {
      //     //   this.log('BrowserTabsService.gotoCurrentRoute() ~~~~~~~~~~~ setNavigationUrl:', tab.currentRoute);
      //     //   this.navigationService.navigate(tab.currentRoute);
      //     //   // this.setNavigationUrl(tab.currentRoute);
      //     // }
      //   // }
      // }
    }
    else {
      // setTimeout(() => {
        if (this.logNavigation) {
          this.log('BrowserTabsService.gotoCurrentRoute() ~~~~~~~~~~~ ...currentTab:', currentTab);
        }
        if (!currentTab && this.previousTab) { // Closed all tabs
          if (this.logNavigation) {
            this.log('BrowserTabsService.gotoCurrentRoute() ~~~~~~~~~~~ ...DEFAULT_ROUTE:', this.defaultRoute);
          }
          this.navigationService.navigate(this.defaultRoute);
        }
      // });
    }
  }

  public goBack(): void {
    const currentTab = this.getCurrentTab();
    if (this.logNavigation) {
      this.log('BrowserTabsService.goBack() currentTab.navigation:', currentTab!.navigation);
    }
    const navigation = currentTab!.navigation;
    if (navigation!.index > 0) {
      // this.navigationAction = "back";
      navigation!.index --;
      const previous = navigation!.history[navigation!.index];
      if (this.logNavigation) {
        this.log('BrowserTabsService.goBack() previous:', previous);
      }
      this.navigationService.navigate(previous);
    }
  }

  public goUp(): void {
    const currentTab = this.getCurrentTab();
    const upButtonRouterLink: string | null = this.upButtonRouterLink$.value;
    if (this.logNavigation) {
      this.log('BrowserTabsService.goUp() upButtonRouterLink:', upButtonRouterLink);
    }
    if (upButtonRouterLink) {
      this.navigationService.navigate(upButtonRouterLink);
    }
  }

  public goForward(): void {
    const currentTab = this.getCurrentTab();
    if (this.logNavigation) {
      this.log('BrowserTabsService.goForward() currentTab.navigation:', currentTab!.navigation);
    }
    const navigation = currentTab!.navigation;
    if (navigation!.index < (navigation!.history.length - 1)) {
      // this.navigationAction = "next";
      navigation!.index ++;
      const next = navigation!.history[navigation!.index];
      if (this.logNavigation) {
        this.log('BrowserTabsService.goForward() next:', next);
      }
      this.navigationService.navigate(next);
    }
  }

  public openLinkInNewTab(route: string): void {
    if (this.logNavigation) {
      this.log('BrowserTabsService.openLinkInNewTab() url:', route);
    }
    this.addTab(route);
  }

  // private getCurrentIndex(): number {
  //   return this.selectedIndex$.value;
  // }
  private getCurrentTab(): BrowserTab | null {
    const index = this.selectedIndex$.value;
    const tabs: BrowserTabs = this.tabs$.value;
    // this.log('BrowserTabsService.getCurrentTab() index:', index, 'tabs:', tabs);
    if (index >= 0 && index < tabs.length) {
      return tabs[index];
    }
    return null;
  }
  private getTabRoute(tab: BrowserTab): string | null {
    if (tab && tab.navigation && tab.navigation.history && tab.navigation.history.length > 0) {
      return tab.navigation.history[tab.navigation.index];
    }
    return null;
  }
  private getCurrentStoredRoutes(): Map<string, StoredRoute> | null {
    const tab = this.getCurrentTab();
    if (tab) {
      return tab.storedRoutes!;
    }
    return null;
  }

  public storeRoute(key: string, route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const currentTab = this.getCurrentTab();
    let refererTab: BrowserTab | null;
    let compareRoute: string | null;
    let position: Position;
    position = this.scrollPosition$.getValue();
    if (this.logStorage) {
      this.log('BrowserTabsService.storeRoute() key:', key, 'handle:', handle, 'previousTab:', this.previousTab, '+++++++ SAVE POSITION:', position, 'currentTab:', currentTab);
    }
    if (handle !== null) {
      if (this.destroyComponent) {
        let component;
        const handl = handle as any;
        // if (handl.componentRef && handl.componentRef.instance) {
        if (handl.componentRef && handl.componentRef) {
          component = handl.componentRef;
        }
        if (this.logStorage) {
          this.log('BrowserTabsService.storeRoute() !!!!!!!!!!!!! destroy component:', component);
        }
        if (component) {
          component.destroy();
        }
        this.destroyComponent = false;
      }
      else {
        // vado a salvare dove l'handle è null
        refererTab = this.previousTab;
        if (this.previousTab === currentTab) {
          compareRoute = this.previousRoute;
        } else {
          compareRoute = this.getTabRoute(refererTab!);
        }
        if (this.logStorage) {
          this.log('BrowserTabsService.storeRoute() handle !== null - prendo il tab previousTab: ', refererTab, ' con previousRoute:', compareRoute);
        }
      }
    }
    else {
      // vado a salvare il nuovo handle null della nuova pagina
      // refererTab = this.getCurrentTab();
      refererTab = currentTab;
      compareRoute = this.getTabRoute(refererTab!);
      if (this.logStorage) {
        this.log('BrowserTabsService.storeRoute() handle === null - prendo il currentTab.route:', compareRoute);
      }
    }
    if (refererTab!) {
      if (this.logStorage) {
        this.log('BrowserTabsService.storeRoute() xxxxxxxxxxxxxxxxxxxx compare key:', key, 'compareRoute:', compareRoute!, 'refererTab.storedRoutes:', refererTab.storedRoutes);
      }
      // if ('/' + key === compareRoute) {
      const previousStoredRoute = refererTab.storedRoutes!.get(key);
      if (this.logStorage) {
        this.log('BrowserTabsService.storeRoute() previousStoredRoute:', previousStoredRoute);
        if (previousStoredRoute) {
          this.log('BrowserTabsService.storeRoute() previousStoredRoute.handle:', previousStoredRoute.handle);
        }
      }
      refererTab.storedRoutes!.set(key, { route, handle, position });
      if (this.logStorage) {
        this.log('BrowserTabsService.storeRoute() refererTab.storedRoutes:', refererTab.storedRoutes);
      }
      // }
    }
    // const currentStoredRoutes = this.getCurrentStoredRoutes();
    // if (currentStoredRoutes) {
    //   // currentStoredRoutes[key] = { routeSnapshot, routeHandle };
    //   currentStoredRoutes.set(key, { route, handle });
    //   if (handle === null) {
    //     // this.lastNullHandleStoredRoute = currentStoredRoutes.get(key);
    //     this.log('BrowserTabsService.storeRoute() TROVATO HANDLE NULL');
    //   }
    //   this.log('BrowserTabsService.storeRoute() key:', key, 'handle:', handle);
    //   this.log('BrowserTabsService.storeRoute() currentStoredRoutes:', currentStoredRoutes);
    // }
    // const currentTabId = this.getCurrentTabId();
    // if (this.storedRouteTabs.has(currentTabId)) {
    //   const currentStoredRoutes = this.storedRouteTabs.get(currentTabId).storedRoutes;
    //   currentStoredRoutes[key] = { routeSnapshot, routeHandle };
    // }
  }

  public isStoredRoute(key: string): boolean {
    const currentStoredRoutes = this.getCurrentStoredRoutes();
    if (currentStoredRoutes) {
      // return !!currentStoredRoutes[key];
      const result = currentStoredRoutes.has(key);
      if (this.logStorage) {
        this.log('key:', key, 'return', result);
      }
      return result;
    }
    if (this.logStorage) {
      this.log('key:', key, 'return', false);
    }
    // const currentTabId = this.getCurrentTabId();
    // if (this.storedRouteTabs.has(currentTabId)) {
    //   const currentStoredRoutes = this.storedRouteTabs.get(currentTabId).storedRoutes;
    //   return !!currentStoredRoutes[key];
    // }
    return false;
  }

  public retrieveStoredRoute(key: string): DetachedRouteHandle | null {
    // this.log('BrowserTabsService.retrieveStoredRoute() key:', key);
    // const currentTab = this.getCurrentTab();
    // this.log('BrowserTabsService.retrieveStoredRoute() currentTab:', currentTab);
    const currentStoredRoutes = this.getCurrentStoredRoutes();
    if (currentStoredRoutes) {
      if (this.logStorage) {
        this.log('key:', key, 'currentStoredRoutes:', currentStoredRoutes);
      }
      // return currentStoredRoutes[key].routeHandle;
      this.currentStoredRoute = currentStoredRoutes.get(key) ?? null;
      if (this.currentStoredRoute) {
        if (this.logStorage) {
          this.log('currentStoredRoute:', this.currentStoredRoute);
        }
        const handle = this.currentStoredRoute.handle as any;
        // if (handle.componentRef && handle.componentRef.instance) {
        //   const component = handle.componentRef.instance;
        //   this.log('BrowserTabsService.retrieveStoredRoute() component:', component);
        //   this.activateComponent(component);
        //   setTimeout(() => {
        //     this.log('BrowserTabsService.retrieveStoredRoute() +++++++ SET POSITION:', this.currentStoredRoute.position);
        //     this.scrollPosition$.next(this.currentStoredRoute.position);
        //   });
        // }
        if (this.logStorage) {
          this.log('BrowserTabsService.retrieveStoredRoute() handle:', handle);
        }
        return handle;
      }
      // else {
        // setTimeout(() => {
        //   this.log('BrowserTabsService.retrieveStoredRoute() +++++++ SET POSITION 0 0');
        //   this.scrollPosition$.next([0, 0]);
        // });
      // }
    }
    // const currentTabId = this.getCurrentTabId();
    // if (this.storedRouteTabs.has(currentTabId)) {
    //   const currentStoredRoutes = this.storedRouteTabs.get(currentTabId).storedRoutes;
    //   return currentStoredRoutes[key].routeHandle;
    // }
    return null;
  }

}
