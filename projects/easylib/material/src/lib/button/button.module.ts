import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent } from './button.component';
import { ButtonRaisedComponent } from './button-raised.component';
import { ButtonStrokedComponent } from './button-stroked.component';
import { ButtonFlatComponent } from './button-flat.component';
import { ButtonIconComponent } from './button-icon.component';
import { ButtonFabComponent } from './button-fab.component';
import { ButtonMiniFabComponent } from './button-mini-fab.component';

@NgModule({
  declarations: [
    ButtonComponent,
    ButtonRaisedComponent,
    ButtonStrokedComponent,
    ButtonFlatComponent,
    ButtonIconComponent,
    ButtonFabComponent,
    ButtonMiniFabComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  exports: [
    ButtonComponent,
    ButtonRaisedComponent,
    ButtonStrokedComponent,
    ButtonFlatComponent,
    ButtonIconComponent,
    ButtonFabComponent,
    ButtonMiniFabComponent,
  ]
})
export class ButtonModule { }
