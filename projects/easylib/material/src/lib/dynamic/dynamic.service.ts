import { ComponentFactoryResolver, ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
// import { DynamicComponent, DynamicItem } from './dynamic';
// import { DynamicItem } from './dynamic';
import { DynamicItem } from './dynamic.module';

@Injectable({
  providedIn: 'root'
})
export class DynamicService {
  public logs = true;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  createDynamycComponents(viewContainerRef: ViewContainerRef, dynamicItem: DynamicItem): ComponentRef<any> {
    // private createDynamycComponents2(viewContainerRef: ViewContainerRef, component: Type<any>, properties: object): ComponentRef<any> {
    // const item = new DynamicItem(component, properties);
    // console.log('item:', item);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicItem.component);
    const componentRef = viewContainerRef.createComponent<any>(componentFactory);
    // console.log('PagesComponent.DynamicService() componentRef.instance:', componentRef.instance);
    setTimeout(() => {
      Object.assign(componentRef.instance, dynamicItem.properties);
    });
    return componentRef;
}

}
