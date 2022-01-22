import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// import { MaterialModule } from 'src/app/shared/material/material.module';
import { InputComponent } from './input.component';
import { InputArrayComponent } from './input-array.component';

export type InputType = 'color' | 'date' | 'datetime-local' | 'email' | 'month' |
'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';

@NgModule({
  declarations: [
    InputComponent,
    InputArrayComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // MaterialModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    InputComponent,
    InputArrayComponent,
    // MaterialModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class InputModule { }
