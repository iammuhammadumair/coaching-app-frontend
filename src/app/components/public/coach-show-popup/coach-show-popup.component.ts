import {
  Component,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  DomSanitizer,
  SafeResourceUrl,
} from "@angular/platform-browser";
import {
  ActivatedRoute,
  Router,
} from "@angular/router";
import { environment } from "../../../../environments/environment";
import enableInlineVideo from "iphone-inline-video";
import * as moment from "moment-timezone";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AddCardComponent } from "src/app/add-card/add-card.component";
import { SelectPaymentComponent } from "src/app/select-payment/select-payment.component";
import {
  AlertDialogComponent,
} from "src/app/alert-dialog/alert-dialog.component";
import { CalendarService } from "src/app/calendar.service";
import {
  GuestBookingComponent,
} from "src/app/guest-booking/guest-booking.component";
import { MangopayService } from "src/app/mangopay.service";
import { AppUser, countriesList } from "src/app/models/AppUser";
import { Booking } from "src/app/models/Booking";
import { Coach } from "src/app/models/Coach";
import { Rating } from "src/app/models/Rating";
import {
  ReviewsDialogComponent,
} from "src/app/reviews-dialog/reviews-dialog.component";
import { AuthenticationService } from "src/app/services/authentication.service";
import {
  FreeIntakeRequestService,
} from "src/app/services/free-intake-request.service";

import { PARAM_COACH_USERNAME } from "../../../app-routing-constants";
import {
  CoachFinderFirestoreService,
} from "../../../services/coach-finder-firestore.service";
import { ContactService } from "../../../services/contact.service";
import {
  BookingCalendarDialogComponent,
} from "../booking-calendar/components/booking-calendar-dialog/booking-calendar-dialog.component";
import { Logs } from "src/app/models/logs";

@Component({
  selector: 'app-coach-show-popup',
  templateUrl: './coach-show-popup.component.html',
  styleUrls: ['./coach-show-popup.component.css']
})
export class CoachShowPopupComponent implements OnInit, OnDestroy {
 
