import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-calendar-redirect',
  templateUrl: './calendar-redirect.component.html',
  styleUrls: ['./calendar-redirect.component.css']
})
export class CalendarRedirectComponent implements OnInit {

  role;
  user;

  constructor(
    private snackbar: MatSnackBar,
    private router: Router,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.authenticationService.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.handleCalendarSync();
      }
    });
  }

  redirect() {
   
    this.role = (this.user && this.user.profileType ? this.user.profileType.toLocaleLowerCase() : '');
    if (this.role === 'client') {
     
      this.router.navigate(['/client-calendar']); 
    } else {
      this.router.navigate(['/welcome']);
    }
  }

  handleCalendarSync() {
    const {code} = this.activatedRoute.snapshot.queryParams;
    if (code) {
      this.http.post(
        `${environment.firebase.cloudFunctionsUrl}/getGoogleCalendarAccessToken`,
        {code, user: this.user.uid}
      ).subscribe(() => {    
        this.redirect();
      }, () => {
        this.snackbar.open('Google Calendar Sync successfully.', 'Close', {
          duration: 3000,
        });
        this.redirect();
      });
    }
  }

}
