import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToggleComponent } from './toggle.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ToggleComponent
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  exports: [
    ToggleComponent,
  ],
})
export class ToggleModule {}
