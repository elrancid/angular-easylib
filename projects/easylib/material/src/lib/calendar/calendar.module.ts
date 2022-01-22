import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CalendarComponent } from '../calendar/calendar.component';

@NgModule({
  declarations: [
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
  ],
  exports: [
    CalendarComponent,
  ]
})
export class CalendarModule { }
