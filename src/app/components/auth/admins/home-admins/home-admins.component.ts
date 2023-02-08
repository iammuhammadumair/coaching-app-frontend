import { Component, OnInit, ElementRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AppUser } from '../../../../models/AppUser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry} from '@angular/material/icon';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../../../../services/authentication.service';
import { DeleteConfimrComponent } from '../../shared/delete-confimr/delete-confimr.component';
import { UserInfoDialogComponent } from 'src/app/components/public/user-info-dialog/user-info-dialog.component';
import { ProfileTypeFinderService } from 'src/app/services/profile-type-finder.service';
import { ProfileType } from 'src/app/models/profile-type';
import { Coach } from 'src/app/models/Coach';
import { Router } from '@angular/router';
import { DeleteUserComponent } from '../../shared/delete-user/delete-user.component';
import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';
import { CoachAgentCreateDialogComponent } from 'src/app/components/public/coach-agent-create-dialog/coach-agent-create-dialog.component';

@Component({
  selector: 'app-home-admins',
  templateUrl: './home-admins.component.html',
  styleUrls: ['./home-admins.component.css']
})
export class HomeAdminsComponent implements OnInit, OnDestroy {

  @Input() coachInput: Coach[];

  enabled: Boolean;
  closeResult: string;
  adminRef: Observable<AppUser>;
  admin: AppUser;
  clientCollection: AngularFirestoreCollection<AppUser>;
  coachAgentsCollection: AngularFirestoreCollection<AppUser>;
  clients: Observable<AppUser[]>;
  coachAgents: Observable<AppUser[]>;
  profileTypes: Observable<ProfileType[]>;
  coaches: Observable<Coach[]>;
  coachesA: Coach[];
  coachAgentsList: AppUser[];
  subscriptions: Subscription[] = [];

  @ViewChild('password') password: ElementRef;

  constructor(
    private afFirestore: AngularFirestore,
    public  dialog: MatDialog,
    public iconRegistry: MatIconRegistry,
    public router: Router,
    public deleteDialog: MatDialog,
    public authenticationService: AuthenticationService,
    private profileTypeFinder: ProfileTypeFinderService,
    private coachFinderService: CoachFinderFirestoreService,
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

    this.profileTypes = this.profileTypeFinder.getTypes();
    this.coaches = this.coachFinderService.getCoaches();

    this.adminRef = this.authenticationService.user;
    this.subscriptions.push(
      this.adminRef.subscribe(u => {
        this.admin = u;
      })
    );

    this.clientCollection = this.afFirestore.collection<AppUser>(
      'users', ref => ref.where('profileType', '==', 'Client')
                         .where('deleted', '==', false)
    );
    this.clients = this.clientCollection.valueChanges();

    this.coachAgentsCollection = this.afFirestore.collection<AppUser>(
      'users', ref => ref.where('profileType', '==', 'Coach Agent')
                         .where('deleted', '==', false)
    );
    this.coachAgents = this.coachAgentsCollection.valueChanges();

    this.subscriptions.push(
      this.coachAgents.subscribe(a => this.coachAgentsList = a)
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  changePassword() {
    this.authenticationService.changePassword(this.password.nativeElement.value);
  }

  openDeleteREDialog(refNumber: string, id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      'title': refNumber, 'id': id
    };
    const dialogRef = this.deleteDialog.open(DeleteConfimrComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let coachesArray: Coach[];
        this.subscriptions.push(
          this.coachFinderService.getCoaches().subscribe(coaches => {
            coachesArray = coaches;
            const coach = coachesArray.filter(element => element.id === id)[0];
            if (coach) {
              coach.deleted = true;
              this.coachFinderService.updateCoach(coach);
            }
          })
        );
      }
    });
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

  getCoachAgentNameByUid(coachAgent: string) {
    if (this.coachAgentsList) {
      const found = this.coachAgentsList.find(u => u.uid === coachAgent);
      if (found) {
        return found.displayName;
      }
    }
  }

  showUserDetail(user: AppUser) {
    const dialogRef = this.dialog.open(UserInfoDialogComponent, {
      width: '40em',
      data: user
    });
  }

  showCreateDialog() {
    this.dialog.open(CoachAgentCreateDialogComponent, {
      width: '40em',
    });
  }

  goToProfileInfo() {
    this.router.navigate(['/profile-info']);
  }

  goToNewRE() {
    this.router.navigate(['/coach-form/ 0']);
  }
}
