import { AfterViewInit, Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_TABS_CONFIG, MAT_TAB_GROUP } from '@angular/material/tabs';
import { LoggableComponent } from '@easylib/log';
// import { Tab } from './tab';
// import { DynamicItem } from './dynamic-item';
// import { DynamicComponent } from './dynamic.component';
import { DynamicService } from '../dynamic/dynamic.service';
// import { DynamicComponentDirective, DynamicService } from '@easylib/util';
// import { DynamicComponentDirective } from '../dynamic/dynamic-component.directive';
// import { DynamicTabDirective } from './dynamic-tab.directive';
import { DynamicComponentDirective } from '../dynamic/dynamic-component.directive';
import { Tabs } from './tabs.module';

@Component({
  selector: 'easy-tabs',
  templateUrl: './tabs.component.html',
  styles: [
    ':host { display: block; }'
  ],
  providers: [
    {
      provide: MAT_TAB_GROUP,
      useValue: undefined,
    },
    {
      provide: MAT_TABS_CONFIG,
      useValue: {
        animationDuration: '0ms',
      },
    },
  ],
})
export class TabsComponent extends LoggableComponent implements AfterViewInit {

  @Input() override logs = false;

  @Input() tabs: Tabs | null = [];

  @Input() selectedIndex: number | null = null;
  @Output() selectedIndexChange = new EventEmitter<number>();
  @ViewChild('tabGroup') tabGroup: any;
  @Output() closeTab = new EventEmitter<number>();

  @Input() browserTabsStyle!: boolean;

  // currentDynamicIndex = -1;
  // interval: any;
  // @Input() dynamicComponents: DynamicItem[];
  // @ViewChild(DynamicComponentDirective, {static: true}) dynamicComponentDirective: DynamicComponentDirective;
  @ViewChildren(DynamicComponentDirective) dynamicComponentsDirective!: QueryList<DynamicComponentDirective>;

  constructor(
    private dynamicService: DynamicService,
    // private componentFactoryResolver: ComponentFactoryResolver,
    ) {
    super();
  }

  ngAfterViewInit(): void {
    this.createDynamycComponents();
    setTimeout(() => {
      this.log('TabsComponent.ngAfterViewInit() set index:', this.tabGroup.selectedIndex);
      this.indexChange(this.tabGroup.selectedIndex);
      // this.selectedIndex = this.tabGroup.selectedIndex;
    });
  }

  private createDynamycComponents(): void {
    this.log('TabsComponent.createDynamycComponents() dynamicComponentsDirective:', this.dynamicComponentsDirective);
    this.dynamicComponentsDirective.forEach((element, index) => {
      this.log('TabsComponent.createDynamycComponents() index:', index);
      // this.log('element:', element);
      // this.log('element.viewContainerRef:', element.viewContainerRef);
      const viewContainerRef = element.viewContainerRef;
      viewContainerRef.clear();
      if (this.tabs) {
        const tabItem = this.tabs[index].item;
        if (tabItem) {
          this.dynamicService.createDynamycComponents(viewContainerRef, tabItem);
          // const item = this.tabs[index].item;
          // this.log('item:', item);
          // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
          // const componentRef = viewContainerRef.createComponent<DynamicComponent>(componentFactory);
          // this.log('TabsComponent.createDynamycComponents() componentRef.instance:', componentRef.instance);
          // setTimeout(() => {
          //   Object.assign(componentRef.instance, item.data);
          // });
        }
      }

      // for (const property in item.data) {
      //   if (item.data.hasOwnProperty(property)) {
      //     // this.log(`obj.${property} = ${obj[property]}`);
      //     componentRef.instance[property] = item.data[property];
      //   }
      // }
      // componentRef.instance.ngOnInit();
      // componentRef.changeDetectorRef.detectChanges();
      // componentRef.injector.get(ChangeDetectorRef).markForCheck(); // or detectChanges()
      // componentRef.hostView.detectChanges();
      // Object.assign(componentRef.instance, item.data);

    });
    // this.log('dynamicComponentDirective.viewContainerRef:', this.dynamicComponentDirective.viewContainerRef);

    // this.currentDynamicIndex = (this.currentDynamicIndex + 1) % this.dynamicComponents.length;
    // const item = this.dynamicComponents[this.currentDynamicIndex];
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
    // const viewContainerRef = this.dynamicComponentDirective.viewContainerRef;
    // viewContainerRef.clear();
    // const componentRef = viewContainerRef.createComponent<DynamicComponent>(componentFactory);
    // componentRef.instance.data = item.data;
  }

  public indexChange(index: number): void {
    // console.log('TabsComponent.indexChange() this:', this);
    this.log('TabsComponent.indexChange() index:', index);
    this.selectedIndex = index;
    this.log('TabsComponent.indexChange() selectedIndex:', this.selectedIndex);
    this.log('TabsComponent.indexChange() tabGroup.selectedIndex:', this.tabGroup.selectedIndex);
    this.selectedIndexChange.emit(this.selectedIndex);
  }

  public closeTabEvent(index: number): void {
    this.log('TabsComponent.closeTab() index:', index);
    this.closeTab.emit(index);
  }
}
