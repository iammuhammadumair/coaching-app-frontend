import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BookingCalendarDialogComponent } from '../booking-calendar/components/booking-calendar-dialog/booking-calendar-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUser } from 'src/app/models/AppUser';
import { Coach } from 'src/app/models/Coach';
import { Router } from '@angular/router';
import { GuestBookingComponent } from 'src/app/guest-booking/guest-booking.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { MessagesService } from 'src/app/services/messages.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-request-free-intake',
  templateUrl: './request-free-intake.component.html',
  styleUrls: ['./request-free-intake.component.css']
})
export class RequestFreeIntakeComponent implements OnInit {

  submitting;
  showSentMessage = false;
  sending = true;
  subject = '';
  FreeIntakeSubject: string;
  form: FormGroup;
  coachId: string;
  from: string;
  to: string;
  message: string;

  requestType: string;
  coach: Coach;
  user: AppUser;
  isClient: boolean;
  precompiledRequestMessage = '';
  precompileRequestSubject = '';
  userRef: Observable<AppUser | null>;
  constructor(
    private afFirestore: AngularFirestore,
    private sendSubscribeMail: MessagesService,
    private formbui: FormBuilder,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
    private router: Router) {
    this.coach = data['coach'];
    this.coachId = data['coachId'];
    this.to = data['coachMail'];
    this.from = data['senderMail'];
    }

  ngOnInit() {
    this.userRef = this.authenticationService.user;
    this.userRef.subscribe(user => {
      this.user = user;
      if (user && user.profileType && user.profileType.toLocaleLowerCase() === 'client') {
        this.isClient = true;
      } else {
        this.isClient = false;
      }
    });
    this.requestType = 'request';
    this.message = this.precompiledRequestMessage;
    this.subject = this.precompileRequestSubject;
    const coachAgent = this.to;
    const sender = this.from;
    this.form = this.formbui.group(
      {
         requestType: this.requestType,
        ClientEmail:  [sender, Validators.compose([Validators.required, Validators.email])],
        ClientName: ['', Validators.required],
        AdminEmail: 'mail@yosara.com',
        subject: 'Free Intake',
        message: 'Free intake session has been booked with' + ' ' + this.coach.name + '. ',
        CoachEmail: this.coach.email,
        coachName: this.coach.coachName
      }
    );
  }

  openCalendar(type) {
    this.showSchedulePopup(type);
    // if (this.user) {
    //   this.showSchedulePopup(type);
    // } else {
    //   this.showGuestSchedulePopup();
    // }
  }

  showSchedulePopup(type) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (window.innerWidth > 1200) {
      dialogConfig.width = '70%';
    } else if (window.innerWidth > 800) {
      dialogConfig.width = '60%';
    } else {
      dialogConfig.width = '90%';
    }
    dialogConfig.data = {
      coach: this.coach,
      type: type,
      FreeIntake: this.form.getRawValue()
    };
    const dialogRef = this.dialog.open(BookingCalendarDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dialogRef.close(res);
        this.send();
      }
    });
    
  }

  showGuestSchedulePopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (window.innerWidth > 1200) {
      dialogConfig.width = '70%';
    } else if (window.innerWidth > 800) {
      dialogConfig.width = '60%';
    } else {
      dialogConfig.width = '90%';
    }
    dialogConfig.data = {
      coach: this.coach
    };
    const dialogRef = this.dialog.open(GuestBookingComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'signin') {
        this.dialogRef.close();
        this.router.navigate(['/signin']);
      } else if (res === 'signup') {
        this.dialogRef.close();
        this.router.navigate(['/signup']);
      }
    });
  }

  send() {
    this.form.markAsTouched({ onlySelf: false });
    this.submitting = true;
    const value = this.form.getRawValue();
    if (!value) {
      return;
    }
    this.afFirestore.collection('FreeIntakeRequest').add(value).then(doc => {
      this.submitting = false;
      if (doc && doc.id) {
        this.dialogRef.close(this.data);
      }
    }).catch(e => {
      this.submitting = false;
      throw e;
    });
    // this.sendEmail();
  }
  // sendEmail() {
  //   if (!this.form.invalid) {
  //     this.showSentMessage = true;
  //     this.sendSubscribeMail.SendSubcribeMail(
  //       this.form.get('from').value,
  //       environment.MailToYosara,
  //       this.form.get('subject').value,
  //       this.form.get('message').value
  //     ).then(idMessage => {
  //       this.sendSubscribeMail.Testmail(idMessage).subscribe(result => {
  //         if (result !== null) {
  //           this.subject = result.subject;
  //           this.sending = !result.messageSent;
  //         } else {
  //           this.sending = true;
  //         }
  //       });
  //     });
  //   }
  // //}
}
