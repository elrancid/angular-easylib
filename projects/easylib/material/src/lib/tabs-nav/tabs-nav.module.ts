import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsNavComponent } from './tabs-nav.component';

export declare interface Link {
  path: string;
  label?: string;
}

export declare type Links = Array<Link>;

@NgModule({
  declarations: [
    TabsNavComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    RouterModule,
  ],
  exports: [
    TabsNavComponent,
  ]
})
export class TabsNavModule { }
