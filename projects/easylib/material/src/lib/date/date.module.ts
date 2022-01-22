import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MaterialModule } from 'src/app/shared/material/material.module';
import { DateComponent } from './date.component';


@NgModule({
  declarations: [
    DateComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // MaterialModule,
    MatInputModule,
    MatDatepickerModule,
    // MatIconModule,
    // MatButtonModule,
  ],
  exports: [
    DateComponent,
    // MaterialModule,
    MatInputModule,
    MatDatepickerModule,
    // MatIconModule,
    // MatButtonModule,
  ]
})
export class DateModule { }
