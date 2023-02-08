import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalendarService } from 'src/app/calendar.service';

export interface DateSlot {
  jsdate: Date;
  timeSlotId?: string;
}

@Component({
  selector: 'app-booking-datepicker',
  templateUrl: './booking-datepicker.component.html',
  styleUrls: ['./booking-datepicker.component.css']
})
export class BookingDatepickerComponent implements OnInit {

  @Output() selectedDateOutput = new EventEmitter<any>();
  @Input() showDisabledDates: boolean;
   @Input() ClientFreeIntake;

  @Input() set slots(slots) {
    if (slots && slots.length) {
      this.initSlots(slots);
    } else {
      this.circledDates = {};
    }
  }
  @Input() set bookings(bookings) {
    if (bookings && bookings.length) {
      this.selectedDates = this.calendar.getCalendarBookings(bookings);
    } else {
      this.selectedDates = {};
    }
  }

  hoveredDate: NgbDate;
  selectedDate: NgbDate;
  displayMonths = 1;
  circledDates: {[key: string]: DateSlot};
  selectedDates: {[key: string]: DateSlot};

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

  initSlots(slots) {
    for (const timeSlot of slots) {
      const jsdate = this.calendar.getJsDateFromTimestampDate(timeSlot.date);
      const ngbDate: NgbDate = this.calendar.getNgbdateFromSessionDate(timeSlot.date);
      // Set the dates selected
      const resetHoursDate = new Date(jsdate);
      resetHoursDate.setHours(0, 0, 0);
      this.circledDates[this.calendar.getDatekeyFromNgbDate(ngbDate)] = {
        jsdate: resetHoursDate,
        timeSlotId: timeSlot.id
      };
    }
  }

  showDate(date: NgbDate) {
    this.selectedDate = date;
    this.selectedDateOutput.emit(date);
  }

  isCircled(date: NgbDate) {
    const datekey = this.calendar.getDatekeyFromNgbDate(date);
    return !!this.circledDates && this.circledDates[datekey];
  }

  isSelected(date: NgbDate) {
    const datekey = this.calendar.getDatekeyFromNgbDate(date);
    return !!this.selectedDates && this.selectedDates[datekey];
  }

  isShowing(date: NgbDate) {
    return this.selectedDate && this.selectedDate.equals(date);
  }

  isHovered(date: NgbDate) {
    return this.hoveredDate && this.hoveredDate.equals(date);
  }

  isDisabled(date) {
    return !this.isCircled(date) && !this.isSelected(date);
  }
}
