# NavList

Navigation list in navigation panel.

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
```

Add material fonts to `index.html`:
### index.html
```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
```

Add component to `app.component`:
### app.component.html
```html
<easy-sidenav #sidenav>
  <easy-nav-list
  class="sidenav"
  [list]="list"
  ></easy-nav-list>
  <div class="wrapper">
    <router-outlet></router-outlet>
  </div>
</easy-sidenav>
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
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'page1',
    loadChildren: () => import('./page1/page1.module').then(m => m.Page1Module),
  },
  {
    path: 'page2',
    loadChildren: () => import('./page2/page2.module').then(m => m.Page2Module),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
