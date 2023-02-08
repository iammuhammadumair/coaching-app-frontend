import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalendarService } from 'src/app/calendar.service';

@Component({
  selector: 'app-client-datepicker',
  templateUrl: './client-datepicker.component.html',
  styleUrls: ['./client-datepicker.component.css']
})
export class ClientDatepickerComponent implements OnInit {

  @Output() selectedDateOutput = new EventEmitter<any>();
  @Input() showDisabledDates: boolean;
  @Input() circledDates: {[key: string]: {
    jsdate: Date,
    timeSlotId?: string;
  }};
  @Input() selectedDates: {[key: string]: {
    jsdate: Date,
    timeSlotId?: string;
  }};

  hoveredDate: NgbDate;
  selectedDate: NgbDate;
  displayMonths = 1;

  constructor(private calendar: CalendarService) { }

  ngOnInit() {
    setTimeout(() => {
      if (window.innerWidth > 1200) {
        this.displayMonths = 2;
      }
    });
  }

  get displayDate() {
    return  new Date(
      this.selectedDate.year,
      this.selectedDate.month - 1,
      this.selectedDate.day
    );
  }

  showDate(date: NgbDate) {
    this.selectedDate = date;
    this.selectedDateOutput.emit(date);
  }

  isCircled(date: NgbDate) {
    const datekey = this.getDatekey(date);
    return !!this.circledDates && this.circledDates[datekey];
  }

  isSelected(date: NgbDate) {
    const datekey = this.getDatekey(date);
    return !!this.selectedDates && this.selectedDates[datekey];
  }

  isPast(date: NgbDate) {
    const jsdate = this.calendar.getJsDateFromNgbDate(date);
    const now = new Date();
    const hourAndQuarter = 1 * 60 * 60 * 1000 + 15 * 60 * 1000;
    return now.getTime() > (jsdate.getTime() + hourAndQuarter);
  }

  isShowing(date: NgbDate) {
    return this.selectedDate && this.selectedDate.equals(date);
  }

  isHovered(date: NgbDate) {
    return this.hoveredDate && this.hoveredDate.equals(date);
  }

  isDisabled(date) {
    return this.showDisabledDates && !this.isCircled(date) && !this.isSelected(date);
  }

  getDatekey(date: NgbDate) {
    return '' + date.year +
           (date.month.toString().length === 1 ? '0' + date.month : date.month) +
           (date.day.toString().length === 1 ? '0' + date.day : date.day);
  }
}
