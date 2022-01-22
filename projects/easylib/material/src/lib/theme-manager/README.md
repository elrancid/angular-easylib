# ThemeManager

Switch `light` and `dark` themes.

## How to use

- Import `theme-manager.module` module in your app.
```ts
import { ThemeManagerModule } from '@easylib/material';
@NgModule({
  imports: [
    ThemeManagerModule,
  ],
})
```

- Add `easy-theme-manager` to `app.component`:
### app.component.html
```html
<easy-theme-manager
[themeMode]="themeMode"
[themeSize]="themeSize"
></easy-theme-manager>
```

### app.component.ts
```ts
import { Component } from '@angular/core';
import { ThemeMode } from '@easylib/material';
import { ThemeSize } from '@easylib/material';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public themeMode: ThemeMode = 'auto';
  public themeSize: ThemeSize = 'm';
}
```

- You can get current theme mode with:
### app.component.html
```html
<easy-theme-manager
(theme)="themeChange($event)"
></easy-theme-manager>
```

### app.component.ts
```ts
  themeChange(mode: any): void {
    console.log('mode:', mode);
  }
```

## Theme for easy-table

Table component uses `primeng` table. If you want to use `easy-table` you need to:

- add two theme templates in two different files (default `light.css` and `dark.css`).

### src/app/light.css
```css
@import '~primeng/resources/themes/mdc-light-indigo/theme.css';
```

### src/app/dark.css
```css
@import '~primeng/resources/themes/mdc-dark-indigo/theme.css';
```
See [here](https://www.primefaces.org/primeng/showcase/#/setup) for the list of 
ready themes.

- Add the two files in `angular.json` style options:
### angular.json
```json
{
  "projects": {
    "[project-name]": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss",
              {
                "input": "src/app/light.scss",
                "bundleName": "light",
                "inject": false
              },
              {
                "input": "src/app/dark.scss",
                "bundleName": "dark",
                "inject": false
              }
            ]
          }
        }
      }
    }
  }
}
```
- Add stylesheet link in `index.html`:
### index.html
```html
<head>
  <link rel="stylesheet" id="app-theme" type="text/css" href="light.css">
</head>
```

- You can use differents names for element id and css files name:
### app.component.html
```html
<easy-theme-manager
stylesheetLinkElementId="app-theme"
stylesheetLightFile="light"
stylesheetDarkFile="dark"
></easy-theme-manager>
```

More informations [here](https://dev.to/primetek/how-to-switch-your-angular-app-between-material-bootstrap-and-custom-themes-at-runtime-5788).
