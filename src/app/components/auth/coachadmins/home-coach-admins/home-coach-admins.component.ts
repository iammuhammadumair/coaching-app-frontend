import { Component, OnInit } from '@angular/core';
import {AppUser} from '../../../../models/AppUser';
import {AuthenticationService} from '../../../../services/authentication.service';
import { Coach } from 'src/app/models/Coach';
import { Observable } from 'rxjs';
import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from '../../shared/delete-user/delete-user.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home-coach-admins',
  templateUrl: './home-coach-admins.component.html',
  styleUrls: ['./home-coach-admins.component.css']
})
export class HomeCoachAdminsComponent implements OnInit {

  userRef: Observable<AppUser | null>;
  user?: AppUser;
  firstname: string;
  selectedCoach: Coach;
  coachRef: Observable<Coach[]>;
  coaches: Coach[];
  clients: Observable<AppUser[]>;
  coachAgentType:string;
  constructor(
    private afFirestore: AngularFirestore,
    private coachFinderService: CoachFinderFirestoreService,
    private authenticationService: AuthenticationService,
    public iconRegistry: MatIconRegistry,
    public deleteDialog: MatDialog,
    public  dialog: MatDialog,
    public sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'update',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/update.svg')
    );
    iconRegistry.addSvgIcon(
      'delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/delete.svg')
    );
    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/add.svg')
    );
    this.userRef = this.authenticationService.user;
    this.userRef.subscribe(res => {
      this.user = res;
      if (res) {
        this.firstname = res.firstname;
        this.coachAgentType = res?.coachAgentType;
        // coaches
        this.coachRef = this.coachFinderService.getCoachesByCoachAgent(this.user);
        this.coachRef.subscribe(re => {
          this.coaches = re;
          this.coaches.sort((a, b) => {
            if (!a.lastUpdate) {
              a.lastUpdate = 0;
            }
            if (!b.lastUpdate) {
              b.lastUpdate = 0;
            }
            return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
          });
        });
        // clients
        this.clients = this.afFirestore.collection<AppUser>(
          'users', ref => ref.where('profileType', '==', 'Client')
                             .where('coachAgent', '==', this.user.uid)
                             .where('sponsored', '==', true)
                             .where('deleted','==',false)
        ).valueChanges();
      }
    });
  }

  ngOnInit() {
  }

  receiveCoach($event) {
    if ($event) {
      this.selectedCoach = $event;
    }
  }
  openDeleteUserDialog(user: AppUser) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      user: user
    };
    const dialogRef = this.deleteDialog.open(DeleteUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authenticationService.delete(user.uid);
      }
    });
  }
}
