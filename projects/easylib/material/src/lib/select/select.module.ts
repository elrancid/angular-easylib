import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SelectComponent } from '../select/select.component';
import { DisabledControlDirective } from '../disabled-control.directive';

@NgModule({
  declarations: [
    SelectComponent,
    DisabledControlDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  exports: [
    SelectComponent,
    DisabledControlDirective,
  ]
})
export class SelectModule { }
