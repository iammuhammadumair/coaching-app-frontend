import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from './authentication.service';
import { Coach } from '../models/Coach';
import { take } from 'rxjs/operators';
import { RequestFreeIntakeComponent } from '../components/public/request-free-intake/request-free-intake.component';

@Injectable({
  providedIn: 'root'
})
export class FreeIntakeRequestService {

  constructor(
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) { }


  openFreeIntakeRequest(coach: Coach, canBookFreeSession: boolean = false) {
    this.authenticationService.user.pipe(take(1)).subscribe(senderUser => {
      let width = '50%';
      if (window.innerWidth < 600) {
        width = '100%';
      }
      this.dialog.open(RequestFreeIntakeComponent, {
        hasBackdrop: true,
        data: {
          'coachId': coach.id,
          'senderMail': senderUser && senderUser.isClient ? senderUser.email : '',
          'coachMail': coach ? coach.email : '',
          'coach': coach,
          'canBookFreeSession': canBookFreeSession
        },
        width: width
      });
    });
  }
}
