import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeManagerComponent } from './theme-manager.component';


export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeSize = 'xs' | 's' | 'm' | 'l' | 'xl';

// export interface ThemeState {
//   mode: ThemeMode;
//   size: ThemeSize;
// }

@NgModule({
  declarations: [
    ThemeManagerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ThemeManagerComponent,
  ],
})
export class ThemeManagerModule {}
