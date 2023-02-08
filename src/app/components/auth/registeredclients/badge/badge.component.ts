import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { AppUser } from '../../../../models/AppUser';
import { AuthenticationService } from '../../../../services/authentication.service';
import { SearchService } from '../../../../services/search.service';
import { PropertyBadge } from '../../../../models/property-badge';
import { SearchOption } from '../../../../models/search-option';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent implements OnInit, OnDestroy {

  @Input() source: string;
  @Input() refNumber: string;

  badge?: PropertyBadge;
  bookmarks?: string[];
  requests?: string[];

  searchOpt: SearchOption;
  subscriptions: Subscription[] = [];

  bookmarkIcon = {
    'clicked': { 'color': 'myprimary', 'icon': 'bookmark_outline' },
    'defaultIcon': { 'color': 'myaccent', 'icon': 'bookmark' },
    'actual': { 'color': 'myaccent', 'icon': 'bookmark', 'selected': false }
  };
  requestIcon = {
    'clicked': { 'color': 'myprimary', 'icon': 'mail_outline' },
    'defaultIcon': { 'color': 'myaccent', 'icon': 'email' },
    'actual': { 'color': 'myaccent', 'icon': 'email', 'selected': false }
  };

  userRef: Observable<AppUser | null>;
  user: AppUser;

  constructor(private authenticationService: AuthenticationService, private sServ: SearchService) {
    this.subscriptions.push(
      this.sServ.currentOption.subscribe(receiveddata => {
        this.searchOpt = receiveddata;
      })
    );
  }

  ngOnInit() {
    this.userRef = this.authenticationService.user;
    this.subscriptions.push(
      this.userRef.subscribe(user => {
        this.bookmarks = user && user.bookmarks ? user.bookmarks : [];
        this.requests = user && user.requests ? user.requests : [];
        if (this.source === 'carousel') {
          this.initIcons();
        }
        this.user = user;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  initIcons() {
    if (this.bookmarks && this.bookmarks.toString().indexOf(this.refNumber) > -1) {
      this.bookmarkIcon.actual.icon = this.bookmarkIcon.defaultIcon.icon;
      this.bookmarkIcon.actual.selected = true;
    } else {
      this.bookmarkIcon.actual.icon = this.bookmarkIcon.clicked.icon;
      this.bookmarkIcon.actual.selected = false;
    }
    if (this.requests && this.requests.toString().indexOf(this.refNumber) > -1) {
      this.requestIcon.actual.icon = this.requestIcon.defaultIcon.icon;
      this.requestIcon.actual.selected = true;
    } else {
      this.requestIcon.actual.icon = this.requestIcon.clicked.icon;
      this.requestIcon.actual.selected = false;
    }
  }

  getArrayLenght(arr: any[]): number {
    if (arr) {
      return arr.length;
    } else {
      return 0;
    }
  }

  selectIcon(type: string) {
    if (this.source === 'header') {
      if (type === 'bookmark' && this.bookmarks && this.bookmarks.length > 0) {
        this.bookmarkIcon.actual.selected = !this.bookmarkIcon.actual.selected;
        this.bookmarkIcon.actual.color = this.bookmarkIcon.actual.selected ?
          this.bookmarkIcon.clicked.color : this.bookmarkIcon.defaultIcon.color;

        this.setFilters();
        this.bindRefNumberToSearch();
      }
      if (type === 'request' && this.requests && this.requests.length > 0) {
        this.requestIcon.actual.selected = !this.requestIcon.actual.selected;
        this.requestIcon.actual.color = this.requestIcon.actual.selected ?
          this.requestIcon.clicked.color : this.requestIcon.defaultIcon.color;

        this.setFilters();
        this.bindRefNumberToSearch();
      }
    } else {
      if (type === 'bookmark' && this.bookmarks) {
        this.bookmarkIcon.actual.selected = !this.bookmarkIcon.actual.selected;
        this.bookmarkIcon.actual.icon = this.bookmarkIcon.actual.selected ?
          this.bookmarkIcon.defaultIcon.icon : this.bookmarkIcon.clicked.icon;

        if (this.bookmarkIcon.actual.selected) {
          this.user.bookmarks.push(this.refNumber);
        } else {
          const index: number = this.user.bookmarks.indexOf(this.refNumber);
          if (index !== -1) {
            this.user.bookmarks.splice(index, 1);
          }
        }
        this.authenticationService.updateUserData(this.user);
        this.sServ.setSearchOption(this.searchOpt);
      }
    }
  }

  setFilters() {
    if (!this.searchOpt) {
      this.searchOpt = new SearchOption();
    }
    if (this.bookmarkIcon.actual.selected && this.requestIcon.actual.selected) {
      // Add only the bookmarks that are on both arrays
      this.searchOpt.idIn = this.bookmarks.filter(x => this.requests.includes(x));
    } else if (this.requestIcon.actual.selected) {
      // Add the requests to the array
      this.searchOpt.idIn = this.requests;
    } else if (this.bookmarkIcon.actual.selected) {
      // Add the bookmarks to the array
      this.searchOpt.idIn = this.bookmarks;
    } else {
      // Remove requests from the array
      this.searchOpt.idIn = [];
    }
  }

  bindRefNumberToSearch() {
    this.sServ.setSearchOption(this.searchOpt);
  }
}
