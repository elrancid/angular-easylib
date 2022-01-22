import { Component, Input } from '@angular/core';
import { NavListItems } from './nav-list.module';

@Component({
  selector: 'easy-nav-list',
  template: `
  <mat-nav-list>
    <!-- routerLinkActive="active" -->
    <a
    *ngFor="let item of list"
    mat-list-item
    [routerLink]="item.routerLink"
    >{{ item.label }}</a>
    <ng-content></ng-content>
  </mat-nav-list>
  `,
  styles: []
})
export class NavListComponent {

  @Input() list?: NavListItems;

  constructor() {
  }

}
