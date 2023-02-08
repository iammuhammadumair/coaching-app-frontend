import { Component, OnInit, OnDestroy } from '@angular/core';
import { Coach } from 'src/app/models/Coach';
import { Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { takeUntil, switchMap, map, finalize, filter } from 'rxjs/operators';
import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from 'src/app/models/AppUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserInfoDialogComponent } from '../user-info-dialog/user-info-dialog.component';
import { DeleteUserComponent } from '../../auth/shared/delete-user/delete-user.component';
import { UpdateCoachDialogComponent } from 'src/app/update-coach-dialog/update-coach-dialog.component';
import { CoachCalendarDialogComponent } from '../coach-calendar/components/coach-calendar-dialog/coach-calendar-dialog.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MangopayService } from 'src/app/mangopay.service';

@Component({
  selector: 'app-coach-account',
  templateUrl: './coach-account.component.html',
  styleUrls: ['./coach-account.component.css']
})
export class CoachAccountComponent implements OnInit, OnDestroy {

  userRef: Observable<AppUser | null>;
  user?: AppUser;
  selectedCoach: Coach;
  coachRef: Observable<Coach[]>;
  coach: Coach;
  clients: AppUser[];
  unsubscribe = new Subject();
  Upload_Cv: boolean;
  percentage: string;
  createKYCDocumentRegistration;
  subscriptions: Array<Subscription> = [];

  constructor(
    public dialog: MatDialog,
    public iconRegistry: MatIconRegistry,
    private afFirestore: AngularFirestore,
    private coachFinderService: CoachFinderFirestoreService,
    private authenticationService: AuthenticationService,
    public router: Router,
    public sanitizer: DomSanitizer,
    private storage: AngularFireStorage,
    public snackbar: MatSnackBar,
    private mangoPay: MangopayService,
  
  ) {
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

  ngOnDestroy() {
    this.unsubscribe.next();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.authenticationService.user.pipe(filter(user => !!user)).subscribe(user => {
        this.user = user;
      })
    );
  }

  goToProfileInfo() {
    this.router.navigate(['/profile-info']);
  }

  showUserDetail(user: AppUser) {
    this.dialog.open(UserInfoDialogComponent, {
      width: '40em',
      data: user
    });
  }

  openDeleteUserDialog(user: AppUser) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      user: user
    };
    const dialogRef = this.dialog.open(DeleteUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authenticationService.delete(user.uid);
      }
    });
  }

  openUpdateCoachDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      coach: this.coach
    };
    this.dialog.open(UpdateCoachDialogComponent, dialogConfig);
  }

  openCalendar() {
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
  }

  startUpload_Cv(event) {
    // The File object
    this.Upload_Cv = true;
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const ext = file[0];
    if (file.type !== 'application/pdf') {
      this.snackbar.open('Unsupported file type. You can upload pdf file', 'Close', {
        duration: 3000,
      });
      return;
    }
    const path = `coaches-cv/${this.coach.id}`;
    const fileRef = this.storage.ref(path);
    const task = fileRef.put(file);

    task.percentageChanges().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(p => this.percentage = p.toString() + '%');
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(
          takeUntil(this.unsubscribe)
        ).subscribe(async url => {
          this.coach.coachCV = url;
          this.coachFinderService.updateCoach(this.coach);
          this.coachFinderService.updateCoach(this.coach);
        
          // this.form.patchValue({ 'coachImage': url });
          this.Upload_Cv = false;
        });
      })
    ).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe();
    this.snackbar.open('Cv uploaded successfully', 'Close', {
      duration: 3000,
    });
  }

  openKycOpen(Uploadkyc){
    const dialogConfig = new MatDialogConfig();
    if (window.innerWidth > 1200) {
      dialogConfig.width = '50%';
    } else if (window.innerWidth > 800) {
      dialogConfig.width = '100%';
    } else {
      dialogConfig.width = '90%';
    }
  
    this.dialog.open(Uploadkyc,
      dialogConfig);
  }
  
  closeDialog() {
    this.dialog.closeAll();
  }
  startUpload_KYC(event) {
    // The File object
    this.Upload_Cv = true;
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const ext = file[0];
    if (file.type !== 'application/pdf') {
      this.snackbar.open('Unsupported file type. You can upload pdf file', 'Close', {
        duration: 3000,
      });
      return;
    }
    const path = `coaches-kyc/${this.coach.id}`;
    const fileRef = this.storage.ref(path);
    const task = fileRef.put(file);

    task.percentageChanges().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(p => this.percentage = p.toString() + '%');
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(
          takeUntil(this.unsubscribe)
        ).subscribe(async url => {
          this.coach.coachCV = url;
          this.coachFinderService.updateCoach(this.coach);
          // this.createKYCDocumentRegistration = this.mangoPay.createKYCDocumentRegistration(this.user.mangoUserId);
          this.coachFinderService.updateCoach(this.coach);
          // this.form.patchValue({ 'coachImage': url });
          this.Upload_Cv = false;
        });
      })
    ).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe();
    this.snackbar.open('Kyc uploaded successfully', 'Close', {
      duration: 3000,
    });
  }

    
}
