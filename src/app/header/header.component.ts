import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() menuClick = new EventEmitter<any>();

  user;
  subscriptions: Array<Subscription> = [];

  constructor(
    private snackBar: MatSnackBar,
    public auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.subscriptions.push(
      this.auth.user.subscribe(user => {
        this.user = user;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  toggleSidenav() {
    this.menuClick.emit();
  }

  goToSignOut() {
    this.openSnackBar('Bye Bye, See you soon', 'Close');
    this.auth.signOut();
  }

  private openSnackBar(snackbarMessage: string, snackbarAction: string) {
    this.snackBar.open(snackbarMessage, snackbarAction, {
      duration: 2000,
    });
  }
}
