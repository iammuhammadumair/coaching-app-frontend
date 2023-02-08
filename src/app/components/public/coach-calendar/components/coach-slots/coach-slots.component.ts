import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from 'src/app/models/AppUser';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { TimeSlot } from 'src/app/models/TimeSlot';
import { CalendarService, amTimeslots, pmTimeslots } from 'src/app/calendar.service';
import { Booking } from 'src/app/models/Booking';
import * as cloneDeep from 'lodash/cloneDeep';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-coach-slots',
  templateUrl: './coach-slots.component.html',
  styleUrls: ['./coach-slots.component.css']
})
export class CoachSlotsComponent implements OnInit {

  @Output() slotCreated = new EventEmitter<any>();
  @Output() slotDeleted = new EventEmitter<any>();
  @Output() bookingDeleted = new EventEmitter<any>();

  @Input() set selectedDate(_date: NgbDate) {
    // Set the slots for this date
    if (_date) {
      this._selectedDate = _date;
      this.initDate();
      this.initUsers();
    }
  }
  @Input() slots;
  @Input() coach;
  @Input() bookings;

  timezone;
  amTimeslots = amTimeslots;
  pmTimeslots = pmTimeslots;

  clients: {[key: string]: AppUser} = {};
  _selectedSlots = {};
  _circledSlots = {};
  _selectedDate: NgbDate;
  availableSlots;

  constructor(
    private afFirestore: AngularFirestore,
    public dialog: MatDialog,
    private calendar: CalendarService
  ) { }

  ngOnInit() {
    this.timezone = moment().tz(moment.tz.guess()).format('z');
  }

  get displayDate() {
    return this._selectedDate ? new Date(
      this._selectedDate.year,
      this._selectedDate.month - 1,
      this._selectedDate.day
    ) : '';
  }

  initDate() {
    this.availableSlots = [];
    this.bookings = this.bookings || [];
    if (!this.slots) {
      return;
    }

    // existing slots
    this.slots.forEach(slot => {
      const jsdate = this.calendar.getJsDateFromTimestampDate(slot.date);
      const jsdateKey = this.calendar.getDatekeyFromJsDate(jsdate);
      const selectedDatekey = this.calendar.getDatekeyFromNgbDate(this._selectedDate);
      if (jsdateKey === selectedDatekey) {
        this.availableSlots.push({date: jsdate, slot: slot});
      }
    });

    // bookings
    for (const booking of this.bookings) {
      const bookingJsdate = this.calendar.getJsDateFromTimestampDate(booking.date);
      const bookingJsdateKey = this.calendar.getDatekeyFromJsDate(bookingJsdate);
      const selectedDatekey = this.calendar.getDatekeyFromNgbDate(this._selectedDate);

      if (selectedDatekey !== bookingJsdateKey) {
        continue;
      }

      let slotFound = false;
      const bookingJstimekey = this.calendar.getTimekeyFromJsDate(bookingJsdate);
      for (const slot of this.availableSlots) {
        const jstimeKey = this.calendar.getTimekeyFromJsDate(slot.date);

        if (jstimeKey === bookingJstimekey) {
          slotFound = true;
          slot.booking = booking;
          break;
        }
      }

      if (!slotFound) {
        this.availableSlots.push({date: bookingJsdate, booking: booking});
      }
    }

    // static slots
    const staticSlots = [...cloneDeep(amTimeslots), ...cloneDeep(pmTimeslots)];
    staticSlots.forEach(slot => {
      const date = this.calendar.getJsDateFromNgbDate(this._selectedDate);
      date.setHours(slot.hours);
      date.setMinutes(slot.minutes);

      const found = this.availableSlots.some(avSlot => {
        return date.getHours() === avSlot.date.getHours() &&
               date.getMinutes() === avSlot.date.getMinutes();
      });
      if (!found) {
        this.availableSlots.push({date: date});
      }
    });

    this.availableSlots.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });
  }

  initUsers() {
    this.bookings = this.bookings || [];
    for (const booking of this.bookings) {
      if (booking.client) {
        this.getSlotUser(booking.client);
      }
    }
  }

  async getSlotUser(clientId) {
    if (this.clients[clientId]) {
      return;
    }
    const res = await this.afFirestore.doc<AppUser>(
      `users/${clientId}`
    ).get().toPromise();

    this.clients[clientId] = {
      uid: clientId,
      displayName: res.data().displayName,
      email: res.data().email
    };
  }

  slotClicked(index) {
    const slot = this.availableSlots[index];
    if (slot.booking) {
      if (!this.canCancelSlot(slot)) {
        return;
      }
      this.dialog.open(ConfirmDialogComponent, {
        data: {title: 'Are you sure you want to cancel this booking?'}
      }).afterClosed().subscribe(res => {
        if (res) {
          this.deleteBooking(index);
        }
      });
    } else if (slot.slot) {
      this.deleteSession(index);
    } else {
      this.createSession(index);
    }
  }

  async createSession(index: number) {
    const date = this.availableSlots[index].date;
    const doc = await this.afFirestore.collection<TimeSlot>('timeSlots').add({
      date: date,
      coach: this.coach.id
    });
    if (doc && doc.id) {
      this.availableSlots[index].slot = {jsdate: date, id: doc.id};
      this.slotCreated.emit(doc);
    }
  }

  async deleteSession(index: number) {
    const id = this.availableSlots[index].slot.id;
    if (!id) {
      return;
    }
    await this.afFirestore.collection<TimeSlot>('timeSlots').doc(id).delete().then(() => {
      this.availableSlots[index].slot = null;
      this.slotDeleted.emit(id);
    }).catch(e => {
      throw e;
    });
  }

  async deleteBooking(index) {
    this.afFirestore.collection<Booking>('bookings').doc(
      this.availableSlots[index].booking.id
    ).delete().then(() => {
      const id = this.availableSlots[index].booking.id;
      delete this.availableSlots[index].booking;
      if (!this.availableSlots[index].slot) {
        this.availableSlots.splice(index, 1);
        this.availableSlots = [...this.availableSlots];
      }
      this.bookingDeleted.emit(id);
    }).catch(() => {});
  }

  isSlotCircled(slot) {
    return !!slot.slot;
  }

  isSlotSelected(slot) {
    return !!slot.booking;
  }

  isSlotPm(slot) {
    return slot && slot.date && slot.date.getHours() > 11;
  }

  isSlotAm(slot) {
    return !this.isSlotPm(slot);
  }

  getClientName(slot) {
    if (slot.booking && this.clients[slot.booking.client]) {
      return this.clients[slot.booking.client].displayName;
    }
    return '';
  }

  canCancelSlot(slot) {
    const today = new Date();
    let slotDate = null;
    if (slot.jsdate && slot.jsdate.getTime) {
      slotDate = slot.jsdate;
    } else if (slot.date && slot.date.getTime) {
      slotDate = slot.date;
    } else {
      return false;
    }
    const oneDay = 1 * 24 * 60 * 60 * 1000;
    return (today.getTime() + oneDay) < slotDate.getTime();
  }
}
