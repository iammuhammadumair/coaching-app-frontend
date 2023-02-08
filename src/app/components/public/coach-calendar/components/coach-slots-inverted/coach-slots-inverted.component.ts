import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from 'src/app/models/AppUser';
import * as cloneDeep from 'lodash/cloneDeep';
import { CalendarService, amTimeslots, pmTimeslots } from 'src/app/calendar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { TimeSlot } from 'src/app/models/TimeSlot';
import { Booking } from 'src/app/models/Booking';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-coach-slots-inverted',
  templateUrl: './coach-slots-inverted.component.html',
  styleUrls: ['./coach-slots-inverted.component.css']
})
export class CoachSlotsInvertedComponent implements OnInit {

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
  clients: {[key: string]: AppUser} = {};
  _selectedSlots;
  _circledSlots;
  _selectedDate;
  availableSlots;
  staticSlots;

  constructor(
    private afFirestore: AngularFirestore,
    private calendar: CalendarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.timezone = moment().tz(moment.tz.guess()).format('z');
  }

  initDate() {
    this.availableSlots = [
      ...cloneDeep(amTimeslots),
      ...cloneDeep(pmTimeslots)
    ];
    if (!this.slots) {
      return;
    }
    // slots
    for (const createdSlot of this.slots) {
      const jsdate = this.calendar.getJsDateFromTimestampDate(createdSlot.date);
      const jsdateKey = this.calendar.getDatekeyFromJsDate(jsdate);
      const selectedDatekey = this.calendar.getDatekeyFromNgbDate(this._selectedDate);
      if (jsdateKey !== selectedDatekey) {
        continue;
      }
      let found = false;
      for (const avSlot of this.availableSlots) {
        const avJsdate = this.calendar.getJsDateFromNgbDateAndStaticSlot(
          this._selectedDate,
          avSlot
        );
        const avTimekey = this.calendar.getTimekeyFromJsDate(avJsdate);
        const createdTimekey = this.calendar.getTimekeyFromJsDate(jsdate);
        if (avTimekey === createdTimekey) {
          found = true;
          avSlot.slot = createdSlot;
          break;
        }
      }
      if (!found) {
        this.availableSlots.push({ date: jsdate, slot: createdSlot });
      }
    }
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
      for (const avSlot of this.availableSlots) {
        const avJsdate = this.calendar.getJsDateFromNgbDateAndStaticSlot(
          this._selectedDate,
          avSlot
        );
        const jstimeKey = this.calendar.getTimekeyFromJsDate(avJsdate);
        if (jstimeKey === bookingJstimekey) {
          slotFound = true;
          avSlot.booking = booking;
          break;
        }
      }

      if (!slotFound) {
        this.availableSlots.push({
          date: bookingJsdate,
          booking: booking,
          hours: bookingJsdate.getHours(),
          minutes: bookingJsdate.getMinutes(),
          starts: moment(bookingJsdate).format('HH:mm')
        });
      }
    }
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
    const jsdate = this.calendar.getJsDateFromNgbDateAndStaticSlot(
      this._selectedDate,
      this.availableSlots[index]
    );
    const doc = await this.afFirestore.collection<TimeSlot>('timeSlots').add({
      date: jsdate,
      coach: this.coach.id
    });
    if (doc && doc.id) {
      this.availableSlots[index].slot = {jsdate: jsdate, id: doc.id};
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

  get displayDate() {
    return this._selectedDate ? new Date(
      this._selectedDate.year,
      this._selectedDate.month - 1,
      this._selectedDate.day
    ) : '';
  }

  getClientName(slot) {
    if (slot.booking && this.clients[slot.booking.client]) {
      return this.clients[slot.booking.client].displayName;
    }
    return '';
  }

  isSlotCircled(slot) {
    return !slot.slot;
  }

  isSlotSelected(slot) {
    return !!slot.booking;
  }

  isSlotPm(slot) {
    return slot.hours > 11;
  }

  isSlotAm(slot) {
    return slot.hours < 12;
  }

  canCancelSlot(slot) {
    const today = new Date();
    let slotDate = null;
    if (slot.jsdate && slot.jsdate.getTime) {
      slotDate = slot.jsdate;
    } else if (slot.date && slot.date.getTime) {
      slotDate = slot.date;
    } else if (slot.booking && slot.booking.date) {
      slotDate = this.calendar.getJsDateFromTimestampDate(slot.booking.date);
    } else {
      return false;
    }
    const oneDay = 1 * 24 * 60 * 60 * 1000;
    return (today.getTime() + oneDay) < slotDate.getTime();
  }
}
