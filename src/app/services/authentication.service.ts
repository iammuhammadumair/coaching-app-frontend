import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AppUser } from '../models/AppUser';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, switchMap, filter, take, reduce } from 'rxjs/operators';
// import * as firebase from 'firebase/app';
import  firebase from 'firebase/app';
import firestore = firebase.firestore;
import auth = firebase.auth;
import { environment } from 'src/environments/environment';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private user$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  app2 = firebase.initializeApp(environment.firebase, Math.random().toString(36).substring(2, 15));

  /**
   * Class constructor that takes the 4 parameters for its initialiyation:
   * AngularFireAuth service
   * AngularFirestore database
   * AngularFireStorage cdn
   * Angular Router in order to redirect to the correct page after each method
   *
   * @param afAuth angularFirebase2 Authentication
   * @param afFirestore angularFirebase2 Firestore
   * @param router amgular Router
   */
  constructor(
    private afAuth: AngularFireAuth,
    private afFirestore: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afFirestore.doc<AppUser>(`users/${user.uid}`).valueChanges().pipe(
            map(AppUser.from)
          );
        } else {
          return of(null);
        }
      })
    ).subscribe(user => {
      this.user$.next(user);
    });
  }

  get user() {
    return this.user$.asObservable();
  }

  get _user() {
    return this.user$.asObservable();
  }

  get _userValue() {
    return this.user$.getValue();
  }

  /**
   * This method allows to SignUp an anonymous user with Email and Password
   * @param email   email used to identifz the customer
   * @param password password
   */
  signUpWithEmailAndPassword(appUser: AppUser, password: string) {
    // return this.afAuth.auth
      return this.afAuth
      .createUserWithEmailAndPassword(appUser.email, password)
      .then(authResult => {
        // Mapping Firebase user with App AppUser
        appUser.uid = authResult.user.uid;
        appUser.email = authResult.user.email;
        appUser.displayName = authResult.user.displayName;
        appUser.photoURL = authResult.user.photoURL;
        appUser.bookmarks = [];
        appUser.requests = [];
        appUser.offers = [];
        appUser.timezone = moment.tz.guess(true);

        this.updateUserData(appUser);    // create initial user document
        this.sendVerificationEmailOnSignUp(appUser);
        this.user.pipe(
          filter(user => !!user),
          take(1)
        ).subscribe(() => this.router.navigate(['/welcome']));
      })
      .catch(error => this.handleError(error));
  }

  /**
   * This method allows to SignUp an anonymous user with Email and Password
   * @param email   email used to identifz the customer
   * @param password password
   */
  createCoachAgent(appUser: AppUser, password: string) {
    return this.app2.auth().createUserWithEmailAndPassword(appUser.email, password)
    .then(authResult => {
      // Mapping Firebase user with App AppUser
      appUser.uid = authResult.user.uid;
      appUser.email = authResult.user.email;
      appUser.displayName = authResult.user.displayName;
      appUser.photoURL = authResult.user.photoURL;
      appUser.bookmarks = [];
      appUser.requests = [];
      appUser.offers = [];
      appUser.timezone = moment.tz.guess(true);
    

      this.updateUserData(appUser);
      // create initial user document
      this.sendVerificationEmailOnSignUp(appUser);
    })
    .catch(error => this.handleError(error));
  }

 async sendVerificationEmailOnSignUp(appUser: AppUser) {
    // this.afAuth.auth.currentUser.reload();
     (await this.afAuth.currentUser).reload();
    console.log('sending confirmation email ...');
    const currentUser = this.afAuth.currentUser;
       (await currentUser).sendEmailVerification()
    .then(function () {
      console.log('email has been sent');
    })
    .catch(function (error) {
      console.error('something went wrong ' + error.message);
    });
  }

  signInWithEmailAndPassword(email: string, password: string, Calender?: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(authResult => {
        const db = firestore();
        const docRef = db.collection('users').doc(authResult.user.uid);
        docRef.get().then(doc => {
          if (doc.exists) {
            this.user.pipe(
              filter(user => !!user), take(1)
            ).subscribe(() => {
            if (Calender === 'calendar') {
                this.router.navigate(['/welcome', 'calendar']);
                return;
              }
                this.router.navigate(['/welcome']);
            }
            );
          }
        }).catch(function (error) {
          console.log('Error getting document:', error);
        });
      })
      .catch(error => this.handleError(error));
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  signInWithTwitter() {
    const provider = new auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  signInWithGithub() {
    const provider = new auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  signOut() {
    this.afAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/']);
      });
  }
  /**
   *
   * @param provider OAuth Provider Google | Twitter | Github
   */
  private oAuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((authResult) => {
        this.updateUserData(authResult.user);
        this.router.navigate(['/welcome']);
      })
      .catch(error => this.handleError(error));
  }

  /**
   *
   * @param user AppUser extended user 
   */
  updateUserData(user: AppUser) {
    const userRef: AngularFirestoreDocument<any> = this.afFirestore.doc(`users/${user.uid}`);

    const data: AppUser = {
      uid: user.uid,
      timezone: user.timezone ||'',
      email: user.email,
      coachAgent: user.coachAgent ? user.coachAgent : null,
      coach: user.coach ? user.coach : null,
      photoURL: user.photoURL,
      displayName: user.firstname + ' ' + user.lastname,
      enable: user.enable,
      confirmEmail: user.confirmEmail,
      deleted: user.deleted,
      profileType: user.profileType,
      firstname: user.firstname,
      lastname: user.lastname,
      telephone: user.telephone,
      websiteUrl: user.websiteUrl ? user.websiteUrl : null,
      gender: user.gender,
      birthDate: user.birthDate,
      address: user.address,
      bookmarks: user.bookmarks,
      requests: user.requests,
      offers: user.offers,
      privacy: user.privacy ? user.privacy : false,
      termAndCondition: user.termAndCondition ? user.termAndCondition : false,
      sponsored: !!user.sponsored,
      mangoUserId: user.mangoUserId || '',
      mangoCardId: user.mangoCardId || '',
      paymentGateway: user.paymentGateway || '',
      // paypalUserId: user.paypalUserId || '', 
      paymentType: user.paymentType || '', 
      // paypalNonce: user.paypalNonce || '',
      // paypalPayerId: user.paypalPayerId || '',
      paypalEmail: user.paypalEmail || '',
      countryOfResidence: user.countryOfResidence || '',
      nationality: user.nationality || '',
      coachAgentType: user.coachAgentType ? user.coachAgentType :'',


    };

    return userRef.set(data, { merge: true })
      .catch(error => this.handleError(error));
  }

  delete(uid: string) {
    this.afFirestore.doc('users/' + uid).update({
      deleted: true
    });

    alert('User Deleted');
  }

 async updateUser(user: AppUser, pwd: string): Promise<any> {
    if (pwd !== '') {
      const _auth = this.afAuth;
      const authUser = _auth.currentUser;
       return (await authUser).updatePassword(pwd).then(a => {
        this.router.navigate(['/welcome']);
      }).catch(error => this.handleError(error));
    }
  }

 async changePassword(pass) {
    const _auth = this.afAuth;
    const user = _auth.currentUser;

     (await user).updatePassword(pass).then(function () {
      alert('Password updated correctly');
    }).catch(function (error) {
      alert('Something went wrong');
    });
  }

  /**
   * If error, console log and notify user
   */
  private handleError(error) {
    console.error(error);
    if (error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
      error.message = 'We can not seem to find your account, please check your details? Or Sign up again';
      return error;
    }
    if (error.message !== '') {
      return error;
    }
  }

  getUserFromUid(uid: string): Observable<any> {
    const userRef: AngularFirestoreDocument<AppUser> = this.afFirestore.doc(`users/${uid}`);
    let obUser: Observable<AppUser>;
    obUser = userRef.valueChanges();
    return obUser;
  }
}
