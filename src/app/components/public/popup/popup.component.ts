import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Coach } from 'src/app/models/Coach';
import { CoachShowPopupComponent } from '../coach-show-popup/coach-show-popup.component';
import { CoachCrudDialogComponent } from '../coach-crud-dialog/coach-crud-dialog.component';
import { AppUser } from '../../../models/AppUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { ContactService } from '../../../services/contact.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Rating } from '../../../models/Rating';

/* TODO: rename to CoachMapPopupComponent */
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit, OnDestroy {

  @Input() coach: Coach;
  @Input() source: string;

  closeVisible = false;
  dialogRef: MatDialogRef<CoachShowPopupComponent>;
  reFormRef: MatDialogRef<CoachCrudDialogComponent>;
  re3dVideo: string;
  video: string;
  imageRE: string;
  userRef: Observable<AppUser | null>;
  user?: AppUser;
  isClient: boolean;
  isCoachAgent: boolean;
  buttonLabel = 'Request Information';
  coachAgent: AppUser;
  path: string;
  subscriptions: Subscription[] = [];
  rate;

  constructor(
    private ownDialogRef: MatDialogRef<PopupComponent>,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private contactService: ContactService,
    private af: AngularFirestore
  ) {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    this.re3dVideo = '';
    this.video = this.coach.coachVideoUrl || '';
    this.imageRE = this.coach.coachImage !== '' ? this.coach.coachImage : this.getIcon();
    this.userRef = this.authenticationService.user;
    this.getCoachRating();

    this.authenticationService.getUserFromUid(this.coach.coachAgent).subscribe(
      data => {
        this.coachAgent = data;
      }
    );

    this.userRef.subscribe(u => {
      this.user = u;
      this.isClient = u && u.isClient();
      if (this.isClient) { this.buttonLabel = 'Contact or place offer'; }
      this.isCoachAgent = u && u.isCoachAgent();
    });

    if (this.source && this.source === 'C') {
      this.closeVisible = true;
    }
  }

  getCoachRating() {
    this.af.collection<Rating>(
      'ratings', ref => ref.where('coach', '==', this.coach.id)
    ).valueChanges().subscribe(ratings => {
      if (ratings && ratings.length) {
        const rate = ratings.reduce((a, b) => this.getSum(a, b)).rate;
        this.rate = rate / ratings.length;
      }
    });
  }

  getSum(a, b) {
    return {rate: a.rate + b.rate};
  }

  get coachDetailsUrl() {
    const path = window.location.pathname;
    if (path === '/welcome') {
      return '/client-nlpcoach/' + this.coach.username;
    } else {
      return '/coach/' + this.coach.username;
    }
  }

  openDialog(coach: Coach, videoType: string) {
    const dialogConfig = {
      hasBackdrop: true,
      data: coach,
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh'
    };
    this.dialogRef = this.dialog.open(CoachShowPopupComponent, dialogConfig);
  }

  openFormRe(coach: Coach) {
    this.reFormRef = this.dialog.open(CoachCrudDialogComponent, {
      hasBackdrop: true,
      data: coach,
      width: '80%'
    });
    this.reFormRef.afterClosed().subscribe(
      data => console.log('Form value:', data)
    );
  }

  getIcon() {
    const random = Math.floor(Math.random() * 4) + 1;

    switch (random) {
      case 1: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/897b8a8d-9b25-4692-83e2-a490b192e626.jpeg';
        break;
      }
      case 2: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/378a6356-d5ae-40b6-8e29-c9a289d8347a.jpg';
        break;
      }
      case 3: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/LOTCASA%40.jpeg';
        break;
      }
      case 4: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/Grahamcasa.jpeg';
        break;
      }
    }
  }

  openRequestInfo() {
    this.contactService.openRequestInfo(this.coach);
  }

  close() {
    this.ownDialogRef.close();
  }
}
