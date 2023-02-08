import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Booking } from '../models/Booking';
import { Subscription, Observable } from 'rxjs';
import { AppUser } from '../models/AppUser';
import { AuthenticationService } from '../services/authentication.service';
import { CalendarService } from '../calendar.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment-timezone';
import { HttpClient } from '@angular/common/http';
import { OpentokService } from '../opentok.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RatingDialogComponent } from '../rating-dialog/rating-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit, OnDestroy, AfterViewInit {

  validSession: boolean;
  booking;
  subscriptions: Array<Subscription> = [];
  userSubscription: Subscription;
  userRef: Observable<AppUser>;
  user: AppUser;
  sessionUrl: SafeResourceUrl;
  sessionError: string;
  sessionDate: Date;
  timezone = moment.tz.guess(true);
  createSessionUrl = `${environment.firebase.cloudFunctionsUrl}/createSession`;
  canPublish: boolean;

  width;
  height;
  session: OT.Session;
  streams: Array<OT.Stream> = [];
  loading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private afFirestore: AngularFirestore,
    private calendar: CalendarService,
    private http: HttpClient,
    private opentokService: OpentokService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    public  dialog: MatDialog
  ) { }

  ngOnInit() {
    if (!this.activatedRoute.snapshot.params.bookingId) {
      this.loading = false;
      return;
    }
    // get user
    this.userSubscription = this.authenticationService.user.subscribe(user => {
      this.user = user;
      if (!this.user) {
        this.sessionError = 'accessDenied';
        this.loading = false;
        return;
      }
      this.initSession();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.unsubscribeFromUser();
    if (this.session) {
      this.session.disconnect();
    }
  }

  ngAfterViewInit() {
    this.setVideoSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setVideoSize();
  }

  setVideoSize() {
    this.width = window.innerWidth - 50;
    this.height = window.innerHeight - 150;
  }

  unsubscribeFromUser() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async initSession() {
    try {
      // get booking
      const booking = await this.getBooking().toPromise();
      if (!booking || !booking.data() || !booking.id) {
        this.loading = false;
        return this.sessionError = 'invalid';
      }
      this.booking = booking.data();
      this.booking.id = booking.id;
      // console.log(this.booking)
      this.sessionDate = this.calendar.getJsDateFromTimestampDate(this.booking.date);
      // get session error
      this.sessionError = this.getSessionErrors();
      if (this.sessionError) {
        this.loading = false;
        return;
      }
      this.validSession = true;
      // create session (cloud function)
      const res: any = await this.http.post(this.createSessionUrl, {booking: this.booking.id}).toPromise();
      if (!res.session || !res.token) {
        this.loading = false;
        return false;
      }

      this.opentokService.initSession(res.session, res.token).then((session: OT.Session) => {
        this.session = session;
        this.loading = false;
        this.sessionEvents();
      })
      .then(() => {
        this.loading = false;
        this.opentokService.connect().catch(error => {
          console.log(error);
        });
      })
      .catch((err) => {
        this.loading = false;
        console.error(err);
      });
    } catch (e) {
      throw e;
    }
  }

  sessionEvents() {
    this.session.on('streamCreated', (event) => {
      this.streams.push(event.stream);
      this.changeDetectorRef.detectChanges();
    });
    this.session.on('streamDestroyed', (event) => {
      const idx = this.streams.indexOf(event.stream);
      if (idx > -1) {
        this.streams.splice(idx, 1);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  getSessionErrors() {
    const min75 = 75 * 60 * 1000;
    const now = new Date();

    if (this.sessionDate.getTime() > now.getTime()) {
      return 'future';
    } else if ((this.sessionDate.getTime() + min75) < now.getTime()) {
      return 'passed';
    }

    if (this.booking.client === this.user.uid ||
        this.booking.coach === this.user.coach) {
      return null;
    } else {
      return 'invalid';
    }
  }

  getBooking() {
    return this.afFirestore.collection<Booking>('bookings').doc(
      this.activatedRoute.snapshot.params.bookingId
    ).get();
  }

  finish() {
    this.session.disconnect();
    this.router.navigate([`/timeline/${this.booking.client}`]);
  }

  rate() {
    this.session.disconnect();
    let width = '90%';
    if (window.innerWidth > 1200) {
      width = '40%';
    } else if (window.innerWidth > 800) {
      width = '60%';
    }
    const dialogRef = this.dialog.open(RatingDialogComponent, {
      width: width,
      data: this.booking
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([`/timeline/${this.booking.client}`]);
    });
  }
}
