import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard as AuthGuard } from './services/auth.guard';
import { PageNotFoundComponent } from './components/public/page-not-found/page-not-found.component';
import { WhoWeAreComponent } from './components/public/who-we-are/who-we-are.component';
import { WhatWeDoComponent } from './components/public/what-we-do/what-we-do.component';
// import { ContactUsComponent } from './components/public/contact-us/contact-us.component';
import { PrivacyComponent } from './components/public/privacy/privacy.component';
import { ConditionComponent } from './components/public/condition/condition.component';
import { PublicHomeComponent } from './components/public/public-home/public-home.component';
import { SignUpComponent } from './components/public/sign-up/sign-up.component';
import { SignInComponent } from './components/public/sign-in/sign-in.component';
import { WelcomeComponent } from './components/auth/welcome/welcome.component';
import { ClientsComponent } from './components/auth/registeredclients/clients/clients.component';
import { UnauthorizedUserComponent } from './components/public/unauthorized-user/unauthorized-user.component';
import { CoachFormComponent } from './components/auth/coachadmins/coach-form/coach-form.component';
import { UserProfileComponent } from './components/auth/coachadmins/user-profile/user-profile.component';
import { HomeAdminsComponent } from './components/auth/admins/home-admins/home-admins.component';
import { AccountInfoComponent } from './components/auth/shared/account-info/account-info.component';
import { ProfileInfoComponent } from './components/auth/shared/profile-info/profile-info.component';
import { UnauthorizedComponent } from './components/public/unauthorized/unauthorized.component';
import { CoachShowPopupComponent } from './components/public/coach-show-popup/coach-show-popup.component';
import { PARAM_COACH_USERNAME } from './app-routing-constants';
// import { AboutUsComponent } from './about-us/about-us.component';
import { ClientCalendarComponent } from './components/public/client-calendar/client-calendar.component';
import { TimelineComponent } from './timeline/timeline.component';
import { SessionComponent } from './session/session.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { MangoTcComponent } from './mango-tc/mango-tc.component';
import { LogsComponent } from './logs/logs.component';
import { CoachAgentsProfileComponent } from './coach-agents-profile/coach-agents-profile.component';
import { CalendarRedirectComponent } from './calendar-redirect/calendar-redirect.component';
import { ClientVideosComponent } from './components/auth/client-videos/client-videos.component';
// import { VideosComponent } from './components/public/videos/videos.component';
import { ManageBlogComponent } from './components/auth/manage-blog/manage-blog.component';
import { BlogComponent } from './components/public/blog/blog.component';
import { BlogDetailsComponent } from './components/public/blog-details/blog-details.component';
import { ManageBlogTitleComponent } from './components/auth/manage-blog-title/manage-blog-title.component';
import { ClientDashboardComponent } from './components/auth/client-dashboard/client-dashboard.component';
const routes: Routes = [

  // { path: 'admin', loadChildren:()=> import('../app/components/auth/admin.module')
  // .then(mod=>mod.AdminModule)},

  {
    path: 'public', loadChildren: () => import('../app/components/public/public.module')
      .then(mod => mod.PublicModule)
  },
   {
    path: 'partner', loadChildren: () => import('../app/components/partner/partner.module')
      .then(mod => mod.PartnerModule)
  },
  { path: 'home', component: PublicHomeComponent },
  { path: 'jobs', component: WhoWeAreComponent },
  { path: 'about-and-contact', component: WhatWeDoComponent },
  // { path: 'probono-coaching', component: ContactUsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms-conditions', component: ConditionComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signin/:click', component: SignInComponent },
  { path: 'signout', component: SignInComponent },
  { path: 'unauthorized-user', component: UnauthorizedUserComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  // { path: 'nlp', component: AboutUsComponent },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'my-profile', component:ClientDashboardComponent,canActivate:[AuthGuard]},
  { path: 'welcome/:calendar', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'account', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'account-info', component: AccountInfoComponent, canActivate: [AuthGuard] },
  { path: 'profile-info', component: ProfileInfoComponent, canActivate: [AuthGuard] },
  { path: 'coach-form/:refNum', component: CoachFormComponent, canActivate: [AuthGuard] },
  { path: 'admin-page', component: HomeAdminsComponent, canActivate: [AuthGuard] },
  { path: `coach/:${PARAM_COACH_USERNAME}`, component: CoachShowPopupComponent },
  { path: `client-nlpcoach/:${PARAM_COACH_USERNAME}`, component: CoachShowPopupComponent },
  { path: `client-calendar`, component: ClientCalendarComponent },
  { path: `calendar-redirect`, component: CalendarRedirectComponent },
  { path: `timeline/:client`, component: TimelineComponent },
  { path: `session/:bookingId`, component: SessionComponent },
  { path: `payment-details`, component: PaymentDetailsComponent },
  { path: `mangoTC`, component: MangoTcComponent },
  { path: `logs/:coachId`, component: LogsComponent },
  { path: `caProfile/:caId`, component: CoachAgentsProfileComponent },
  { path: `add-videos`, component: ClientVideosComponent, canActivate: [AuthGuard] },
  // { path: `nlpvideos`, component: VideosComponent },
  { path: `manage-blog`, component: ManageBlogComponent, canActivate: [AuthGuard] },
  // { path: `blog`, component: BlogComponent },
  // { path: `blog-details`, component: BlogDetailsComponent },
  { path: `BlogPageTitle`, component: ManageBlogTitleComponent, canActivate: [AuthGuard] },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
