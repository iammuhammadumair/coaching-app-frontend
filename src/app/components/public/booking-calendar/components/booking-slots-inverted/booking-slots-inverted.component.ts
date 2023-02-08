import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CalendarService, amTimeslots, pmTimeslots } from 'src/app/calendar.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectedDateDialogComponent } from '../selected-date-dialog/selected-date-dialog.component';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-booking-slots-inverted',
  templateUrl: './booking-slots-inverted.component.html',
  styleUrls: ['./booking-slots-inverted.component.css']
})
export class BookingSlotsInvertedComponent implements OnInit {

  @Output() bookingCreated = new EventEmitter<any>();

  @Input() set selectedDate(_date: NgbDate) {
    if (_date) {
      this._selectedDate = _date;
      this.initDate();
    }
  }
  @Input() slots;
  @Input() coach;
  @Input() bookings;
  @Input() continent;
  @Input() sessionType;
  @Input() ClientFreeIntake;
  // changes
  _selectedDate;
  availableSlots;

  constructor(
    private calendar: CalendarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  initDate() {
    this.availableSlots = [
      ...cloneDeep(amTimeslots),
      ...cloneDeep(pmTimeslots),
    ];
    if (!this.slots) {
      return;
    }
    // slots
    if (this.slots) {
      for (const createdSlot of this.slots) {
        const jsdate = this.calendar.getJsDateFromTimestampDate(createdSlot.date);
        const jsdateKey = this.calendar.getDatekeyFromJsDate(jsdate);
        const selectedDatekey = this.calendar.getDatekeyFromNgbDate(this._selectedDate);
        if (jsdateKey !== selectedDatekey) {
          continue;
        }
        const bookingJstimekey = this.calendar.getTimekeyFromJsDate(jsdate);
        for (const avIndex of Object.keys(this.availableSlots)) {
          const avSlot = this.availableSlots[avIndex];

          const avjsdate = this.calendar.getJsDateFromNgbDateAndStaticSlot(
            this._selectedDate,
            avSlot
          );
          const jstimeKey = this.calendar.getTimekeyFromJsDate(avjsdate);
          if (jstimeKey === bookingJstimekey) {
            this.availableSlots.splice(avIndex, 1);
            break;
          }
        }
      }
    }
    // bookings
    if (this.bookings) {
      for (const booking of this.bookings) {
        const bookingJsdate = this.calendar.getJsDateFromTimestampDate(booking.date);
        const bookingJsdateKey = this.calendar.getDatekeyFromJsDate(bookingJsdate);
        const selectedDatekey = this.calendar.getDatekeyFromNgbDate(this._selectedDate);
        if (selectedDatekey !== bookingJsdateKey) {
          continue;
        }
        const bookingJstimekey = this.calendar.getTimekeyFromJsDate(bookingJsdate);
        for (const avIndex of Object.keys(this.availableSlots)) {
          const avSlot = this.availableSlots[avIndex];
          const jsdate = this.calendar.getJsDateFromNgbDateAndStaticSlot(
            this._selectedDate,
            avSlot
          );
          const jstimeKey = this.calendar.getTimekeyFromJsDate(jsdate);
          if (jstimeKey === bookingJstimekey) {
            this.availableSlots.splice(avIndex, 1);
            break;
          }
        }
        this.availableSlots.push({
          jsdate: bookingJsdate,
          booking: booking
        });
      }
    }
    this.availableSlots.sort((a, b) => {
      let dateA;
      if (a.booking) {
        dateA = a.jsdate;
      } else {
        dateA = this.calendar.getJsDateFromNgbDateAndStaticSlot(
          this._selectedDate,
          a
        );
      }
      let dateB;
      if (b.booking) {
        dateB = b.jsdate;
      } else {
        dateB = this.calendar.getJsDateFromNgbDateAndStaticSlot(
          this._selectedDate,
          b
        );
      }
      return dateA.getTime() - dateB.getTime();
    });
  }

  async slotSelected(index: number) {
    const avSlot = this.availableSlots[index];
    if (avSlot.booking) {
      return;
    }
    const jsdate = this.calendar.getJsDateFromNgbDateAndStaticSlot(
      this._selectedDate,
      this.availableSlots[index]
    );
    const selectedDialogRef = this.dialog.open(SelectedDateDialogComponent, {
      data: {
        time: {date: jsdate},
        date: this._selectedDate,
        coach: this.coach,
        sessionType: this.sessionType,
        ClientFreeIntake: this.ClientFreeIntake,
        continent:this.continent

      }
    });
    const res = await selectedDialogRef.afterClosed().toPromise();
    if (!res) {
      return;
    }
    this.bookingCreated.emit(true);
  }

  get displayDate() {
    return this._selectedDate ? new Date(
      this._selectedDate.year,
      this._selectedDate.month - 1,
      this._selectedDate.day
    ) : '';
  }

  isSlotSelected(slot) {
    return !!slot.booking;
  }

  isSlotPm(slot) {
    if (slot.booking) {
      return slot.jsdate && slot.jsdate.getHours() > 11;
    }
    return slot.hours > 11;
  }

  isSlotAm(slot) {
    if (slot.booking) {
      return slot.jsdate && slot.jsdate.getHours() < 12;
    }
    return slot.hours < 12;
  }
}
