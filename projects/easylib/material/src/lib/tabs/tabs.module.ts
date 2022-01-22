import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TabsComponent } from './tabs.component';
// import { DynamicComponentDirective, DynamicItem } from '@easylib/util';
// import { DynamicItem } from '../dynamic/dynamic';
import { DynamicItem } from '../dynamic/dynamic.module';
// import { DynamicComponentDirective } from '../dynamic/dynamic-component.directive';
// import { DynamicTabDirective } from './dynamic-tab.directive';
import { DynamicModule } from '../dynamic/dynamic.module';


// import { Type } from '@angular/core';
// export declare interface DynamicComponent {
//   data: any;
// }
// export class DynamicItem {
//   constructor(public component: Type<any>, public data: any) {}
// }
export declare interface BasicTab {
  icon?: string | null;
  label?: string | null;
}
export declare interface Tab extends BasicTab {
  item?: DynamicItem;
}
export declare type Tabs = Array<Tab>;


@NgModule({
  declarations: [
    TabsComponent,
    // DynamicComponentDirective,
    // DynamicTabDirective,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    DynamicModule,
  ],
  exports: [
    TabsComponent,
    // MatTabsModule,
    // MatIconModule,
  ]
})
export class TabsModule { }
