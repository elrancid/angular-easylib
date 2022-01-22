import { NgModule, Optional, SkipSelf } from '@angular/core';
// import { CoreComponent } from './core.component';
import { EnsureImportedOnceModule } from './ensure-imported-once.module';

@NgModule({
  declarations: [
    // CoreComponent
  ],
  imports: [
  ],
  exports: [
    // CoreComponent
  ]
})
export class CoreModule extends EnsureImportedOnceModule {
  // Stop the other modules from importing the core module.
  constructor(@Optional() @SkipSelf() module: CoreModule ) {
    super(module);
  }
}
