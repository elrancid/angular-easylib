import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
// import { PagesDynamicComponentDirective } from './pages-dynamic-component.directive';
// import { DynamicComponentDirective } from '@easylib/util';
// import { DynamicComponentDirective } from '../dynamic/dynamic-component.directive';
import { DynamicModule } from '../dynamic/dynamic.module';

@NgModule({
  declarations: [
    PagesComponent,
    // DynamicComponentDirective,
  ],
  imports: [
    CommonModule,
    DynamicModule,
  ],
  exports: [
    PagesComponent,
  ]
})
export class PagesModule { }
