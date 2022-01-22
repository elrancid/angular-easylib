import { HostBinding, NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { BrowserTabPageComponent } from './browser-tab-page.component';

@NgModule({
  declarations: [
    BrowserTabPageComponent,
  ],
  imports: [
    // CommonModule,
  ],
  exports: [
    BrowserTabPageComponent,
  ]
})
export class BrowserTabPageModule { }
