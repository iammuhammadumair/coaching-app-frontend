import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Coach } from 'src/app/models/Coach';
import { TimeSlot } from 'src/app/models/TimeSlot';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TimeSlotsService } from 'src/app/services/time-slots.service';
import { AppUser } from 'src/app/models/AppUser';
import { CoachCalendarDialogComponent } from './components/coach-calendar-dialog/coach-calendar-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BookingsService } from 'src/app/services/bookings.service';
import { Booking } from 'src/app/models/Booking';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';


export interface DateSlot {
  jsdate: Date;
  timeSlotId?: string;
  booking?: Booking;
}
@Component({
  selector: 'app-coach-calendar',
  templateUrl: './coach-calendar.component.html',
  styleUrls: ['./coach-calendar.component.css']
})
export class CoachCalendarComponent implements OnInit, OnDestroy {

  coach: Coach;
  timeSlots: TimeSlot[];
  user;
  subscriptions: Subscription[] = [];
  selectAvailableDates = true;
  selectedDate: NgbDate;
  bookings: Booking[];

  bookableDates: {[key: string]: DateSlot} = {};
  bookableDateTimes: {[key: string]: DateSlot} = {};
  bookedDates: {[key: string]: DateSlot} = {};
  bookedDateTimes: {[key: string]: DateSlot} = {};
  unbookableDates: {[key: string]: any} = {};
  unbookableDateTimes: {[key: string]: DateSlot} = {};

  constructor(
    private authenticationService: AuthenticationService,
    private afFirestore: AngularFirestore,
    private timeSlotsService: TimeSlotsService,
    private bookingService: BookingsService,
    private dialogRef: MatDialogRef<CoachCalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {coach: Coach},
    public dialog: MatDialog
  ) {
    this.coach = data.coach;
  }

  ngOnInit() {
    if (this.coach) {
      this.initData();
    }
  }

  async initData() {
    this.user = await this.getUser();
    if (this.coach) {
      this.timeSlots = await this.timeSlotsService.getTimeSlots(this.coach);
      this.bookings = await this.bookingService.getBookingsByCoach(this.coach);
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

  async slotCreated(docRef: DocumentReference) {
    const doc = await docRef.get();

    const slot = doc.data() as TimeSlot;
    slot.id = docRef.id;
    this.timeSlots = [...this.timeSlots, slot];
  }

  slotDeleted(id) {
    for (const index in this.timeSlots) {
      if (this.timeSlots[index].id === id) {
        this.timeSlots.splice(Number(index), 1);
        break;
      }
    }
    this.timeSlots = [...this.timeSlots];
  }

  bookingDeleted(id: string) {
    for (const index in this.bookings) {
      if (this.bookings[index].id === id) {
        this.bookings.splice(Number(index), 1);
        break;
      }
    }
    this.bookings = [...this.bookings];
  }

  showDate(date: NgbDate) {
    this.selectedDate = date;
  }

  close() {
    this.dialogRef.close();
  }

  setTimeSlotsInverted(value: boolean) {
    this.afFirestore.doc(
      `coaches/${this.coach.id}`
    ).update({timeSlotsInverted: value}).then(() => {
      this.coach.timeSlotsInverted = value;
      this.selectedDate = null;

      let title = 'Your calendar is updated, clients can schedule on selected time frames.';
      if (value) {
        title = 'Your calendar is updated, selected time frames cannot be scheduled by clients.';
      }

      this.dialog.open(AlertDialogComponent, {
        data: {
          title: title,
          closeText: 'OK'
        }
      });

      this.initData();
    }).catch(e => {
      throw e;
    });
  }
}
