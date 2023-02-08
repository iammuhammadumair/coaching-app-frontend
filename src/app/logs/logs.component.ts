import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CalendarService } from '../calendar.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  user;
  role;
  bookings;
  coach;
  pendingBookings = [];
  sessionBookings = [];
  noShowBookings = [];
  cancelledBookings = [];
  coachId = this.activatedRoute.snapshot.params.coachId;

  constructor(
    private calendar: CalendarService,
    private afFirestore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.authenticationService.user.subscribe(us => {
      if (us) {
        this.user = us;
        this.role = (us && us.profileType ? us.profileType.toLocaleLowerCase() : '');
        this.init();
      }
    });
  }

  async init() {
    try {
      const coach = await this.afFirestore.doc(
        `coaches/${this.coachId}`
      ).get().toPromise();
      this.coach = coach.data();
      if (this.role === 'coach agent') {
        if (this.coach.coachAgent !== this.user.uid) {
          return;
        }
      } else if (this.role !== 'admin') {
        return;
      }

      const cancelledBookings = await this.afFirestore.collection(
        'cancelledBookings', ref => ref.where('coach', '==', this.coachId)
      ).get().pipe(map(snapshot => {
        if (snapshot.docs.length) {
          return snapshot.docs.map((booking :any) => {
            return {
              id: booking.id,
              date: booking.data().date,
              client: booking.data().client,
              timeSlot: booking.data().timeSlot,
              coach: this.coach,
              sessionId: booking.data().sessionId
            };
          });
        }
        return [];
      })).toPromise();
      for (const booking of cancelledBookings) {
        booking.date = this.calendar.getJsDateFromTimestampDate(booking.date);

        const client = await this.afFirestore.collection(
          'users', ref => ref.where('uid', '==', booking.client)
        ).get().toPromise();
        if (client.docs && client.docs.length) {
          booking.client = client.docs[0].data();
        }
      }

      const bookings = await this.afFirestore.collection(
        'bookings', ref => ref.where('coach', '==', this.coachId)
      ).get().pipe(map(snapshot => {
        if (snapshot.docs.length) {
          return snapshot.docs.map((booking :any)  => {
            return {
              id: booking.id,
              date: booking.data().date,
              client: booking.data().client,
              timeSlot: booking.data().timeSlot,
              coach: this.coach,
              sessionId: booking.data().sessionId
            };
          });
        }
        return [];
      })).toPromise();

      const pendingBookings = [];
      const sessionBookings = [];
      const noShowBookings = [];

      for (const booking of bookings) {
        booking.date = this.calendar.getJsDateFromTimestampDate(booking.date);
        const now = new Date();

        const client = await this.afFirestore.collection(
          'users', ref => ref.where('uid', '==', booking.client)
        ).get().toPromise();
        if (client.docs && client.docs.length) {
          booking.client = client.docs[0].data();
        }

        if (booking.date.getTime() > now.getTime()) {
          pendingBookings.push(booking);
        } else {
          if (booking.sessionId) {
            sessionBookings.push(booking);
          } else {
            noShowBookings.push(booking);
          }
        }
      }
      this.bookings = bookings;
      this.pendingBookings = pendingBookings;
      this.sessionBookings = sessionBookings;
      this.noShowBookings = noShowBookings;
      this.cancelledBookings = cancelledBookings;
    } catch (e) {
      console.warn(e);
    }
  }
}

