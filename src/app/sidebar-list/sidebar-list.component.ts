import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-list',
  templateUrl: './sidebar-list.component.html',
  styleUrls: ['./sidebar-list.component.css']
})
export class SidebarListComponent implements OnInit, OnDestroy {
  @Output() menuClick = new EventEmitter<any>();
  subscriptions: Array<Subscription> = [];
  user;

  constructor(
    public auth: AuthenticationService,
    public router: Router,
  ) { }

  ngOnInit() {
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
 userprofile(){
   console.log(this.user?.profileType)
   if (this.user?.profileType == 'Client'){
    this.router.navigate(['/profile-info']);
 }
 else{
  this.router.navigate(['/welcome']);
 }

 this.toggleSidenav()
}
}