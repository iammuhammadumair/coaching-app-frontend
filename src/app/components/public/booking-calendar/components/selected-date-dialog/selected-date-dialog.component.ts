import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { Booking } from 'src/app/models/Booking';
import { Subscription } from 'rxjs';
import { AppUser } from 'src/app/models/AppUser';
import { AngularFireAuth } from '@angular/fire/auth';
import { AddCardComponent } from "src/app/add-card/add-card.component";
import { AuthenticationService } from "src/app/services/authentication.service";
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

@Component({
  selector: 'app-selected-date-dialog',
  templateUrl: './selected-date-dialog.component.html',
  styleUrls: ['./selected-date-dialog.component.css']
})
export class SelectedDateDialogComponent implements OnInit, OnDestroy {

  jsdateStarts: Date;
  userRef;
  continent;
  subscriptions: Subscription[] = [];
  user;
  submitting: boolean;
  jsdateEnds: Date;
  showError;
  showFreeError;

  constructor(
    private afFirestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<SelectedDateDialogComponent>,
    private authenticationService: AuthenticationService,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
  ) {
    this.continent = data.continent;
    this.jsdateStarts = new Date(data.date.year, data.date.month - 1, data.date.day);
    this.jsdateStarts.setHours(data.time.date.getHours(), data.time.date.getMinutes(), 0);

    this.jsdateEnds = new Date(this.jsdateStarts);
    this.jsdateEnds.setTime(this.jsdateEnds.getTime() + 75 * 60 * 1000);
  }

  ngOnInit() {
    // console.log(this)
    // console.log(this.data)
    // this.afAuth.authState.subscribe(user => {
    //   this.user = user.toJSON()
    // });
    this.initUser()

  }

  initUser() {
    const userRef = this.authenticationService.user;
    userRef.subscribe(user => {
      this.user = user;
    });

  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  close() {
    this.dialogRef.close();
  }

  getPreviousBookings() {
    if (this.user) {
      const bookings = this.afFirestore.collection<Booking>('bookings', ref => ref
        .where('client', '==', this.user.uid)
        .where('coach', '==', this.data.coach.id)
      ).get();
      const bookingsFreeIntake = this.afFirestore.collection<Booking>('bookings', ref => ref
        .where('clientemail', '==', this.data.ClientFreeIntake.ClientEmail)
        .where('coach', '==', this.data.coach.id)
      ).get();
      return Observable.merge(bookings,
        bookingsFreeIntake);
    }
    if (this.data.ClientFreeIntake) {
      return this.afFirestore.collection<Booking>('bookings', ref => ref
        .where('clientemail', '==', this.data.ClientFreeIntake.ClientEmail)
        .where('coach', '==', this.data.coach.id)
      ).get();
    }
  }

  showAddCardPopup() {
    const _this = this;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (window.innerWidth > 1200) {
      dialogConfig.width = '40%';
    } else if (window.innerWidth > 800) {
      dialogConfig.width = '60%';
    } else {
      dialogConfig.width = '90%';
    }
    dialogConfig.data = {
      user: this.user,
      continent: this.continent,
      coach: this.data.coach
    };
    const dialogRef = this.dialog.open(AddCardComponent, dialogConfig);

    const sub = dialogRef.componentInstance.paymentMade.subscribe(async (data: any) => {
      // console.log('event trigger: ', data)

      if (data !== false) {
        await _this.afFirestore.collection<Booking>('bookings').add({
          date: _this.jsdateStarts,
          client: _this.user.uid,
          coach: _this.data.coach.id,
          timeSlot: _this.data.timeSlot || null,
          isFree: false
        }).then(doc => {
          _this.submitting = false;
          if (doc && doc.id) {
            _this.dialogRef.close(_this.data);
          }
        }).catch(e => {
          _this.submitting = false;
          _this.showError = true;
          throw e;
        });
      }
      else if (data === false) {
        this.close()
      }

      await dialogRef.close();
      // await _this.dialogRef.close();
      return;

    });

    // dialogRef.afterClosed();
    // _this.dialogRef.afterClosed();
  }

  async schedule() {
    this.showFreeError = false;
    const { paymentMethod } = environment
    if (!this.data.coach) {
      return;
    }
    const type = this.data.sessionType;
    if (type === 'free') {
      const bookings = await this.getPreviousBookings().toPromise();
      if (bookings.docs && bookings.docs.length) {
        this.showFreeError = true;
        return;
      }
    }
    this.submitting = true;
    this.showError = false;
    if (this.data.ClientFreeIntake && this.user) {
      this.afFirestore.collection<Booking>('bookings').add({
        date: this.jsdateStarts,
        client: this.user.uid,
        clientemail: this.data.ClientFreeIntake.ClientEmail,
        coach: this.data.coach.id,
        timeSlot: this.data.timeSlot || null,
        isFree: type === 'free'
      }).then(doc => {
        this.submitting = false;
        if (doc && doc.id) {
          this.dialogRef.close(this.data);
        }
      }).catch(e => {
        this.submitting = false;
        this.showError = true;
        throw e;
      });
      return;
    }
    if (this.user) {
      if (!this.user.sponsored && this.user.paymentType === 'paypal' && paymentMethod.paypal) {
        this.showAddCardPopup();

      } else {
        this.afFirestore.collection<Booking>('bookings').add({
          date: this.jsdateStarts,
          client: this.user.uid,
          coach: this.data.coach.id,
          timeSlot: this.data.timeSlot || null,
          isFree: type === 'free'
        }).then(doc => {
          this.submitting = false;
          if (doc && doc.id) {
            this.dialogRef.close(this.data);
          }
        }).catch(e => {
          this.submitting = false;
          this.showError = true;
          throw e;
        });
        return;
      }
      // alert('here we have to ask for payment ' + this.continent)
    }
    if (this.data.ClientFreeIntake) {
      this.afFirestore.collection<Booking>('bookings').add({
        date: this.jsdateStarts,
        client: '',
        clientemail: this.data.ClientFreeIntake.ClientEmail,
        coach: this.data.coach.id,
        timeSlot: this.data.timeSlot || null,
        isFree: type === 'free'
      }).then(doc => {
        this.submitting = false;
        if (doc && doc.id) {
          this.dialogRef.close(this.data);
        }
      }).catch(e => {
        this.submitting = false;
        this.showError = true;
        throw e;
      });
    }
  }
}//
