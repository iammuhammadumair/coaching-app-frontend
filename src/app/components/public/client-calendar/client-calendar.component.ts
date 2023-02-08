import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from 'src/app/models/AppUser';
import { Booking } from 'src/app/models/Booking';
import { BookingsService } from 'src/app/services/bookings.service';
import { ConfirmDeleteDialogComponent } from './components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';
import { Coach } from 'src/app/models/Coach';
import { CalendarService } from 'src/app/calendar.service';
import { ClientDatepickerComponent } from './components/client-datepicker/client-datepicker.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-calendar',
  templateUrl: './client-calendar.component.html',
  styleUrls: ['./client-calendar.component.css']
})
export class ClientCalendarComponent implements OnInit, OnDestroy {

  @ViewChild('calendar') calendar: ClientDatepickerComponent;

  user: AppUser;
  bookings: Booking[] = [];
   bookingswithEmailOnly: Booking[] = [];
  subscriptions: Subscription[] = [];
  selectAvailableDates = true;
  selectedDate: NgbDate;
  coach: Coach;
  currentBookedSlots = [];
  loading = false;

  bookedDates: {[key: string]: {
    jsdate: Date,
    timeSlotId?: string;
  }} = {};
  bookedDateTimes: {[key: string]: {
    jsdate: Date,
    timeSlotId?: string;
    coach?: Coach,
    booking?: Booking
  }} = {};
  coaches: any = {};

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private afFirestore: AngularFirestore,
    private bookingsService: BookingsService,
    private coachService: CoachFinderFirestoreService,
    private calendarService: CalendarService
  ) {
  }

  ngOnInit() {
    this.initData();
  }

  async initData() {
    this.user = await this.getUser();
    this.bookings = await this.getBookings();
    this.bookingswithEmailOnly =   await this.getBookingswithEmail();
    this.initBookings();
  }

  getUser(): Promise<AppUser> {
    return new Promise(resolve => {
      this.subscriptions.push(
        this.authenticationService.user.subscribe((res) => {
          resolve(res);
        }
      ));
    });
  }

  getBookings(): Promise<Booking[]> {
    return new Promise(async resolve => {
      if (this.user) {
        const bookings = await this.bookingsService.getBookingsByClient(this.user);
        resolve(bookings);
      } else {
        resolve([]);
      }
    });
  }

getBookingswithEmail(): Promise<Booking[]> {
    return new Promise(async resolve => {
      if (this.user) {
        const bookings = await this.bookingsService.getBookingsByClientWithEmail(this.user);
        resolve(bookings);
      } else {
        resolve([]);
      }
    });
  }

  initBookings() {
    for (const booking of this.bookings) {
      const jsdate = this.calendarService.getJsDateFromTimestampDate(booking.date);
      const ngbDate: NgbDate = this.calendarService.getNgbdateFromSessionDate(booking.date);

      // Set the dates selected
      const resetHoursDate = new Date(booking.date);
      resetHoursDate.setHours(0, 0, 0);
      this.bookedDates[this.calendarService.getDatekeyFromNgbDate(ngbDate)] = {
        jsdate: resetHoursDate,
        timeSlotId: booking.id
      };

      // Set the timeframes selected
      const datetimekey = this.calendarService.getDatetimekeyWithJsDate(ngbDate, jsdate);
      this.bookedDateTimes[datetimekey] = {
        jsdate: jsdate,
        timeSlotId: booking.id,
        coach: null,
        booking: booking
      };
    }
     for (const booking of this.bookingswithEmailOnly) {
      const jsdate = this.calendarService.getJsDateFromTimestampDate(booking.date);
      const ngbDate: NgbDate = this.calendarService.getNgbdateFromSessionDate(booking.date);

      // Set the dates selected
      const resetHoursDate = new Date(booking.date);
      resetHoursDate.setHours(0, 0, 0);
      this.bookedDates[this.calendarService.getDatekeyFromNgbDate(ngbDate)] = {
        jsdate: resetHoursDate,
        timeSlotId: booking.id
      };

      // Set the timeframes selected
      const datetimekey = this.calendarService.getDatetimekeyWithJsDate(ngbDate, jsdate);
      this.bookedDateTimes[datetimekey] = {
        jsdate: jsdate,
        timeSlotId: booking.id,
        coach: null,
        booking: booking
      };
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async toggleDatetime(slot) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);
    const dialogResult = await dialogRef.afterClosed().toPromise();
    if (dialogResult) {
      // select date
      this.onDateSelection(this.selectedDate);

      // Delete the session
      const key = this.calendarService.getDatetimekeyWithJsDate(this.selectedDate, slot.jsdate);
      this.deleteSession(this.bookedDateTimes[key].timeSlotId, key);
    }
  }

  deleteSession(id: string, key: string) {
    if (!id) {
      return;
    }
    this.afFirestore.collection<Booking>(
      'bookings'
    ).doc(id).delete().then(() => {
      // Check if there are more timeframes on this date
      delete this.bookedDateTimes[key];
      // Update the slots
      this.showDate(this.selectedDate);
      // Unselect the date as well
      if (!this.currentBookedSlots.length) {
        const datekey = key.substr(0, key.length - 4);
        delete this.bookedDates[datekey];
      }
    }).catch(error => {
      throw error;
    });
  }

  onDateSelection(date: NgbDate) {
    const datekey = this.calendarService.getDatekeyFromNgbDate(date);
    this.bookedDates[datekey] = {
      jsdate: new Date(date.year, date.month, date.day)
    };
  }

  async showDate(date: NgbDate) {
    const bookedDateTimes = [];
    this.selectedDate = date;
    this.loading = true;

    // Set booking slots the selected date
    const datekey = this.calendarService.getDatekeyFromNgbDate(date);
    for (const key in this.bookedDateTimes) {
      if (key.startsWith(datekey)) {
        if (!this.bookedDateTimes[key].coach) {
          let coach = this.coaches[this.bookedDateTimes[key].booking.coach];
          if (!coach) {
            coach = await this.coachService.getCoachPromiseFromId(
              this.bookedDateTimes[key].booking.coach
            );
            this.coaches[this.bookedDateTimes[key].booking.coach] = coach;
          }
          this.bookedDateTimes[key].coach = coach;
        }
        bookedDateTimes.push(this.bookedDateTimes[key]);
      }
    }
    this.currentBookedSlots = bookedDateTimes.sort((slot1, slot2) => {
      if (slot1.jsdate.getTime() > slot2.jsdate.getTime()) {
          return 1;
      }
      if (slot1.jsdate.getTime() < slot2.jsdate.getTime()) {
          return -1;
      }
      return 0;
    });
    this.loading = false;
  }
}
