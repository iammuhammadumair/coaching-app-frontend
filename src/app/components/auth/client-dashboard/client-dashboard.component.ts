import { ContentObserver } from '@angular/cdk/observers';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { MangopayService } from 'src/app/mangopay.service';
import { Coach } from 'src/app/models/Coach';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';
import { AppUser } from '../../../models/AppUser';
@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent {
  userRef: Observable<AppUser | null>;
  user?: AppUser;
  selectedCoach: Coach;
  coachRef: Observable<Coach[]>;
  coach: Coach[];
  clients: AppUser[];
  unsubscribe = new Subject();
  Upload_Cv: boolean;
  percentage: string;
  createKYCDocumentRegistration;
  subscriptions: Array<Subscription> = [];
  constructor(public dialog: MatDialog,
    public iconRegistry: MatIconRegistry,
    private afFirestore: AngularFirestore,
    private coachFinderService: CoachFinderFirestoreService,
    private authenticationService: AuthenticationService,
    public router: Router,
    public sanitizer: DomSanitizer,
    private storage: AngularFireStorage,
    public snackbar: MatSnackBar,
    private mangoPay: MangopayService,) {
    iconRegistry.addSvgIcon(
      'delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/delete.svg')
    );
    iconRegistry.addSvgIcon(
      'update',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/update.svg')
    );

    this.userRef = this.authenticationService.user;

    this.userRef.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(res => {
      if (!res) {
        return;
      }
      this.user = res;
      this.user['genderShow'] = this.user.gender.substr(0, 1).toUpperCase();

      // coaches
      // this.afFirestore.collection<any>(
      //   'bookings', ref => ref.where('client', '==', this.user.uid)
      //   .where('clientemail', '==', this.user.email)
      // this.books.filter(
      //   book => book.store_id === this.store.id);
           this.afFirestore.collection<any>(
        'bookings', ref => ref
      ).valueChanges().pipe(switchMap(
        (bookings: any) => {
         const clientbookings = bookings.filter(data => data.client ==this.user.uid || data.clientemail ==this.user.email)
          const response = clientbookings.map(booking => {
            return this.afFirestore.collection<any>(
              'coaches', ref => ref.where('id', '==', booking.coach)
                .where('deleted', '==', false)
            ).valueChanges().pipe(map(users => users[0]));
          });
          return combineLatest([...response]);
        }
      )).subscribe((coaches: any) => {
        const result = [];
        const uids: any = {};
        for (const coach of coaches) {
          if (!coach) {
            continue;
          }
          if (!uids[coach.uid]) {
            uids[coach.uid] = true;
            result.push(coach);
          }
        }
        this.coach = result;
      });

    });
  }

  goToProfileInfo() {
    this.router.navigate(['/profile-info']);
  }

}




