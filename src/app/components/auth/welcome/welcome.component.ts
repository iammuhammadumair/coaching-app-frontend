import { Component, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { AppUser } from '../../../models/AppUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatDialog, MatDialogConfig, } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Coach } from 'src/app/models/Coach';
import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';
import { CoachCalendarDialogComponent } from '../../public/coach-calendar/components/coach-calendar-dialog/coach-calendar-dialog.component';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  user: Observable<AppUser | null>;
  role: string;
  coach: Coach;
  users: AppUser;
  dialogConfigs: MatDialogConfig;
  userRef: Observable<AppUser | null>;
  unsubscribe = new Subject();
  clients: AppUser[];
  Calender: string;
  constructor(private authenticationService: AuthenticationService, private router: Router, private dialog: MatDialog,
    private coachFinderService: CoachFinderFirestoreService, private afFirestore: AngularFirestore, private route: ActivatedRoute) {

    if (this.authenticationService.user) {
      this.userRef = this.authenticationService.user;
    }

    this.userRef.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(res => {
      if (!res) {
        return;
      }
      this.users = res;
      // this.user['genderShow'] = this.user.gender.substr(0, 1).toUpperCase();
    });
  }

  ngOnInit() {
    this.Calender = this.route.snapshot.params['calendar'];
    this.user = this.authenticationService.user;
    this.user.subscribe(us => (this.role = (us && us.profileType ? us.profileType.toLocaleLowerCase() : '')));
    if (this.Calender === 'calendar') {
      if (this.users && this.users.profileType && this.users.profileType.toLocaleLowerCase() === 'client') {
        this.RouteCalender();
        return;
      }
    }

    this.coachFinderService.getCoachFromId(this.users.coach).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(re => {
      this.coach = re;
      this.RouteCalender();

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

    // this.openCalendar('');
  }



  RouteCalender() {
    if (this.Calender === 'calendar') {
      this.openCalendar();
      this.Calender = '';
    }
  }
  openCalendar() {
    // this.CalenderClicked=false;
    if (this.dialog.openDialogs.length > 0) {
      return;
    }
    if (this.users && this.users.profileType && this.users.profileType.toLocaleLowerCase() === 'client') {
      this.router.navigate(['/client-calendar']);
    } else if (this.users && this.users.profileType && this.users.profileType.toLocaleLowerCase() === 'coach') {
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

    }
  }
}
