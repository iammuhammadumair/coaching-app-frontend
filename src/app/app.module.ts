import {
  BrowserModule
} from '@angular/platform-browser';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
  NgModule, CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import {
  HttpClientModule
} from '@angular/common/http';

// Form module import
// import {
//   FormsModule,
//   ReactiveFormsModule
// } from '@angular/forms';

import {
  AppComponent
} from './app.component';

// Material Design: Navigation Controller

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio'

// Material Design:  Layout
// import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatExpansionModule
} from '@angular/material/expansion';
import {
  MatGridListModule
} from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';

// // Material Design:  Buttons & indicators
// import { MatButtonModule } from '@angular/material/button';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MatBadgeModule } from '@angular/material/badge';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatIconModule } from '@angular/material/icon';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// //import { MatRippleModule } from '@angular/material/core';


// Material Design:  Popups & Modals
import { MatDialogModule } from '@angular/material/dialog';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
// Material Design:  Data Tables
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatNativeDateModule } from '@angular/material/core';
import {
  LayoutModule
} from '@angular/cdk/layout';

// Flex-Layout
import {
  FlexLayoutModule
} from '@angular/flex-layout';

// Routing Module
import {
  AppRoutingModule
} from './app-routing.module';

import {
  AgmCoreModule
} from '@agm/core';
import {
  AgmSnazzyInfoWindowModule
} from '@agm/snazzy-info-window';

// Angularfire2 modules import
import {
  AngularFireModule
} from '@angular/fire';
import {
  AngularFireAuthModule
} from '@angular/fire/auth';
import {
  AngularFireDatabaseModule
} from '@angular/fire/database';

import {
  AngularFirestoreModule
} from '@angular/fire/firestore';
import {
  AngularFireStorageModule
} from '@angular/fire/storage';

import {
  environment
} from '../environments/environment';

// Owl Carousel
// import {
//   CarouselModule
// } from 'ngx-owl-carousel-o';

// Services
import {
  CoachFinderFirestoreService
} from './services/coach-finder-firestore.service';
import {
  AuthenticationService
} from './services/authentication.service';
import {
  SearchService
} from './services/search.service';

// UI Controllers
import {
  CoachCardComponent
} from './components/public/coach-card/coach-card.component';
import {
  SearchFormComponent
} from './components/public/search-form/search-form.component';
import {
  CoachShowPopupComponent
} from './components/public/coach-show-popup/coach-show-popup.component';
import {
  UserInfoDialogComponent
} from './components/public/user-info-dialog/user-info-dialog.component';

import {
  ListReComponent
} from './components/public/list-re/list-re.component';
import {
  DetailReComponent
} from './components/public/detail-re/detail-re.component';
import {
  PageNotFoundComponent
} from './components/public/page-not-found/page-not-found.component';
import {
  WhoWeAreComponent
} from './components/public/who-we-are/who-we-are.component';
import {
  WhatWeDoComponent
} from './components/public/what-we-do/what-we-do.component';
// import {
//   ContactUsComponent
// } from './components/public/contact-us/contact-us.component';
import {
  PublicHomeComponent
} from './components/public/public-home/public-home.component';
import {
  CoachCrudDialogComponent
} from './components/public/coach-crud-dialog/coach-crud-dialog.component';
import {
  FooterComponent
} from './components/footer/footer.component';
import {
  SignUpComponent
} from './components/public/sign-up/sign-up.component';
import {
  SignInComponent
} from './components/public/sign-in/sign-in.component';
import {
  SignOutComponent
} from './components/public/sign-out/sign-out.component';
import {
  RequestInformationComponent
} from './components/public/request-information/request-information.component';
import {
  UnauthorizedUserComponent
} from './components/public/unauthorized-user/unauthorized-user.component';

import {
  WelcomeComponent
} from './components/auth/welcome/welcome.component';
import {
  HomeAdminsComponent
} from './components/auth/admins/home-admins/home-admins.component';
import {
  HomeCoachAdminsComponent
} from './components/auth/coachadmins/home-coach-admins/home-coach-admins.component';
import {
  ClientsComponent
} from './components/auth/registeredclients/clients/clients.component';


// Pipes
import {
  UrlSafePipePipe
} from './pipes/url-safe-pipe.pipe';
import {
  PrizePipe
} from './pipes/prize.pipe';
import {
  PopupComponent
} from './components/public/popup/popup.component';
import {
  SymbolByCurrencyPipe
} from './pipes/symbol-by-currency.pipe';

