import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Coach } from 'src/app/models/Coach';
import { TilePopupComponent } from '../tile-popup/tile-popup.component';
import { AppUser } from '../../../models/AppUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { specialtiesList } from '../../auth/coachadmins/coach-form/coach-form.component';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})

export class TileComponent implements OnInit, OnDestroy {

  @Input() uid: string;
  imageRE: string;
  show = false;
  dialogRef: MatDialogRef<TilePopupComponent>;
  coachRef: Observable<Coach>;
  coach: Coach;
  userRef: Observable<AppUser | null>;
  user?: AppUser;
  isClient: boolean;
  specialities: any;
  subscriptions: Array<Subscription> = [];
  sessionUser: Observable<AppUser | null>;
  role: string;
  path: string;
  requests?: string[];
  requestIcon = {
    'clicked': { 'color': 'myprimary', 'icon': 'mail_outline' },
    'defaultIcon': { 'color': 'myaccent', 'icon': 'email' },
    'actual': { 'color': 'myaccent', 'icon': 'email', 'selected': false }
  };
  specialtiesList = specialtiesList;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private coachFinderFirestoreService: CoachFinderFirestoreService,
    private activatedRoute: ActivatedRoute
  ) {
    this.path = window.location.pathname.split('/')[1];
  }

  ngOnInit() {
    this.sessionUser = this.authenticationService.user;
    this.sessionUser.subscribe(us => (this.role = (us && us.profileType ? us.profileType.toLocaleLowerCase() : '')));

    this.coachRef = this.coachFinderFirestoreService.getCoachFromId(this.uid);
    this.subscriptions.push(
      this.coachRef.subscribe(coach => {
        if (coach) {
          this.imageRE = coach.coachImage && coach.coachImage !== '' ? coach.coachImage : this.getIcon();
          this.coach = {...coach, id: this.uid};
          this.initCoachPopup();
          this.initIcons();
          this.specialities = this.coach.specialty;
        }
      })
    );
    this.userRef = this.authenticationService.user;
    this.subscriptions.push(
      this.userRef.subscribe(user => {
        this.user = user;
        this.isClient = user && user.profileType && user.profileType.toLocaleLowerCase() === 'client' ? true : false;
        this.requests = user && user.requests ? user.requests : [];
        this.initIcons();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  get coachDetailsUrl() {
    const path = window.location.pathname;
    if (path === '/welcome') {
      return '/client-nlpcoach/' + this.coach.username;
    } else {
      return '/coach/' + this.coach.username;
    }
  }

  initIcons() {
    if (this.coach && this.requests && this.requests.toString().indexOf(this.coach.id) > -1) {
      this.requestIcon.actual.icon = this.requestIcon.defaultIcon.icon;
      this.requestIcon.actual.selected = true;
    } else {
      this.requestIcon.actual.icon = this.requestIcon.clicked.icon;
      this.requestIcon.actual.selected = false;
    }
  }

  initCoachPopup() {
    const params = this.activatedRoute.snapshot.queryParams;
    if (params.coach && this.uid === params.coach) {
      this.showPopup();
    }
  }

  getIcon() {
    const random = Math.floor(Math.random() * 4) + 1;

    switch (random) {
      case 1: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/897b8a8d-9b25-4692-83e2-a490b192e626.jpeg';
      }
      case 2: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/378a6356-d5ae-40b6-8e29-c9a289d8347a.jpg';
      }
      case 3: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/LOTCASA%40.jpeg';
      }
      case 4: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/Grahamcasa.jpeg';
      }
    }
  }

  mouseEnter(ev: Event) {
    if (window.innerWidth > 736) {
      this.show = true;
    }
  }

  mouseLeave(ev: Event) {
    this.show = false;
  }

  goToCoach(ev: Event) {
    this.router.navigate([this.coachDetailsUrl]);
  }

  showPopup() {
    let width;
    if (window.innerWidth > 1200) {
      width = '30%';
    } else if (window.innerWidth > 800) {
      width = '40%';
    } else {
      width = '60%';
    }
    this.dialogRef = this.dialog.open(TilePopupComponent, {
      hasBackdrop: true,
      data: { 'coach': this.coach, source: 'C' },
      panelClass: 'custom-dialog-container',
      width: width
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.show = false;
    });
  }
}
