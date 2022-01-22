import { NgModule } from '@angular/core';
import { DynamicComponentDirective } from '../dynamic/dynamic-component.directive';

import { Type } from '@angular/core';

// export declare interface DynamicComponent {
//   data: any;
// }
// export class DynamicItem {
//   constructor(public component: Type<any>, public data: any) {}
// }

export declare interface DynamicItem {
  // icon?: string;
  // label?: string;
  // content?: string;
  // item?: DynamicItem;
  component: Type<any>;
  properties?: object;
}
export declare type DynamicItems = Array<DynamicItem>;

@NgModule({
  declarations: [
    DynamicComponentDirective,
  ],
  imports: [
  ],
  exports: [
    DynamicComponentDirective,
  ]
})
export class DynamicModule { }
