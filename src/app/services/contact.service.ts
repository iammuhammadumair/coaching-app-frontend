import { Injectable } from '@angular/core';
import { RequestInformationComponent } from '../components/public/request-information/request-information.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from './authentication.service';
import { Coach } from '../models/Coach';
import { take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Logs } from '../models/logs';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  FirebaseLogsCollectionRef: AngularFirestoreCollection;
  constructor(
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private afdb: AngularFirestore
  ) { }
saveLogs(logs:Logs){

    const log: Logs ={
      coachId : logs.coachId,
      coachName : logs.coachName,
      coachEmail: logs.coachEmail,
      userId : logs.userId ,
      userName : logs.userName,
      userEmail: logs.userEmail,
      eventClick: logs.eventClick,
      clickDate : logs.clickDate
    }
  console.log(logs)
  console.log("function call sdfsdf"+logs)
  // const activity= {
  //   name: logs
  // };
  this.afdb.collection('logs').add(log);
}
  openRequestInfo(coach: Coach, canBookFreeSession: boolean = false) {
    this.authenticationService.user.pipe(take(1)).subscribe(senderUser => {
      let width = '50%';
      if (window.innerWidth < 600) {
        width = '100%';
      }
      this.dialog.open(RequestInformationComponent, {
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
