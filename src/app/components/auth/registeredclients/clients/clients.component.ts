import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppUser } from '../../../../models/AppUser';
import { AuthenticationService } from '../../../../services/authentication.service';
import { Observable, Subscription } from 'rxjs';
import { SlideInOutAnimation } from 'src/app/animations/animations';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  animations: [SlideInOutAnimation]
})
export class ClientsComponent implements OnInit, OnDestroy {

  userRef: Observable<AppUser | null>;
  user?: AppUser;
  firstname: string;
  client: string;
  subscriptions: Subscription[] = [];
  animationState = 'in';

  constructor(
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.userRef = this.authenticationService.user;
    this.subscriptions.push(
      this.userRef.subscribe(u => {
        if (u) {
          this.user = u;
          this.client = this.user.uid;
          this.firstname = u.firstname;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  toggleShowDiv() {
    this.animationState = this.animationState === 'in' ? 'out' : 'in';
  }
}
