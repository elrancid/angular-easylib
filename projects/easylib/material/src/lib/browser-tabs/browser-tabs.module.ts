import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { BrowserTabsComponent } from './browser-tabs.component';
// import { DynamicComponentDirective } from '@easylib/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// import { MatTabsModule } from '@angular/material/tabs';
// import { TabsModule } from '@easylib/material';
import { TabsModule } from '../tabs/tabs.module';

// import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserTabScrollDirective } from './browser-tab-scroll.directive';

@NgModule({
  declarations: [
    BrowserTabsComponent,
    BrowserTabScrollDirective,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    TabsModule,
    RouterModule,
    // MatTabsModule,
    // RouterModule..forChild(routes),
    // ScrollingModule,
    // SharedModule,
  ],
  exports: [
    BrowserTabsComponent,
  ]
})
export class BrowserTabsModule { }
