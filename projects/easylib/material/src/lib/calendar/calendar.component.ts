import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Loggable } from 'src/app/core/log/loggable';
import { Logger } from 'src/app/core/log/logger';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material/datepicker';


/*
https://www.freakyjolly.com/angular-8-7-material-inline-matcalender-datepicker-tutorial-by-example/#.X9N7B6pKiL4
https://onthecode.co.uk/angular-material-calendar-component/
*/
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent extends Loggable implements OnInit {

  @ViewChild('calendar') calendar: MatCalendar<Moment>;

  @Input() logs = true;

  @Input() selectedDate: Moment; // = new Date('2019/09/26');
  @Output() selectedDateChange: EventEmitter<Moment> = new EventEmitter();

  @Input() dateClass: Function;

  public startAt: Date; // = new Date('2019/09/11');
  public minDate: Date; // = new Date('2019/09/14');
  public maxDate: Date; // = new Date(new Date().setMonth(new Date().getMonth() + 1));
  // year: any;
  // DayAndDate: string;

  constructor(private renderer: Renderer2) {
    super();
    // this.selectedDate = moment();
    // setTimeout(() => {
    //   this.selectedDate = this.selectedDate.add(3, 'day');
    //   // this.calendar.activeDate = this.selectedDate;
    //   this.log('CalendarComponent change date to:', this.selectedDate.format('DD/MM/YYYY'));
    // }, 3000);
  }

  ngOnInit(): void {
    // const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button');
    // if (buttons) {
    //   Array.from(buttons).forEach(button => {
    //     this.renderer.listen(button, 'click', () => {
    //       this.log('CalendarComponent - Arrow buttons clicked.');
    //       alert('Arrow buttons clicked');
    //     });
    //   });
    // }
  }

  selectedChange(date: Moment): void {
    this.log('CalendarComponent.onSelect() date:', date.toString());
    this.log('CalendarComponent.onSelect() selectedDate:', this.selectedDate.toString());
    this.selectedDateChange.emit(this.selectedDate);
    // this.selectedDate = date;
    // const dateString = event.toDateString();
    // this.log('CalendarComponent.onSelect() dateString:', dateString);
    // const dateValue = dateString.split(' ');
    // this.year = dateValue[3];
    // this.DayAndDate = dateValue[0] + ',' + ' ' + dateValue[1] + ' ' + dateValue[2];
  }
  monthSelected(event: any): void {
    this.log('CalendarComponent.monthSelected() event:', event);
  }

  public render(): void {
    this.calendar.updateTodaysDate();
  }

  // public myDateFilter(date: Moment): boolean {
  //   const day = date.day();
  //   // Prevent Saturday and Sunday from being selected.
  //   return day !== 0 && day !== 6 ;
  // }

  // public dateClass(date: Moment) {
  //   return (date.day() === 0 ? 'date-picker-holiday' : undefined);
  // }

}
