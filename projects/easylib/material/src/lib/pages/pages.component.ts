import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { LoggableComponent } from '@easylib/log';
import { DynamicComponentDirective } from '../dynamic/dynamic-component.directive';
import { DynamicService } from '../dynamic/dynamic.service';
// import { DynamicItems } from '../dynamic/dynamic';
import { DynamicItems } from '../dynamic/dynamic.module';
// import { DynamicComponentDirective, DynamicService, DynamicItems } from '@easylib/util';

@Component({
  selector: 'easy-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent extends LoggableComponent implements AfterViewInit {

  @Input() override logs = false;

  @Input() pages!: DynamicItems;
  @Input() selectedIndex!: number;
  @ViewChildren(DynamicComponentDirective) dynamicComponentsDirective!: QueryList<DynamicComponentDirective>;

  @ViewChild('content') content!: ElementRef;


  constructor(
    private dynamicService: DynamicService,
    // private componentFactoryResolver: ComponentFactoryResolver,
    // private elementRef: ElementRef,
    ) {
    super();
  }

  ngAfterViewInit(): void {
    this.createDynamycComponents();
  }

  private createDynamycComponents(): void {
    this.log('PagesComponent.createDynamycComponents() dynamicComponentsDirective:', this.dynamicComponentsDirective);
    this.dynamicComponentsDirective.forEach((element, index) => {
      this.log('PagesComponent.createDynamycComponents() index:', index);
      // this.log('element:', element);
      // this.log('element.viewContainerRef:', element.viewContainerRef);
      const viewContainerRef = element.viewContainerRef;
      viewContainerRef.clear();
      if (this.pages[index].component) {
        this.dynamicService.createDynamycComponents(viewContainerRef, this.pages[index]);
        // const item = new DynamicItem(this.pages[index].component, this.pages[index].properties);
        // this.log('item:', item);
        // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
        // const componentRef = viewContainerRef.createComponent<DynamicComponent>(componentFactory);
        // this.log('PagesComponent.createDynamycComponents() componentRef.instance:', componentRef.instance);
        // setTimeout(() => {
        //   Object.assign(componentRef.instance, item.data);
        // });
      }
    });
  }

}
