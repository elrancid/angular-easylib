import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { NavListComponent } from './nav-list.component';

export declare interface NavListItem {
  routerLink: string,
  label: string
}
export declare type NavListItems = Array<NavListItem>;

@NgModule({
  declarations: [
    NavListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
  ],
  exports: [
    NavListComponent,
  ],
})
export class NavListModule {}