// carousel
import {
  CarouselComponent
} from './components/public/carousel/carousel.component';
import {
  TileComponent
} from './components/public/tile/tile.component';
import {
  TilePopupComponent
} from './components/public/tile-popup/tile-popup.component';
import {
  BadgeComponent
} from './components/auth/registeredclients/badge/badge.component';
import {
  CoachFormComponent
} from './components/auth/coachadmins/coach-form/coach-form.component';
import {
  CoachDetailsComponent
} from './components/auth/coachadmins/coach-details/coach-details.component';
import {
  CoachListComponent
} from './components/auth/coachadmins/coach-list/coach-list.component';
import {
  CoachLastUpdateComponent
} from './components/auth/coachadmins/coach-last-update/coach-last-update.component';
import {
  UserProfileComponent
} from './components/auth/coachadmins/user-profile/user-profile.component';
import {
  PrivacyComponent
} from './components/public/privacy/privacy.component';
import {
  ConditionComponent
} from './components/public/condition/condition.component';
import {
  AccountInfoComponent
} from './components/auth/shared/account-info/account-info.component';
import {
  ProfileInfoComponent
} from './components/auth/shared/profile-info/profile-info.component';
import {
  DeleteConfimrComponent
} from './components/auth/shared/delete-confimr/delete-confimr.component';
import {
  DeleteUserComponent
} from './components/auth/shared/delete-user/delete-user.component';
import {
  UnauthorizedComponent
} from './components/public/unauthorized/unauthorized.component';
import {
  ServiceWorkerModule
} from '@angular/service-worker';
import {
  RequestFeedbackComponent
} from './components/public/request-feedback/request-feedback.component';
import {
  CoachDetailsSharedComponent
} from './components/shared/coach-details/coach-details-shared.component';
import {
  ThousandSeparatorPipe
} from './pipes/thousand-seperator.pipe';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
// import {
//   AboutUsComponent
// } from './about-us/about-us.component';
import {
  CoachAgentCreateDialogComponent
} from './components/public/coach-agent-create-dialog/coach-agent-create-dialog.component';
import {
  CoachAccountComponent
} from './components/public/coach-account/coach-account.component';
import {
  UpdateCoachDialogComponent
} from './update-coach-dialog/update-coach-dialog.component';
import {
  CoachCalendarComponent
} from './components/public/coach-calendar/coach-calendar.component';
// import {
//   NgbDatepickerModule,
//   NgbTimepickerModule, NgbModule
// } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbDatepickerModule,
  NgbTimepickerModule
} from '@ng-bootstrap/ng-bootstrap';
import {
  CoachSlotsComponent
} from './components/public/coach-calendar/components/coach-slots/coach-slots.component';
import {
  CoachCalendarDialogComponent
} from './components/public/coach-calendar/components/coach-calendar-dialog/coach-calendar-dialog.component';
import {
  BookingCalendarComponent
} from './components/public/booking-calendar/booking-calendar.component';
import {
  BookingCalendarDialogComponent
} from './components/public/booking-calendar/components/booking-calendar-dialog/booking-calendar-dialog.component';
import {
  SelectedDateDialogComponent
} from './components/public/booking-calendar/components/selected-date-dialog/selected-date-dialog.component';
import {
  ScheduleSuccessDialogComponent
} from './components/public/booking-calendar/components/schedule-success-dialog/schedule-success-dialog.component';
import {
  ClientCalendarComponent
} from './components/public/client-calendar/client-calendar.component';
import {
  ConfirmDeleteDialogComponent
} from './components/public/client-calendar/components/confirm-delete-dialog/confirm-delete-dialog.component';
import {
  ConfirmDialogComponent
} from './confirm-dialog/confirm-dialog.component';
import {
  BookingSlotsComponent
} from './components/public/booking-calendar/components/booking-slots/booking-slots.component';
import {
  ClientSlotsComponent
} from './components/public/client-calendar/components/client-slots/client-slots.component';
import {
  CoachDatepickerComponent
} from './components/public/coach-calendar/components/coach-datepicker/coach-datepicker.component';
import {
  CoachDatepickerInvertedComponent
} from './components/public/coach-calendar/components/coach-datepicker-inverted/coach-datepicker-inverted.component';
import {
  CoachSlotsInvertedComponent
} from './components/public/coach-calendar/components/coach-slots-inverted/coach-slots-inverted.component';
import {
  BookingDatepickerComponent
} from './components/public/booking-calendar/components/booking-datepicker/booking-datepicker.component';
import {
  BookingDatepickerInvertedComponent
} from './components/public/booking-calendar/components/booking-datepicker-inverted/booking-datepicker-inverted.component';
import {
  BookingSlotsInvertedComponent
} from './components/public/booking-calendar/components/booking-slots-inverted/booking-slots-inverted.component';
import {
  ClientDatepickerComponent
} from './components/public/client-calendar/components/client-datepicker/client-datepicker.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { TimelineComponent } from './timeline/timeline.component';
import { CreateNoteDialogComponent } from './create-note-dialog/create-note-dialog.component';
import { SessionComponent } from './session/session.component';
import { PublisherComponent } from './publisher/publisher.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { GuestBookingComponent } from './guest-booking/guest-booking.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { RatingDialogComponent } from './rating-dialog/rating-dialog.component';
import { ReviewsDialogComponent } from './reviews-dialog/reviews-dialog.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { AddCardComponent } from './add-card/add-card.component';
import { HeaderComponent } from './header/header.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
// import { PageHeaderComponent } from './page-header/page-header.component';
import { FormControlComponent } from './form-control/form-control.component';
// import { FormButtonComponent } from './form-button/form-button.component';
import { FormErrorComponent } from './form-error/form-error.component';
import { ContactComponent } from './contact/contact.component';
import { SidebarListComponent } from './sidebar-list/sidebar-list.component';
import { ContactFormDialogComponent } from './contact-form-dialog/contact-form-dialog.component';
import { MangoTcComponent } from './mango-tc/mango-tc.component';
import { LogsComponent } from './logs/logs.component';
import { CoachAgentsProfileComponent } from './coach-agents-profile/coach-agents-profile.component';
import { CalendarSyncComponent } from './calendar-sync/calendar-sync.component';
import { CalendarRedirectComponent } from './calendar-redirect/calendar-redirect.component';
import { ClientVideosComponent } from './components/auth/client-videos/client-videos.component';
// import { VideosComponent } from './components/public/videos/videos.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { ManageBlogComponent } from './components/auth/manage-blog/manage-blog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
// import { BlogComponent } from './components/public/blog/blog.component';
// import { BlogDetailsComponent } from './components/public/blog-details/blog-details.component';
import { RequestFreeIntakeComponent } from './components/public/request-free-intake/request-free-intake.component';
import { ManageBlogTitleComponent } from './components/auth/manage-blog-title/manage-blog-title.component';
import { ShareModuleModule } from './share-module/share-module.module';
import { AngularIbanModule } from 'angular-iban';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AddCardInPaypalComponent } from './add-card-in-paypal/add-card-in-paypal.component';
import { AddCardInMangopayComponent } from './add-card-in-mangopay/add-card-in-mangopay.component';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';
import { ClientDashboardComponent } from './components/auth/client-dashboard/client-dashboard.component';
import {CookieService} from 'ngx-cookie-service';
@NgModule({
  declarations: [
    AppComponent,
    CoachCardComponent,
    SearchFormComponent,
    CoachShowPopupComponent,
    ListReComponent,
    DetailReComponent,

    PageNotFoundComponent,
    WhoWeAreComponent,
    WhatWeDoComponent,
    // ContactUsComponent,
    PublicHomeComponent,

    CoachCrudDialogComponent,
    FooterComponent,
    SignUpComponent,
    SignInComponent,
    SignOutComponent,
    UnauthorizedUserComponent,

    WelcomeComponent,
    HomeAdminsComponent,
    HomeCoachAdminsComponent,
    ClientsComponent,

    UrlSafePipePipe,
    PrizePipe,
    PopupComponent,
    SymbolByCurrencyPipe,
    RequestInformationComponent,
    RequestFreeIntakeComponent,
    CarouselComponent,
    TileComponent,
    TilePopupComponent,
    BadgeComponent,
    CoachFormComponent,
    CoachDetailsComponent,
    CoachListComponent,
    CoachLastUpdateComponent,
    UserProfileComponent,
    TilePopupComponent,
    UserInfoDialogComponent,
    PrivacyComponent,
    ConditionComponent,
    AccountInfoComponent,
    ProfileInfoComponent,
    DeleteConfimrComponent,
    DeleteUserComponent,
    UnauthorizedComponent,
    RequestFeedbackComponent,
    CoachDetailsSharedComponent,
    ThousandSeparatorPipe,
    // AboutUsComponent,
    CoachAgentCreateDialogComponent,
    CoachAccountComponent,
    UpdateCoachDialogComponent,
    CoachCalendarComponent,
    ClientDatepickerComponent,
    CoachSlotsComponent,
    CoachCalendarDialogComponent,
    BookingCalendarComponent,
    BookingCalendarDialogComponent,
    SelectedDateDialogComponent,
    ScheduleSuccessDialogComponent,
    ClientCalendarComponent,
    ConfirmDeleteDialogComponent,
    ConfirmDialogComponent,
    BookingSlotsComponent,
    ClientSlotsComponent,
    CoachDatepickerInvertedComponent,
    CoachSlotsInvertedComponent,
    CoachDatepickerComponent,
    BookingDatepickerComponent,
    BookingDatepickerInvertedComponent,
    BookingSlotsInvertedComponent,
    AlertDialogComponent,
    PasswordResetComponent,
    TimelineComponent,
    CreateNoteDialogComponent,
    SessionComponent,
    PublisherComponent,
    SubscriberComponent,
    GuestBookingComponent,
    RatingDialogComponent,
    ReviewsDialogComponent,
    PaymentDetailsComponent,
    AddCardComponent,
    HeaderComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    // PageHeaderComponent,
    FormControlComponent,
    // FormButtonComponent,
    FormErrorComponent,
    ContactComponent,
    SidebarListComponent,
    ContactFormDialogComponent,
    MangoTcComponent,
    LogsComponent,
    CoachAgentsProfileComponent,
    CalendarSyncComponent,
    CalendarRedirectComponent,
    ClientVideosComponent,
    // VideosComponent,
    SubscribeComponent,
    ManageBlogComponent,
    // BlogComponent,
    // BlogDetailsComponent,
    ManageBlogTitleComponent,
    AddCardInPaypalComponent,
    AddCardInMangopayComponent,
    PaymentGatewayComponent,
    ClientDashboardComponent
  ],
  imports: [
    MatDialogModule,
    LazyLoadImageModule,
    AngularIbanModule,
    ShareModuleModule,
    AngularEditorModule,
    BrowserModule,
    // FormsModule,
    // ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule, MatMenuModule, MatSidenavModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule, MatSelectModule, MatRadioModule, MatSliderModule,
    // MatCardModule, 
    MatDividerModule, MatExpansionModule, MatGridListModule, MatListModule, MatStepperModule, MatTabsModule, MatTreeModule,
    // MatButtonModule, MatButtonToggleModule, MatBadgeModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
    // //MatRippleModule,
   //MatDialogModule,
    MatTooltipModule, MatSnackBarModule, MatBottomSheetModule,
    MatPaginatorModule, MatTableModule,
    MatNativeDateModule,

    AgmCoreModule.forRoot({
      // 'AIzaSyCZZux7VgMu54CxWTVabEVVurQwiOm0H4E',
      apiKey: environment.gcpApiKey,
      libraries: ['geometry', 'places']
    }),
    AgmSnazzyInfoWindowModule,
    MatGridListModule,
    LayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    // CarouselModule,
    // This is a still a beta feature, causing many issues like
    // videos not playing on safari
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    FontAwesomeModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    BarRatingModule
  ],
  providers: [
    CoachFinderFirestoreService,
    AuthenticationService,
    SearchService,
    CookieService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ContactFormDialogComponent,
    SubscribeComponent,
    CoachShowPopupComponent,
    CoachCrudDialogComponent,
    RequestInformationComponent,
    RequestFreeIntakeComponent,
    TilePopupComponent,
    UserInfoDialogComponent,
    PrivacyComponent,
    ConditionComponent,
    DeleteConfimrComponent,
    DeleteUserComponent,
    CoachAgentCreateDialogComponent,
    UpdateCoachDialogComponent,
    CoachCalendarDialogComponent,
    BookingCalendarDialogComponent,
    SelectedDateDialogComponent,
    ScheduleSuccessDialogComponent,
    ConfirmDeleteDialogComponent,
    ConfirmDialogComponent,
    AlertDialogComponent,
    PasswordResetComponent,
    CreateNoteDialogComponent,
    GuestBookingComponent,
    RatingDialogComponent,
    ReviewsDialogComponent,
    AddCardComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
