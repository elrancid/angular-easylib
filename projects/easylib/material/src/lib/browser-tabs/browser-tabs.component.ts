import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { LoggableComponent } from '@easylib/log';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterService } from '@easylib/core';
// import { DynamicComponentDirective } from '@easylib/material';
// import { Pages, DynamicComponent, DynamicItem } from './pages';
// import { Tabs } from '@easylib/material';
// import { Tabs } from './browser-tabs.service';
import { BrowserTabsService, TabRouteInfos } from './browser-tabs.service';
// import { BrowserTabDirective } from './browser-tab.directive';

@Component({
  selector: 'easy-browser-tabs',
  templateUrl: './browser-tabs.component.html',
  styleUrls: ['./browser-tabs.component.scss']
})
export class BrowserTabsComponent extends LoggableComponent implements OnInit, OnDestroy {

  @Input() override logs = false;

  @Input() show = true;
  
  // @Input() tabRouteInfos: TabRouteInfos;

  private stop$: Subject<void> = new Subject();

  // @Input() selectedIndex: number;
  // public selectedTabIndex: number;
  // private tabsIdCounter: number = 1;
  // @Input() tabs: Tabs;

  constructor(
    public browserTabsService: BrowserTabsService,
    // private componentFactoryResolver: ComponentFactoryResolver,
    // private elementRef: ElementRef,
    private routerService: RouterService, // need instance for BrowserTabsService that can't inject because circular dependencies
  ) {
    super();
  }

  ngOnInit(): void {
    this.log('BrowserTabsComponent.ngOnInit()');
    // if (this.tabRouteInfos) {
    //   this.browserTabsService.setTabRouteInfos(this.tabRouteInfos);
    // }

    // this.browserTabsService.tabs$
    // .pipe(takeUntil(this.stop$))
    // .subscribe((tabs) => {
    //   this.log('BrowserTabsComponent. *** subscribe tabs:', tabs);
    // });
    // this.browserTabsService.selectedIndex$
    // .pipe(takeUntil(this.stop$))
    // .subscribe((selectedIndex) => {
    //   this.log('BrowserTabsComponent. *** subscribe selectedIndex:', selectedIndex);
    // });

    // this.browserTabsService.browserTabLabel$
    // .pipe(takeUntil(this.stop$))
    // .subscribe((browserTabLabel) => {
    //   this.log('BrowserTabsComponent. *** subscribe browserTabLabel:', browserTabLabel);
    // });
    // this.browserTabsService.browserTabIcon$
    // .pipe(takeUntil(this.stop$))
    // .subscribe((browserTabIcon) => {
    //   this.log('BrowserTabsComponent. *** subscribe browserTabIcon:', browserTabIcon);
    // });
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }

  public selectedIndexChange(index: number): void {
    this.log('BrowserTabsComponent.selectedIndexChange() index:', index);
    this.browserTabsService.selectedIndex$.next(index);
    // this.selectedTabIndex = index;
    // this.log('BrowserTabsComponent.selectedIndexChange() selectedTabIndex:', this.selectedTabIndex);
    // this.log('HomeComponent.afterViewInit() tabGroup.selectedIndex:', this.tabGroup.selectedIndex);
  }

  public addTab(event: Event): void {
    this.log('BrowserTabsComponent.addTab() event:', event);
    // this.browserTabsService.addTab({ icon: 'add', label: 'Nuovo', });
    this.browserTabsService.addTab();
  }

  public closeTab(index: number): void {
    this.log('BrowserTabsComponent.closeTab() index:', index);
    this.browserTabsService.closeTab(index);
  }

  // public indexChange(index: number): void {
  //   // this.log('TabsComponent.indexChange() this:', this);
  //   this.log('BrowserTabsComponent.indexChange() index:', index);
  //   this.selectedIndex = index;
  //   this.log('BrowserTabsComponent.indexChange() selectedIndex:', this.selectedIndex);
  //   // this.log('TabsComponent.indexChange() tabGroup.selectedIndex:', this.tabGroup.selectedIndex);
  //   // this.selectedIndexChange.emit(this.selectedIndex);
  // }

  public goBack(event: Event): void {
    this.log('BrowserTabsComponent.goBack() event:', event);
    this.browserTabsService.goBack();
  }

  public goUp(event: Event): void {
    this.log('BrowserTabsComponent.goUp() event:', event);
    this.browserTabsService.goUp();
  }

  public goForward(event: Event): void {
    this.log('BrowserTabsComponent.goForward() event:', event);
    this.browserTabsService.goForward();
  }

  // private updateTabsId(): void {
  //   if (this.tabs) {
  //     this.tabs.forEach((tab) => {
  //       if (!tab.id) {
  //         tab.id = this.tabsIdCounter ++;
  //       }
  //     });
  //     this.log('BrowserTabsComponent.updateTabsId() tabs:', this.tabs);
  //   }
  // }

  onActivate(component: Component) {
    this.log('BrowserTabsComponent.onActivate() component:', component);
    this.browserTabsService.activateComponent(component);
    // Applico la direttiva BrowserTabDirective al componente
    // const btnDirective = new BrowserTabDirective(component, this.browserTabsService);
    // btnDirective.appButton = 'green';
    // btnDirective.ngAfterViewInit();
  }
  onDeactivate(component: any) {
    this.log('BrowserTabsComponent.onDeactivate() component:', component);
  }
}