  logs : Logs = new Logs()
  // logs:Logs
  coach: Coach;
  city: string;
  address: string;
  coachVideoUrl: SafeResourceUrl;
  ratings;
  cards = [];
  continent;
  canBookFreeSession;
  reviewsCollection: Observable<Array<Rating>>;
  reviews: Observable<Array<Rating>>;
  user: AppUser;
  isClient: boolean;
  coach$: Observable<Coach>;
  private ngOnDestroy$ = new EventEmitter<boolean>();
  private readonly dialogRef: MatDialogRef<CoachShowPopupComponent>;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data,
    private afFirestore: AngularFirestore,
    private authenticationService: AuthenticationService,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private injector: Injector,
    private reFinderFirestoreService: CoachFinderFirestoreService,
    public router: Router,
    private dialog: MatDialog,
    public contactService: ContactService,
    public FreeIntakeService: FreeIntakeRequestService,
    private af: AngularFirestore,
    private calendar: CalendarService,
    private mango: MangopayService,
    public snackbar: MatSnackBar,

  ) {
    this.dialogRef = this.injector.get<MatDialogRef<CoachShowPopupComponent>>(MatDialogRef, null);
  }

  private prepareCoachData(coach: Coach) {
    if (coach) {
      this.coach = coach;
      this.initUser();
      this.address = coach.address + ' ' + coach.zipCode + ' ' + coach.country;
      if (coach.coachVideoUrl) {
        this.coachVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          coach.coachVideoUrl.replace('"', '')
        );
        setTimeout(() => {
          const video = document.querySelector('video');
          enableInlineVideo(video);
        }, 1000);
      }
    }
  }

  initUser() {
    const userRef = this.authenticationService.user;
    userRef.subscribe(user => {
      this.user = user;
      if (user && user.profileType && user.profileType.toLocaleLowerCase() === 'client') {
        this.isClient = true;
      } else {
        this.isClient = false;
      }
      this.initFreeBooking(user);

    });
  }

  async ngOnInit() {
    const coachUsername = this.route.snapshot.params[PARAM_COACH_USERNAME];
    const coach = await this.reFinderFirestoreService.getCoachFromUsername(coachUsername);
    this.prepareCoachData(coach);
    this.getCoachRating(coach);
    this.getCoachReviews();
  }
  
  ngAfterViewInit() {
 
    setTimeout(() => {
      this.saveLogs();
    }, 3000);
  }
  async initFreeBooking(user) {
    if (!user || !user.id || !this.coach || !this.coach.id) {
      return;
    }
    const bookings = await this.afFirestore.collection<Booking>('bookings', ref => ref
      .where('client', '==', user.uid)
      .where('coach', '==', this.coach.id)
    ).get().toPromise();
    if (bookings.docs && bookings.docs.length) {
      this.canBookFreeSession = false;
    } else {
      this.canBookFreeSession = true;
    }
  }

  getCoachRating(coach) {
    this.ratings = this.af.collection<Rating>(
      'ratings', ref => ref.where('coach', '==', coach.id)
    ).valueChanges();
  }

  getSum(a, b) {
    return { rate: a.rate + b.rate };
  }

  ngOnDestroy() {
    this.ngOnDestroy$.emit(true);
  }

  async close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      const path = window.location.pathname.split('/')[1];
      if (path === 'client-coach') {
        const coachUsername = this.route.snapshot.params[PARAM_COACH_USERNAME];
        const coach = await this.reFinderFirestoreService.getCoachFromUsername(coachUsername);
        this.router.navigateByUrl('/welcome?coach=' + coach.id);
      } else {
        this.router.navigateByUrl('/home');
      }
    }
  }

  openContactDialog() {
    this.contactService.openRequestInfo(this.coach, this.canBookFreeSession);
  }

  openFreeIntakeDialog() {
    this.FreeIntakeService.openFreeIntakeRequest(this.coach, this.canBookFreeSession);
  }

  get isNoMultimediaToDisplay() {
    return !(this.coach.coachVideoUrl || this.coach.coachVideoUrl);
  }

  showReviews() {
    let width;
    if (window.innerWidth > 1200) {
      width = '70%';
    } else if (window.innerWidth > 800) {
      width = '60%';
    } else {
      width = '90%';
    }
    const dialogRef = this.dialog.open(ReviewsDialogComponent, {
      data: { coach: this.coach },
      width: width
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dialogRef.close(res);
      }
    });
  }
  openFile() {
    window.open(this.coach.coachCV);
  }

  getCoachReviews() {
    this.reviewsCollection = this.afFirestore.collection<Rating>(
      'ratings', ref => ref.where('coach', '==', this.coach.id)
    ).valueChanges();
    this.reviews = this.reviewsCollection.pipe(map(ratings => {
      return ratings.map(rating => {
        rating['date'] = this.getDateDifference(rating.created);
        return rating;
      });
    }));
  }

  getDateDifference(created) {
    const jsCreated = this.calendar.getJsDateFromTimestampDate(created);
    const now = moment();
    const momentCreated = moment(jsCreated);
    const daysDiff = now.diff(momentCreated, 'days');

    if (daysDiff > 0) {
      return `${daysDiff} days ago`;
    }
    const hoursDiff = now.diff(momentCreated, 'hours');
    if (hoursDiff > 0) {
      return `${hoursDiff} hours ago`;
    }
    return `A moment ago`;
  }

  openCalendar(type) {

    // if(this.user)
    // this.searchForContinent(this.user.countryOfResidence);
    if (this.user) {
      if (this.user.sponsored === true ||this.user.mangoCardId !== "") {
        this.showSchedulePopup(type);
      }
      else {
        this.showSelectPaymentPopup()
      }
    }
    else {
      this.showGuestSchedulePopup();
    }


    // if (this.user && this.user.mangoCardId) {
    //   this.showSchedulePopup(type);
    // } else if (this.user && this.user.sponsored == true) {
    //   this.showSchedulePopup(type);
    // } else if (this.user && this.user.mangoCardId === "") {// && this.continent === 'Europe'
    //   this.showAddCardPopupMessage();
    // // } else if(this.user && this.continent !== 'Europe'){
    //   // this.showSchedulePopup(type);
    // } else {
    //   this.showGuestSchedulePopup();
    // }
  }

  showAddCardPopupMessage() {
    let title = 'Plesae add Payment Details to schedule a session.';
    this.dialog.open(AlertDialogComponent, {
      data: {
        title: title,
        closeText: 'OK'
      }

    }).afterClosed().subscribe(res => {
      this.showAddCardPopup();
    });


  }

  searchForContinent(countryCode) {
    let countryObject = countriesList.find(x => x.code === countryCode)
    this.continent = countryObject.cname;
  }

  openSchedulePopup(type) {

    const { user } = this;

    const { paymentMethod } = environment;

    if (user.paymentType === 'mangopay') {

      if (user.mangoCardId) this.showSchedulePopup(type);

      else if (user.mangoCardId === "") this.showAddCardPopupMessage();

    }
    else if (user.paymentType === 'paypal' && paymentMethod.paypal) {
      this.showSchedulePopup(type);
    }
  }


  showAddCardPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (window.innerWidth > 1200) {
      dialogConfig.width = '40%';
    } else if (window.innerWidth > 800) {
      dialogConfig.width = '60%';
    } else {
      dialogConfig.width = '90%';
    }
    dialogConfig.data = {
      coach: this.coach,
      user: this.user
    };
    const dialogRef = this.dialog.open(AddCardComponent, dialogConfig);
    dialogRef.afterClosed();
  }

  showSelectPaymentPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (window.innerWidth > 1200) {
      dialogConfig.width = '40%';
    } else if (window.innerWidth > 800) {
      dialogConfig.width = '60%';
    } else {
      dialogConfig.width = '90%';
    }
    dialogConfig.data = {
      coach: this.coach,
      user: this.user
    };
    const dialogRef = this.dialog.open(SelectPaymentComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(data => data && this.openSchedulePopup('paid'))

  }

  showGuestSchedulePopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (window.innerWidth > 1200) {
      dialogConfig.width = '70%';
    } else if (window.innerWidth > 800) {
      dialogConfig.width = '60%';
    } else {
      dialogConfig.width = '90%';
    }
    dialogConfig.data = {
      coach: this.coach
    };
    const dialogRef = this.dialog.open(GuestBookingComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'signin') {
        // this.dialogRef.close();
        this.router.navigate(['/signin']);
      } else if (res === 'signup') {
        // this.dialogRef.close();
        this.router.navigate(['/signup']);
      }
    });
  }

  showSchedulePopup(type) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (window.innerWidth > 1200) {
      dialogConfig.width = '70%';
    } else if (window.innerWidth > 800) {
      dialogConfig.width = '60%';
    } else {
      dialogConfig.width = '90%';
    }
    dialogConfig.data = {
      coach: this.coach,
      type: type,
      continent: this.continent
    };
    const dialogRef = this.dialog.open(BookingCalendarDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dialogRef.close(res);
      }
    });
  }
  saveLogs(){
     this.logs.coachEmail =this.coach.email;
     this.logs.coachId = this.coach.id;
     this.logs.coachName = this.coach.coachName;
     this.logs.coachEmail = this.coach.email;
     this.logs.userId = this.user?.uid || '';
     this.logs.userName = this.user?.displayName ||'';
     this.logs.userEmail = this.user?.email;
     this.logs.eventClick= 'Coach '+ this.coach.coachName +' profile View by '+ this.user?.displayName;
     this.logs.clickDate = new Date();
     this.contactService.saveLogs(this.logs)
    }

}
