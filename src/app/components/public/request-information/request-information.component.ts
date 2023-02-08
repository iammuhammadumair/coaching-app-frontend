import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppUser } from '../../../models/AppUser';
import { Message } from '../../../models/message';
import { AuthenticationService } from '../../../services/authentication.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Coach } from 'src/app/models/Coach';
import { BookingCalendarDialogComponent } from '../booking-calendar/components/booking-calendar-dialog/booking-calendar-dialog.component';
import { GuestBookingComponent } from 'src/app/guest-booking/guest-booking.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-information',
  templateUrl: './request-information.component.html',
  styleUrls: ['./request-information.component.css']
})
export class RequestInformationComponent implements OnInit {

  form: FormGroup;
  coachId: string;
  from: string;
  to: string;
  message: string;
  subject: string;
  requestType: string;
  coach: Coach;

  userRef: Observable<AppUser | null>;
  user: AppUser;
  isClient: boolean;

  precompilePlaceOfferdSubject = 'Place an offer for #ref#';
  precompileRequestSubject = '';
  precompilePlaceOfferdMessage = 'Hi I’m interested in this property and I would like to make an offer';
  precompiledRequestMessage = '';

  sentMessage: Message = null;
  showSentMessage = false;
  sending = true;
  rate;
  canBookFreeSession;

  constructor(
    private formbui: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authenticationService: AuthenticationService,
    private sendMessage: MessagesService,
    private router: Router,
    private dialog: MatDialog
  ) {
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
        from: [sender, Validators.compose([Validators.required, Validators.email])],
        to: coachAgent,
        subject: this.subject,
        message: this.message
      }
    );
  }

  close() {
    this.dialogRef.close();
  }

  sendMail() {
    this.showSentMessage = true;
    if (this.user && this.user.uid) {
      if (this.form.controls['requestType'].value === 'request') {
        this.user.requests = this.user.requests || [];
        this.user.requests.push(this.coachId);
      } else {
        this.user.offers = this.user.offers || [];
        this.user.offers.push(this.coachId);
      }
      this.authenticationService.updateUserData(this.user);

      this.sendMessage.addMessage(
        this.form.get('from').value,
        this.form.get('to').value,
        this.form.get('subject').value,
        this.form.get('message').value,
        this.user.uid ? this.user.uid : null
      ).then(idMessage => {
        this.sendMessage.getMessage(idMessage).subscribe(result => {
          if (result !== null) {
            this.subject = result.subject;
            this.sending = !result.messageSent;
          } else {
            this.sending = true;
          }
        });
      });
    } else {
      this.sendMessage.addMessage(
        this.form.get('from').value,
        this.form.get('to').value,
        this.form.get('subject').value,
        this.form.get('message').value
      ).then(idMessage => {
        this.sendMessage.getMessage(idMessage).subscribe(result => {
          if (result !== null) {
            this.subject = result.subject;
            this.sending = !result.messageSent;
          } else {
            this.sending = true;
          }
        });
      });
    }
  }

  showSendedMessage(templateRef) {
    this.dialog.open(templateRef);
  }

  checkRequest() {
    if (this.form.controls['requestType'].value === 'request') {
      this.message = this.precompiledRequestMessage;
      this.subject = this.precompileRequestSubject;

    } else {
      this.message = this.precompilePlaceOfferdMessage;
      this.subject = this.precompilePlaceOfferdSubject.replace('#ref#', this.coachId);
    }
    this.form.controls['message'].setValue(this.message);
    this.form.controls['subject'].setValue(this.subject);
  }

  openCalendar(type) {
    if (this.user) {
      this.showSchedulePopup(type);
    } else {
      this.showGuestSchedulePopup();
    }
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
      type: type
    };
    const dialogRef = this.dialog.open(BookingCalendarDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dialogRef.close(res);
      }
    });
  }
}
