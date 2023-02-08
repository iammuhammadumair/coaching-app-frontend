import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { CalendarService } from 'src/app/calendar.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { SelectedDateDialogComponent } from '../selected-date-dialog/selected-date-dialog.component';

@Component({
  selector: 'app-booking-slots',
  templateUrl: './booking-slots.component.html',
  styleUrls: ['./booking-slots.component.css']
})
export class BookingSlotsComponent implements OnInit {

  @Output() bookingCreated = new EventEmitter<any>();
  @Input() coach;
  @Input() slots;
  @Input() continent;
  @Input() bookings;
  @Input() sessionType;
  @Input() FreeIntakeData;
  @Input() set selectedDate(_date: NgbDate) {
    if (_date) {
      this._selectedDate = _date;
      this.initDate();
    }
  }
  _selectedDate: NgbDate;
  bookableSlots: any = {};
  bookedDateTimes: any = {};
  availableSlots: any = [];

  constructor(
    private calendar: CalendarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  initDate() {
    this.availableSlots = [];
    if (this.slots) {
      for (const slot of this.slots) {
        const jsdate = this.calendar.getJsDateFromTimestampDate(slot.date);
        const datekey = this.calendar.getDatekeyFromJsDate(jsdate);
        const selectedDatekey = this.calendar.getDatekeyFromNgbDate(this._selectedDate);

        if (selectedDatekey === datekey) {
          this.availableSlots.push({
            date: jsdate,
            slot: slot
          });
        }
      }
    } else {
      this.bookableSlots = {};
    }
    if (this.bookings) {
      for (const booking of this.bookings) {
        const jsdate = this.calendar.getJsDateFromTimestampDate(booking.date);
        const datekey = this.calendar.getDatekeyFromJsDate(jsdate);
        const selectedDatekey = this.calendar.getDatekeyFromNgbDate(this._selectedDate);
        if (selectedDatekey !== datekey) {
          continue;
        }

        const bookingTimekey = this.calendar.getTimekeyFromJsDate(jsdate);
        let found = false;
        for (const avSlot of this.availableSlots) {
          const avTimekey = this.calendar.getTimekeyFromJsDate(avSlot.date);
          if (avTimekey === bookingTimekey) {
            found = true;
            avSlot.booking = booking;
            break;
          }
        }
        if (!found) {
          this.availableSlots.push({
            date: jsdate,
            booking: booking
          });
        }
      }
    } else {
      this.bookedDateTimes = {};
    }
    this.availableSlots.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });
  }

  get displayDate() {
    return  this._selectedDate ? new Date(
      this._selectedDate.year, this._selectedDate.month - 1, this._selectedDate.day
    ) : '';
  }

  async slotSelected(index: number) {
    const avSlot = this.availableSlots[index];
    if (avSlot.booking) {
      return;
    }
    const selectedDialogRef = this.dialog.open(SelectedDateDialogComponent, {
      data: {
        time: this.availableSlots[index],
        date: this._selectedDate,
        timeSlot: this.availableSlots[index].slot.id,
        coach: this.coach,
        sessionType: this.sessionType,
         ClientFreeIntake: this.FreeIntakeData,
        continent:this.continent
      }
    });
    const res = await selectedDialogRef.afterClosed().toPromise();
    if (!res) {
      return;
    }
    this.bookingCreated.emit(res);
   // this.bookingCreated.emit(true);
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
}
