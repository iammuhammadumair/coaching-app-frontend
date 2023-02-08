import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DateSlot } from '../../coach-calendar.component';
import { CalendarService } from 'src/app/calendar.service';

@Component({
  selector: 'app-coach-datepicker-inverted',
  templateUrl: './coach-datepicker-inverted.component.html',
  styleUrls: ['./coach-datepicker-inverted.component.css']
})
export class CoachDatepickerInvertedComponent implements OnInit {

  @Output() selectedDateOutput = new EventEmitter<any>();
  @Input() showDisabledDates: boolean;
  @Input() set slots(slots) {
    if (slots && slots.length) {
      this.initSlots(slots);
    } else {
      this.slotsByDateMap = {};
    }
  }
  @Input() set bookings(bookings) {
    if (bookings && bookings.length) {
      this.selectedDates = this.calendarService.getCalendarBookings(bookings);
    } else {
      this.selectedDates = {};
    }
  }

  selectedDates: {[key: string]: DateSlot} = {};
  invalidDates: {[key: string]: boolean} = {};
  hoveredDate: NgbDate;
  selectedDate: NgbDate;
  displayMonths = 1;
  slotsByDateMap: any = {};

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
    // Group the dates by date only
    this.slotsByDateMap = {};
    for (const slot of slots) {
      const jsdate = this.calendarService.getJsDateFromTimestampDate(slot.date);
      const key = this.calendarService.getDatekeyFromJsDate(jsdate);
      if (!this.slotsByDateMap[key]) {
        this.slotsByDateMap[key] = {};
      }
      const slotKey = this.calendarService.getTimekeyFromJsDate(jsdate);
      this.slotsByDateMap[key][slotKey] = true;
    }
  }

  showDate(date: NgbDate) {
    this.selectedDate = date;
    this.selectedDateOutput.emit(date);
  }

  isInvalid(date) {
    const datekey = this.calendarService.getDatekeyFromNgbDate(date);
    return this.slotsByDateMap[datekey] &&
           this.slotsByDateMap[datekey]['0800'] &&
           this.slotsByDateMap[datekey]['0915'] &&
           this.slotsByDateMap[datekey]['1030'] &&
           this.slotsByDateMap[datekey]['1145'] &&
           this.slotsByDateMap[datekey]['1300'] &&
           this.slotsByDateMap[datekey]['1415'] &&
           this.slotsByDateMap[datekey]['1530'] &&
           this.slotsByDateMap[datekey]['1645'] &&
           this.slotsByDateMap[datekey]['1800'] &&
           this.slotsByDateMap[datekey]['1915'] &&
           this.slotsByDateMap[datekey]['2030'];
  }

  isCircled(date) {
    return !this.isInvalid(date);
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
