import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { SlideInOutAnimation } from 'src/app/animations/animations';
import { AppUser } from 'src/app/models/AppUser';
import { Coach } from 'src/app/models/Coach';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';
import { CoachCalendarDialogComponent } from '../../public/coach-calendar/components/coach-calendar-dialog/coach-calendar-dialog.component';
import { IgService } from '../../public/public-home/ig.service';
declare const loadScript: any;
@Component({
  selector: 'app-partner-home',
  templateUrl: './partner-home.component.html',
  styleUrls: ['./partner-home.component.css'],
  animations: [SlideInOutAnimation]
})
export class PartnerHomeComponent implements OnInit {
  coach: Coach;
  animationState = 'in';
  media;
  user: AppUser;
  isClient: boolean;
  coach$: Observable<Coach>;
  IsCoach: boolean;
  dialogConfigs: MatDialogConfig;
  userRef: Observable<AppUser | null>;
  unsubscribe = new Subject();
  clients: AppUser[];

  constructor(private ig: IgService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private router: Router,
    private coachFinderService: CoachFinderFirestoreService,
    private afFirestore: AngularFirestore) {
    if (this.authenticationService.user) {
      this.userRef = this.authenticationService.user;
    }

    this.userRef.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(res => {
      if (!res) {
        return;
      }
      this.user = res;
      // this.user['genderShow'] = this.user.gender.substr(0, 1).toUpperCase();
      this.coachFinderService.getCoachFromId(this.user.coach).pipe(
        takeUntil(this.unsubscribe)
      ).subscribe(re => {
        this.coach = re;
        if (!this.coach || !this.coach.gender || !this.coach.coachAgent) {
          return;
        }
        // clients
        this.afFirestore.collection<any>(
          'bookings', ref => ref.where('coach', '==', this.coach.id)
        ).valueChanges().pipe(switchMap(
          (bookings: any) => {
            const response = bookings.map(booking => {
              return this.afFirestore.collection<any>(
                'users', ref => ref.where('uid', '==', booking.client)
                  .where('deleted', '==', false)
              ).valueChanges().pipe(map(users => users[0]));
            });
            return combineLatest(...response);
          }
        )).subscribe((clients: any) => {
          const result = [];
          const uids: any = {};
          for (const client of clients) {
            if (!client) {
              continue;
            }
            if (!uids[client.uid]) {
              uids[client.uid] = true;
              result.push(client);
            }
          }
          this.clients = result;
        });
      });
    });
  }

  async ngOnInit() {
    loadScript();
    this.initUser();
    const accessToken: any = await this.ig.getAccessToken().toPromise();
    if (!accessToken || !accessToken.token) {
      return;
    }
    const user: any = await this.ig.getUserMedia(accessToken.token).toPromise();
    if (user && user.media && user.media.data && user.media.data.length) {
      const media = (user.media.data as Array<any>);
      const observables = [];
      for (const image of media) {
        observables.push(
          this.ig.getMediaUrl(image.id, accessToken.token)
        );
      }
      if (observables.length) {
        forkJoin(observables).subscribe(responses => {
          this.media = responses.filter((el: any) => {
            return el.media_url.indexOf('.mp4') === -1;
          });
        });
      }
    }
  }

  toggleShowDiv() {
    this.animationState = this.animationState === 'in' ? 'out' : 'in';
  }

  initUser() {
    const userRef = this.authenticationService.user;
    userRef.subscribe(user => {
      this.user = user;
      if (user && user.profileType && user.profileType.toLocaleLowerCase() === 'client') {
        this.isClient = true;
      } else {
        this.isClient = false;
      }
    });
  }

  openCalendar(GuestPopUp) {
    if (this.user && this.user.profileType && this.user.profileType.toLocaleLowerCase() === 'client') {
      this.router.navigate(['/client-calendar']);
    } else if (this.user && this.user.profileType && this.user.profileType.toLocaleLowerCase() === 'coach') {
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
      this.dialog.open(CoachCalendarDialogComponent, dialogConfig);
    } else {
        this.GuestCalendarPopup(GuestPopUp);
    }
  }
  GuestCalendarPopup(GuestPopUp) {
    this.dialog.open(GuestPopUp,
      { panelClass: 'Dialog-Sign_In' });
  }
  closeDialog() {
    this.dialog.closeAll();
  }
}
