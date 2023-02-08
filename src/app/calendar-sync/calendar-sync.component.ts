import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AppUser } from '../models/AppUser';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
const googleLogoURL = 
"https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";
@Component({
  selector: 'app-calendar-sync',
  templateUrl: './calendar-sync.component.html',
  styleUrls: ['./calendar-sync.component.css']
})
export class CalendarSyncComponent implements OnInit {

  @Input() currentUrl;

  gcLoading = false;
  userRef: Observable<AppUser | null>;
  user: AppUser;
  loading: boolean;

  constructor(
    private afDb: AngularFirestore,
    public snackbar: MatSnackBar,
    private http: HttpClient,
    public authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
    
  ) {
    this.matIconRegistry.addSvgIcon(
      "logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
   }

  ngOnInit() {
    this.userRef = this.authenticationService.user;
    this.userRef.subscribe(u => {
      this.user = u;
    });
  }

  enableGoogleCalendarSync(forceNewAccount: boolean = false) {
    if (!forceNewAccount && this.user.gcTokens) {
      this.setGCEnabled(true);
      this.closeDialog();
      return;
    }
    this.loading = true;
    this.http.get(
      `${environment.firebase.cloudFunctionsUrl}/getGoogleCalendarAccessUrl`
    ).pipe(
      finalize(() => this.loading = true)
    ).subscribe((res: any) => {
      if (res.url) {
        console.log(res.url)
        window.location.href = res.url;
      } else {
        this.snackbar.open('Could not enable Google Calendar Sync, please try again later.', 'Close', {
          duration: 3000,
        });
      }
   
    }
    );
    this.closeDialog();
  }

  disableGoogleCalendarSync() {
    this.setGCEnabled(false);
  }
  syncGoogleCalendar(SycnCalendar){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "free-sesssion-popup";

    if (window.innerWidth > 1200) {
      dialogConfig.width = "30%";
    } else if (window.innerWidth < 800) {
      dialogConfig.width = "100%";
    } else {
      dialogConfig.width = "60%";
    }
    this.dialog.open(SycnCalendar, dialogConfig);
  }
    closeDialog() {
      this.dialog.closeAll();
    }

  

  setGCEnabled(value) {
    this.afDb.collection('users').doc(this.user.uid).update({
      gcEnabled: value
    });
  }
}
