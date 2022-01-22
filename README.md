# AngularEasylib

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.2.

It's an experimental angular libraries collection.

Current libraries:
- `core`: core utility
- `util`: utility
- `log`: logs utility
- `material`: components wrapper for material components

## Create project

This project was created with `ng new angular-easylib --create-application=false`

## Add library

To add a new library: `ng generate library @easylib/[name]`

## Build

Build a library: `ng build @easylib/[name]`

Build a library for production: `ng build @easylib/[name] --prod`

Build the project: "`ng build`" or "`yarn run build`"

## Development

You can develop and test the libraries building in live with "`yarn run build:watch`" or "`ng build --watch`" and linking them to a develop project.

### How to link easylib packages to project

Create yarn links from easylib dist folders:
```bash
cd dist/easylib/core
yarn link
cd ../../../dist/easylib/util
yarn link
cd ../../../dist/easylib/log
yarn link
cd ../../../dist/easylib/material
yarn link
```

Link packages to your project
```bash
cd [path_to_angular_develop_project]
yarn link @easylib/core
yarn link @easylib/util
yarn link @easylib/log
yarn link @easylib/material
```
and set `preserveSymlinks` to `angular.json` project options:
```json
{
  "projects": {
    "...": {
      "architect": {
        "build": {
          "options": {
            "preserveSymlinks": true
```

Add dependencies to your project:
```bash
yarn add @angular/cdk\
 @angular/material\
 @angular/material-moment-adapter\
 @ngrx/effects\
 @ngrx/router-store\
 @ngrx/store\
 @ngx-translate/core\
 @ngx-translate/http-loader\
 lodash-es\
 moment\
 ngrx-store-freeze\
 primeng\
 primeicons;
yarn add --dev\
 @ngrx/schematics\
 @ngrx/store-devtools;
```

Now is possible to serve the project having the always builded version of libraries.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

# Publish

Build the project for production and copy dist files to target repositories: `./buildProd.sh`

Repositories are in parent directory under `easylib-[name]` directories.

Push target repositories to github.

To use the libraries create a new angular project:
```bash
ng new my-project
cd my-project
```
and add libraries with:
```bash
yarn add git://github.com/elrancid/easylib-core.git
yarn add git://github.com/elrancid/easylib-material.git
```

Current libraries are compiled with ivy, so I don't publish to npm.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
