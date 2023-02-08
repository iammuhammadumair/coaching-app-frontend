import {
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  ActivatedRoute,
  Router,
} from "@angular/router";

import {
  Observable,
  Subscription,
} from "rxjs";
import { AppUser } from "src/app/models/AppUser";
import { Coach } from "src/app/models/Coach";
import { AuthenticationService } from "src/app/services/authentication.service";
import {
  CoachFinderFirestoreService,
} from "src/app/services/coach-finder-firestore.service";

import {
  specialtiesList,
} from "../../auth/coachadmins/coach-form/coach-form.component";
import {
  TilePopupComponent,
} from "../../public/tile-popup/tile-popup.component";

@Component({
  selector: "app-partner-title",
  templateUrl: "./partner-title.component.html",
  styleUrls: ["./partner-title.component.css"],
})
export class PartnerTitleComponent implements OnInit {
  @Input() uid: string;
  imageRE: string;
  show = false;
  dialogRef: MatDialogRef<TilePopupComponent>;
  coachRef: Observable<Coach>;
  coach: Coach;
  userRef: Observable<AppUser | null>;
  user?: AppUser;
  isClient: boolean;
  specialities: any;
  subscriptions: Array<Subscription> = [];
  sessionUser: Observable<AppUser | null>;
  role: string;
  path: string;
  requests?: string[];
  requestIcon = {
    clicked: { color: "myprimary", icon: "mail_outline" },
    defaultIcon: { color: "myaccent", icon: "email" },
    actual: { color: "myaccent", icon: "email", selected: false },
  };
  specialtiesList = specialtiesList;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private coachFinderFirestoreService: CoachFinderFirestoreService,
    private activatedRoute: ActivatedRoute,
    private coachFinderService: CoachFinderFirestoreService,
    private afFirestore: AngularFirestore
  ) {
    this.path = window.location.pathname.split("/")[1];
  }
  ngOnInit() {
    const defaultImage = "https://succeed.world/assets/images/logo_small.jpg";
    this.sessionUser = this.authenticationService.user;
    this.sessionUser.subscribe(
      (us) =>
        (this.role =
          us && us.profileType ? us.profileType.toLocaleLowerCase() : "")
    );

    this.coachRef = this.coachFinderFirestoreService.getCoachFromId(this.uid);
    this.subscriptions.push(
      this.coachRef.subscribe((coach) => {

          console.log(coach);
          this.imageRE =
            coach.coachImage && coach.coachImage !== ""
              ? coach.coachImage
              : this.getIcon();
          this.coach = { ...coach, id: this.uid };
          this.initCoachPopup();
          this.initIcons();
          this.specialities = this.coach.specialty;

      })
    );
    this.userRef = this.authenticationService.user;
    this.subscriptions.push(
      this.userRef.subscribe((user) => {
        this.user = user;
        this.isClient =
          user &&
          user.profileType &&
          user.profileType.toLocaleLowerCase() === "client"
            ? true
            : false;
        this.requests = user && user.requests ? user.requests : [];
        this.initIcons();
      })
    );
  }

  // async ngOnInit() {
  //   this.init();
  //   const defaultImage = "https://succeed.world/assets/images/logo_small.jpg";
  //   this.sessionUser = this.authenticationService.user;
  //   this.sessionUser.subscribe(
  //     (us) =>
  //       (this.role =
  //         us && us.profileType ? us.profileType.toLocaleLowerCase() : "")
  //   );

  //   // const coachAgent = await this.afFirestore.collection(
  //   //   'users', ref => ref.where('uid', '==', this.coach_id)
  //   // ).get().toPromise();
  //   // if (coachAgent.docs && coachAgent.docs.length) {
  //   //   this.coachAgent = coachAgent.docs[0].data();
  //   // } else {
  //   //   return;
  //   // }

  //   // this.coachRef = this.coachFinderService.getCoachesByCoachAgent(this.coachAgent);
  //   // this.subscriptions.push(
  //   //   this.coachRef(coach => {
  //   //     if (coach) {
  //   //       this.imageRE = coach.coachImage && coach.coachImage !== '' ? coach.coachImage : this.getIcon();
  //   //       this.coach = {...coach, id: this.uid};
  //   //       this.initCoachPopup();
  //   //       this.initIcons();
  //   //       this.specialities = this.coach.specialty;
  //   //     }
  //   //   })
  //   // );
  //   this.userRef = this.authenticationService.user;
  //   this.subscriptions.push(
  //     this.userRef.subscribe((user) => {
  //       this.user = user;
  //       this.isClient =
  //         user &&
  //         user.profileType &&
  //         user.profileType.toLocaleLowerCase() === "client"
  //           ? true
  //           : false;
  //       this.requests = user && user.requests ? user.requests : [];
  //       this.initIcons();
  //     })
  //   );
  // }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  get coachDetailsUrl() {
    const path = window.location.pathname;
    if (path === "/welcome") {
      return "/client-nlpcoach/" + this.coach.username;
    } else {
      return "/coach/" + this.coach.username;
    }
  }

  initIcons() {
    if (
      this.coach &&
      this.requests &&
      this.requests.toString().indexOf(this.coach.id) > -1
    ) {
      this.requestIcon.actual.icon = this.requestIcon.defaultIcon.icon;
      this.requestIcon.actual.selected = true;
    } else {
      this.requestIcon.actual.icon = this.requestIcon.clicked.icon;
      this.requestIcon.actual.selected = false;
    }
  }

  initCoachPopup() {
    const params = this.activatedRoute.snapshot.queryParams;
    if (params.coach && this.uid === params.coach) {
      this.showPopup();
    }
  }

  getIcon() {
    const random = Math.floor(Math.random() * 4) + 1;

    switch (random) {
      case 1: {
        return "https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/897b8a8d-9b25-4692-83e2-a490b192e626.jpeg";
      }
      case 2: {
        return "https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/378a6356-d5ae-40b6-8e29-c9a289d8347a.jpg";
      }
      case 3: {
        return "https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/LOTCASA%40.jpeg";
      }
      case 4: {
        return "https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/Grahamcasa.jpeg";
      }
    }
  }

  mouseEnter(ev: Event) {
    if (window.innerWidth > 736) {
      this.show = true;
    }
  }

  mouseLeave(ev: Event) {
    this.show = false;
  }

  goToCoach(ev: Event) {
    this.router.navigate([this.coachDetailsUrl]);
  }

  showPopup() {
    let width;
    if (window.innerWidth > 1200) {
      width = "30%";
    } else if (window.innerWidth > 800) {
      width = "40%";
    } else {
      width = "60%";
    }
    this.dialogRef = this.dialog.open(TilePopupComponent, {
      hasBackdrop: true,
      data: { coach: this.coach, source: "C" },
      panelClass: "custom-dialog-container",
      width: width,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.show = false;
    });
  }

  // New code added by hassan
  // async init() {
  //   const coachAgent = await this.afFirestore
  //     .collection("users", (ref) => ref.where("uid", "==", this.coachAgentId))
  //     .get()
  //     .toPromise();
  //   if (coachAgent.docs && coachAgent.docs.length) {
  //     this.coachAgent = coachAgent.docs[0].data();
  //   } else {
  //     return;
  //   }

  //   //this.firstname = this.coachAgent.firstname;

  //   // coaches
  //   this.coachRef = this.coachFinderService.getCoachesByCoachAgent(
  //     this.coachAgent
  //   );
  //   this.coachRef.subscribe((re) => {
  //     this.coaches = re;
  //     this.coaches.sort((a, b) => {
  //       if (!a.lastUpdate) {
  //         a.lastUpdate = 0;
  //       }
  //       if (!b.lastUpdate) {
  //         b.lastUpdate = 0;
  //       }
  //       return (
  //         new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
  //       );
  //     });
  //     if (this.coaches) {
  //       this.imageRE =
  //         this.coach.coachImage && this.coach.coachImage !== ""
  //           ? this.coach.coachImage
  //           : this.getIcon();
  //       this.coach = { ...this.coach, id: this.uid };
  //       this.initCoachPopup();
  //       this.initIcons();
  //       this.specialities = this.coach.specialty;
  //     }
  //     console.log(this.coaches);
  //   });
  //   // clients
  //   this.clients = this.afFirestore
  //     .collection<AppUser>("users", (ref) =>
  //       ref
  //         .where("profileType", "==", "Client")
  //         .where("coachAgent", "==", this.coachAgent.uid)
  //         .where("sponsored", "==", true)
  //     )
  //     .valueChanges();
  // }
}
