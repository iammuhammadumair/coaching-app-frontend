import { Component, OnInit } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { CoachFinderFirestoreService } from '../services/coach-finder-firestore.service';
import { AuthenticationService } from '../services/authentication.service';
import { Coach } from '../models/Coach';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coach-agents-profile',
  templateUrl: './coach-agents-profile.component.html',
  styleUrls: ['./coach-agents-profile.component.css']
})
export class CoachAgentsProfileComponent implements OnInit {

  userRef: Observable<AppUser | null>;
  user?: AppUser;
  firstname: string;
  selectedCoach: CoachAgentsProfileComponent;
  coachRef: Observable<Coach[]>;
  coaches: Coach[];
  clients: Observable<AppUser[]>;
  role;
  coachAgent;
  coachAgentId = this.activatedRoute.snapshot.params.caId;

  constructor(
    private afFirestore: AngularFirestore,
    private coachFinderService: CoachFinderFirestoreService,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authenticationService.user.subscribe(us => {
      if (us) {
        this.user = us;
        this.role = (us && us.profileType ? us.profileType.toLocaleLowerCase() : '');
        if (this.role !== 'admin') {
          return;
        }
        this.init();
      }
    });
  }

  receiveCoach($event) {
    if ($event) {
      this.selectedCoach = $event;
    }
  }

  async init() {

    const coachAgent = await this.afFirestore.collection(
      'users', ref => ref.where('uid', '==', this.coachAgentId)
    ).get().toPromise();
    if (coachAgent.docs && coachAgent.docs.length) {
      this.coachAgent = coachAgent.docs[0].data();
    } else {
      return;
    }

    this.firstname = this.coachAgent.firstname;

    // coaches
    this.coachRef = this.coachFinderService.getCoachesByCoachAgent(this.coachAgent);
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
                          .where('coachAgent', '==', this.coachAgent.uid)
                          .where('sponsored', '==', true)
    ).valueChanges();
  }
}
