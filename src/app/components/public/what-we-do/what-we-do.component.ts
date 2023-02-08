import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CanonicalService } from '../../../services/canonical.service';
import { Subscription } from 'rxjs';
 declare const loadScript: any;
@Component({
  selector: 'app-what-we-do',
  templateUrl: './what-we-do.component.html',
  styleUrls: ['./what-we-do.component.css']
})
export class WhatWeDoComponent implements OnInit, OnDestroy {

  user;
  subscriptions: Array<Subscription> = [];

  constructor(
    public auth: AuthenticationService,  private canonical : CanonicalService
  ) { }

  ngOnInit() {
      loadScript();
    this.getUser();
    this.canonical.createCanonicalLink();

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

}
