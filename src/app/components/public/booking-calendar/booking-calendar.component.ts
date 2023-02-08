import { Component, OnInit, OnDestroy, Inject, Input, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Coach } from 'src/app/models/Coach';
import { TimeSlot } from 'src/app/models/TimeSlot';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TimeSlotsService } from 'src/app/services/time-slots.service';
import { AppUser } from 'src/app/models/AppUser';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BookingCalendarDialogComponent } from './components/booking-calendar-dialog/booking-calendar-dialog.component';
import { ScheduleSuccessDialogComponent } from './components/schedule-success-dialog/schedule-success-dialog.component';
import { Router } from '@angular/router';
import { Booking } from 'src/app/models/Booking';
import { BookingsService } from 'src/app/services/bookings.service';
import { DateSlot } from '../coach-calendar/coach-calendar.component';
import { CalendarService, amTimeslots, pmTimeslots } from 'src/app/calendar.service';
import {ScheduleFreeIntakeDialogComponent} from "./components/schedule-free-intake-dialog/schedule-free-intake-dialog.component";
@Component({
  selector: 'app-booking-calendar',
  templateUrl: './booking-calendar.component.html',
  styleUrls: ['./booking-calendar.component.css']
})
export class BookingCalendarComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() inputData;
  coach: Coach;
  ClientData: any;
  timeSlots: TimeSlot[];
  user;
  bookings: Booking[];
  subscriptions: Subscription[] = [];
  selectAvailableDates = true;
  selectedDate: NgbDate;

  bookableDates: {[key: string]: DateSlot} = {};
  bookableDateTimes: {[key: string]: DateSlot} = {};
  bookedDates: {[key: string]: DateSlot} = {};
  bookedDateTimes: {[key: string]: DateSlot} = {};
  unbookableDates: {[key: string]: any} = {};
  unbookableDateTimes: {[key: string]: DateSlot} = {};
  currentBookableSlots: TimeSlot[] = [];

  amTimeslots = amTimeslots;
  pmTimeslots = pmTimeslots;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private timeSlotsService: TimeSlotsService,
    private dialogRef: MatDialogRef<BookingCalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {coach: Coach, FreeIntake: any},
    private bookingService: BookingsService,
    public dialog: MatDialog,
    private calendar: CalendarService) {
    this.coach = data.coach;
    this.ClientData = data.FreeIntake;
    }

  ngOnInit() {
    if (this.coach) {
      this.initData();
    }
  }

  ngAfterViewInit() {
  }

  async initData() {
    this.user = await this.getUser();
    if (this.coach) {
      this.timeSlots = await this.timeSlotsService.getFutureTimeSlots(this.coach);
      this.bookings = await this.bookingService.getFutureBookingsByCoach(this.coach);
    }
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

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  showDate(date: NgbDate) {
    this.selectedDate = date;
  }

  currentDatetimesInverted() {
    const datekey = this.calendar.getDatekeyFromNgbDate(this.selectedDate);

    // Set booking slots the selected date
    const bookableDateTimes = [];
    for (const key in this.bookableDateTimes) {
      if (key.startsWith(datekey)) {
        bookableDateTimes.push(this.bookableDateTimes[key]);
      }
    }
    this.currentBookableSlots = bookableDateTimes.sort((slot1, slot2) => {
      if (slot1.jsdate.getTime() > slot2.jsdate.getTime()) {
          return 1;
      }
      if (slot1.jsdate.getTime() < slot2.jsdate.getTime()) {
          return -1;
      }
      return 0;
    });
  }

  getDateSlot(date: Date) {
    const hours: any = date.getHours();
    const minutes: any = date.getMinutes();
    let slot = this.amTimeslots.find(s => s.hours === hours && s.minutes === minutes);
    if (!slot) {
      slot = this.pmTimeslots.find(s => s.hours === hours && s.minutes === minutes);
    }
    return slot;
  }

  close() {
    this.dialogRef.close();
  }

  async bookingCreated(res) {
       if (res.sessionType === "free" && !this.user) {
      this.showFreeIntakeSuccessDialog();
    }
    this.showSuccessDialog();
    await this.initData();
    setTimeout(() => {
      this.selectedDate = new NgbDate(
        this.selectedDate.year,
        this.selectedDate.month,
        this.selectedDate.day
      );
    });
  }

  async showSuccessDialog() {
    let width = '90%';
    if (window.innerWidth > 1200) {
      width = '40%';
    } else if (window.innerWidth > 800) {
      width = '60%';
    }
    const successDialogRef = this.dialog.open(ScheduleSuccessDialogComponent, {
      width: width,
      disableClose: true,
      data: {
        coach: this.coach
      }
    });
    const success = await successDialogRef.afterClosed().toPromise();
    if (success) {
      this.dialogRef.close(true);
      this.router.navigate(['/client-calendar']);
    }
  }
      async showFreeIntakeSuccessDialog() {
    let width = "90%";
    if (window.innerWidth > 1200) {
      width = "40%";
    } else if (window.innerWidth > 800) {
      width = "60%";
    }
    const successDialogRef = this.dialog.open(
      ScheduleFreeIntakeDialogComponent,
      {
        width: width,
        disableClose: true,
        data: {
          coach: this.coach,
        },
      }
    );
    const success = await successDialogRef.afterClosed().toPromise();
    if (success) {
      this.dialogRef.close(true);
      this.router.navigate(["/signup"]);
    }
  }
}
