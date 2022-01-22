import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { RadioButtonsComponent } from './radio-buttons.component';

@NgModule({
  declarations: [
    RadioButtonsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
  ],
  exports: [
    RadioButtonsComponent,
  ],
})
export class RadioButtonsModule {}
