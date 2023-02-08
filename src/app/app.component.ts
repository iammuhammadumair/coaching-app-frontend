import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,TemplateRef, OnDestroy  } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { AuthenticationService } from './services/authentication.service';
import { Coach } from './models/Coach';
import { CoachFinderFirestoreService } from './services/coach-finder-firestore.service';
import { SwUpdate } from '@angular/service-worker';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { ContactService } from './services/contact.service';
// import { CanonicalService } from './services/canonical.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'Succeed';
  @ViewChild('cookies') cookies: TemplateRef<any>;
  @ViewChild('sidebar') sidebarEl: ElementRef;
  viewHeight: number;
  cookieName:string;
  country: string;
  fullImagePath: string;
  sidenavLeft = '-100%';
  overlayOpacity = 0;
  page;
  subscriptions: Array<Subscription> = [];

  public coaches: Observable<Coach[]>;


  constructor(
    private coachFinderService: CoachFinderFirestoreService,
    public auth: AuthenticationService,
    private updates: SwUpdate,
    private router: Router,
    private cookieService:CookieService,
    private dialog :MatDialog,
    private contactService:ContactService
    // private canonical: CanonicalService
  ) {
    this.fullImagePath = 'assets/images/logo_big.png';

    this.subscriptions.push(
      router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          this.page = val.url.split('/')[1];
        }
      })
    );
  }

  ngOnInit() {
    this.coaches = this.coachFinderService.getCoaches();
    // this.canonical.createCanonicalLink();
    this.updates.available.subscribe(event => {
      console.log('current version is: ', event.current);
      console.log('available version is', event.available);
      // triggers the update
      this.updates.activateUpdate().then( () => document.location.reload());
    });

    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

    
    if(this.sidebarEl){
      const width = this.sidebarEl.nativeElement.offsetWidth + 20;
      this.sidenavLeft = `-${width}px`;

    }

  }

  ngAfterViewInit() {
  
    this.cookieName =this.cookieService.get('name') 
    console.log(this.cookieName)
    if(!this.cookieName){
      setTimeout(() => {
        this.BookFreeSessionPopup("cookies")
      }, 10000);
    }

};

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  toggleSidenav() {
    const width = this.sidebarEl.nativeElement.offsetWidth + 20;
    if (this.sidenavLeft === '0px') 
    {
      this.sidenavLeft = `-${width}px`;
    } else {
      this.sidenavLeft = '0px';
    }
    this.overlayOpacity = .6;
  }
  closeDialog() {
    this.dialog.closeAll();
  }
    BookFreeSessionPopup(cookies) {
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "free-sesssion-popup";

    if (window.innerWidth > 1200) {
      dialogConfig.width = "50%";
    } else if (window.innerWidth > 800) {
      dialogConfig.width = "60%";
    } else {
      dialogConfig.width = "50%";
    }
    this.dialog.open(this.cookies);
  }
  setCookie(){
  this.cookieService.set('name','hassan');
  this.cookieName =this.cookieService.get('name') 
  // this.contactService.saveLogs(this.cookieName)
  this.closeDialog()
  }
}
