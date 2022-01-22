import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from './icon.component';

@NgModule({
  declarations: [
    IconComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [
    IconComponent,
  ]
})
export class IconModule { }
