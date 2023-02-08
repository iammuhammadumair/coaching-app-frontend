import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DateSlot } from '../../coach-calendar.component';
import { CalendarService } from 'src/app/calendar.service';

@Component({
  selector: 'app-coach-datepicker',
  templateUrl: './coach-datepicker.component.html',
  styleUrls: ['./coach-datepicker.component.css']
})
export class CoachDatepickerComponent implements OnInit {

  @Output() selectedDateOutput = new EventEmitter<any>();
  @Input() set slots(slots) {
    if (slots && slots.length) {
      this.initSlots(slots);
    } else {
      this.circledDates = {};
    }
  }
  @Input() set bookings(bookings) {
    if (bookings && bookings.length) {
      this.selectedDates = this.calendarService.getCalendarBookings(bookings);
    } else {
      this.selectedDates = {};
    }
  }
  circledDates: {[key: string]: DateSlot} = {};
  selectedDates: {[key: string]: DateSlot};

  hoveredDate: NgbDate;
  selectedDate: NgbDate;
  displayMonths = 1;

  constructor(
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      if (window.innerWidth > 1200) {
        this.displayMonths = 2;
      }
    });
  }

  initSlots(slots) {
    this.circledDates = {};
    for (const timeslot of slots) {
      const jsdate = this.calendarService.getJsDateFromTimestampDate(timeslot.date);
      const ngbDate: NgbDate = this.calendarService.getNgbdateFromSessionDate(timeslot.date);

      // Set the dates selected
      const jsdateStart = new Date(jsdate);
      jsdateStart.setHours(0, 0, 0);
      this.circledDates[this.calendarService.getDatekeyFromNgbDate(ngbDate)] = {
        jsdate: jsdateStart,
        timeSlotId: timeslot.id
      };
    }
  }

  showDate(date: NgbDate) {
    this.selectedDate = date;
    this.selectedDateOutput.emit(date);
  }

  isCircled(date: NgbDate) {
    const datekey = this.calendarService.getDatekeyFromNgbDate(date);
    return !!this.circledDates && this.circledDates[datekey];
  }

  isSelected(date: NgbDate) {
    const datekey = this.calendarService.getDatekeyFromNgbDate(date);
    return !!this.selectedDates && this.selectedDates[datekey];
  }

  isShowing(date: NgbDate) {
    return this.selectedDate && this.selectedDate.equals(date);
  }

  isHovered(date: NgbDate) {
    return this.hoveredDate && this.hoveredDate.equals(date);
  }
}
