import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { ButtonModule } from 'src/app/shared/material/button/button.module';

@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormComponent,
  ]
})
export class FormModule { }
