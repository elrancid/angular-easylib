# BrowserTabs

Simulate browser like navigation.

## How to use

Example adding component in your app.

Import modules in `app.module`:
### app.module.ts
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@easylib/core';
import { MaterialModule } from '@easylib/material';
import { SidenavModule } from '@easylib/material';
import { NavListModule } from '@easylib/material';
import { BrowserTabsModule } from '@easylib/material';
import { ButtonModule } from '@easylib/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
@NgModule({
  declarations: [
    AppComponent,
    // BrowserTabsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    MaterialModule,
    SidenavModule,
    NavListModule,
    BrowserTabsModule,
    ButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Add css to `styles.css`;
```scss
@import '~@angular/material/theming';

$light-primary: mat-palette($mat-blue);
$light-accent: mat-palette($mat-deep-orange, A200, A100, A400);
$light-warn: mat-palette($mat-red);
$dark-primary: mat-palette($mat-blue-grey);
$dark-accent:  mat-palette($mat-amber, A200, A100, A400);
$dark-warn:    mat-palette($mat-deep-orange);

@import '~@easylib/material/theming';

[browser-tab-page] {
  display: block;
  margin: 16px;
}
```

Add material fonts to `index.html`:
### index.html
```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
```

Add `browser-tabs` to `app.component`:
### app.component.html
```html
<easy-sidenav #sidenav>
  <easy-nav-list
  class="sidenav"
  [list]="list"
  ></easy-nav-list>
  <div class="wrapper">
    <easy-browser-tabs>
      <easy-button-icon
      beforeNavButtons
      color=""
      icon="menu"
      (click)="sidenav.toggle()"
      ></easy-button-icon>
    </easy-browser-tabs>
  </div>
</easy-sidenav>
<easy-theme-manager
[themeMode]="themeMode"
[themeSize]="themeSize"
></easy-theme-manager>
```

### app.component.ts
```ts
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public themeMode: ThemeMode = 'auto';
  public themeSize: ThemeSize = 'm';
  public list: Array<Object> = [
    {
      routerLink: '/home',
      label: 'Home',
    },
    {
      routerLink: '/page1',
      label: 'Page 1',
    },
    {
      routerLink: '/page2',
      label: 'Page 2',
    },
  ];
}
```

Add routing to `app-routing.module`:
### app-routing.module.ts
```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserTabsReuseStrategy } from '@easylib/material';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    data: {
      noStore: true, // don't save this route
      noReuse: false, // don't reuse ruote with different params
    },
  },
  {
    path: 'page1',
    loadChildren: () => import('./page1/page1.module').then(m => m.Page1Module),
    data: {
      noStore: true, // don't save this route
      noReuse: false, // don't reuse ruote with different params
    },
  },
  {
    path: 'page2',
    loadChildren: () => import('./page2/page2.module').then(m => m.Page2Module),
    data: {
      noStore: true, // don't save this route
      noReuse: false, // don't reuse ruote with different params
    },
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
  })],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: BrowserTabsReuseStrategy,
  }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

Add page components, in example:
### home/home.component.ts
```ts
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { LoggableComponent } from '@easylib/log';
import { ComponentTab, OnComponentTabActivate } from '@easylib/material';

@Component({
  selector: 'app-home',
  template: `Home`,
  styles: []
})
export class HomeComponent extends LoggableComponent implements OnInit, OnDestroy, ComponentTab, OnComponentTabActivate {

  @Input() logs = true;

  @HostBinding('attr.browser-tab-page') browserTabPage: string = '';

  browserTabLabel = 'Home';
  browserTabIcon = 'home';
  browserUpButtonRouterLink = '/home'; // link fot up-arrow on the left of browser tab

  constructor() {
    super();
    this.log('costructor');
  }

  ngOnInit() {
    this.log('ngOnInit');
  }

  ngOnDestroy() {
    this.log('ngOnDestroy');
  }

  onComponentTabActivate(): void {
    this.log('onComponentTabActivate');
  }
}
```
