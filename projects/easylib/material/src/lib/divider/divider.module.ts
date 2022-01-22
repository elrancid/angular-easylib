import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { DividerComponent } from './divider.component';
import { ResizerDirective } from '../resizer.directive';

@NgModule({
  declarations: [
    DividerComponent,
    ResizerDirective,
  ],
  imports: [
    CommonModule,
    MatDividerModule,
  ],
  exports: [
    DividerComponent,
    ResizerDirective,
  ]
})
export class DividerModule { }
