import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
// Import Models
import { AppUser, countriesList } from '../../../models/AppUser';
import { Booking } from '../../../models/Booking';
// Import Services
import { AuthenticationService } from '../../../services/authentication.service';

import { Subscription,BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { PrivacyComponent } from '../privacy/privacy.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { distinctUntilChanged } from 'rxjs/operators';
import { MangopayService } from 'src/app/mangopay.service';
import * as moment from 'moment-timezone';
import { Coach } from 'src/app/models/Coach';
import { ValidatorService } from 'angular-iban';
import { BookingsService } from "src/app/services/bookings.service";

export function patternValidator(regex: RegExp, stringToCheck: string): boolean {
  // test the value of the control against the regexp supplied
  const valid = regex.test(stringToCheck);
  // if true, return no error (no error), else return error passed in the second parameter
  return valid ? true : false;
}
interface BankType {
  value: string;
  text: string;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {

  @ViewChild('signUpStepper') signUpStepper: MatHorizontalStepper;
  user: AppUser;
  bookings: Booking[] = [];
  bookingswithEmailOnly: Booking[] = [];
  saveError = '';
  location: { lat: number, lng: number };
  loading: boolean;
  isLinear = true;
  isSponsoredSelected: boolean;
  selectedGender: string;
  mapMessage = '';
  OtherAccount: boolean;
  validationMessages = {
    'email': {
      'required': 'Filling in this field is necessary to make our technology work for you.',
      'email': 'There seems to be a typo in your email address.'
    },
    'password': {
      'required':  'Filling in this field is necessary to make our technology work for you.',
      'pattern':   'For better protection, we ask you to include one letter and one number in your password',
      'minlength': 'Password must be at least 6 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
    'field': {
      'required': 'Filling in this field is necessary to make our technology work for you.'
    }
  };
  subscriptions: Subscription[] = [];
  mangoUser;
  cardRegistration;
  cardInfo;
  mangoBankAccount;
  mangoWallet;
  existingCoach;
  submitting : Boolean = false;
  showSubmitButton: Boolean = false;
  // paymentObject: Object = {};

 AccountType: BankType[] = [
    {value: 'IBAN', text: 'IBAN'},
    {value: 'OTHER', text:'OTHER'}
    // {value: 'US', text: 'US'},
    // {value: 'GB', text: 'GB'},
    // {value: 'CA', text:'CA'},
   ];
  profileInfoFormGroup = this.fb.group({
    coachAgentNameCtrl: [''],
    profileTypeCtrl: ['', [Validators.required]],
    firstnameCtrl: ['', [Validators.required]],
    lastnameCtrl: ['', [Validators.required]],
    birthdayCtrl: '',
    nationalityCtrl: '',
    countryOfResidenceCtrl: '',
    enable: Boolean,
    confirmEmail: Boolean,
    privacyCtrl: [false, [Validators.requiredTrue]]
  });
  accountInfoFormGroup = this.fb.group({
    emailCtrl: ['', [Validators.required, Validators.email]],
    passwordCtrl: ['', [Validators.required, Validators.minLength(6),
    Validators.maxLength(40)]],
    confirmPasswordCtrl: ['']
  });
  paymentDetailsFormGroup = this.fb.group({
    cardNumber: ['', Validators.required],
    cardExpirationDate: ['', Validators.required],
    cardCvx: ['', Validators.required]
  });
  bankingDetailsFormGroup = this.fb.group({
    PaypalEmail: ['', Validators.required],
    AccountNumber:["",Validators.required],
    Type: ["",Validators.required],
    BIC: '',
    IBAN: ['', ValidatorService.validateIban],
    OwnerName: ['', Validators.required],
    OwnerAddress: this.fb.group({
      AddressLine1: ['', Validators.required],
      AddressLine2: '',
      City: ['', Validators.required],
      Region: ['', Validators.required],
      PostalCode: ['', Validators.required],
      Country: ['', Validators.required]
    })
  });
  formTypes = [
    {value: 'sponsored', text: 'Company or Pro-bono Coaching'},
    {value: 'regular', text: 'Select if you would like to book a Coach'},
    {value: 'coach', text: 'Select if are signing up as a Coach'}
  ];

  countries = countriesList;
  continent;
  observableProfile$;

  constructor(
    private afFirestore: AngularFirestore,
    private fb: FormBuilder,
    public authenticationService: AuthenticationService,
    public snackbar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private mangoPay: MangopayService,
    private bookingsService: BookingsService,
    ) {
      this.observableProfile$ = new BehaviorSubject<any>(this.profileInfoFormGroup.controls)
    }



//   private loadExternalScript(scriptUrl: string) {
//     return new Promise((resolve, reject) => {
//       const scriptElement = document.createElement('script')
//       scriptElement.src = scriptUrl
//       scriptElement.onload = resolve
//       document.body.appendChild(scriptElement)
//   })
// }
    // ngAfterViewInit():void {
    //   this.loadExternalScript("https://www.paypalobjects.com/js/external/api.js").then(() => {
    //     window['paypal']['use']( ['login'], function (login) {
    //       login.render ({
    //         "appid":"AYbq8tIvOV3o3xc4GFxM9H6gbTkpBpveKweOh_E0_ETWbjt0G6TtE0mFwiaW6IuMqRRSkDNKqCDMzV5s",
    //         "scopes":"openid email",
    //         "containerid":"connectViaPayPal",
    //         "responseType":"code",
    //         "authend": "sandbox",
    //         "locale":"en-us",
    //         "buttonType":"LWP",
    //         "buttonShape":"pill",
    //         "buttonSize":"lg",
    //         "fullPage":"true",
    //         "returnurl":"https://google.com/"
    //       });
    //     });
    //   });
    // }


    // loadPayPal(){
    //   this.loadExternalScript("https://www.paypalobjects.com/js/external/api.js").then(() => {
    //     window['paypal']['use']( ['login'], function (login) {
    //       login.render ({
    //         "appid":"AYbq8tIvOV3o3xc4GFxM9H6gbTkpBpveKweOh_E0_ETWbjt0G6TtE0mFwiaW6IuMqRRSkDNKqCDMzV5s",
    //         "scopes":"openid email",
    //         "containerid":"connectViaPayPal",
    //         "responseType":"code",
    //         "authend": "sandbox",
    //         "locale":"en-us",
    //         "buttonType":"LWP",
    //         "buttonShape":"pill",
    //         "buttonSize":"lg",
    //         "fullPage":"true",
    //         "returnurl":"https://google.com/"
    //       });
    //     });
    //   });
    // }

  ngOnInit() {
    this.buildFormAccountInfo();
    this.buildFormProfileInfo();
    this.onChanges();
  }

  onChanges(): void {
    this.profileInfoFormGroup.valueChanges.subscribe(val => {
      if(val.countryOfResidenceCtrl){
        this.searchForContinent(val.countryOfResidenceCtrl)
        // this.loadPayPal();
      }
    });
  }



  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  get account() { return this.accountInfoFormGroup.controls; }
  get profile() { return this.profileInfoFormGroup.controls; }
  get payment() { return this.paymentDetailsFormGroup.controls; }
  get banking() { return this.bankingDetailsFormGroup.controls; }
  get ownerAddress() { return (this.banking.OwnerAddress as FormGroup).controls; }

  private buildFormAccountInfo(): void {
    this.subscriptions.push(
      this.accountInfoFormGroup.valueChanges.subscribe(field => {
        if (field.passwordCtrl !== field.confirmPasswordCtrl) {
          this.account.confirmPasswordCtrl.setErrors({ mismatch: true });
        } else {
          this.account.confirmPasswordCtrl.setErrors(null);
        }
        if (!patternValidator(/[A-Za-z]/, field.passwordCtrl)) {
          this.account.passwordCtrl.setErrors({ pattern: true });
        }
        if (!patternValidator(/[0-9]/, field.passwordCtrl)) {
          this.account.passwordCtrl.setErrors({ pattern: true });
        }
      })
    );
  }




  searchForContinent(countryCode) {
    let countryObject = countriesList.find(x => x.code === countryCode)
    this.continent = countryObject.cname;
  }

  buildFormProfileInfo() {
    this.subscriptions.push(
      this.profileInfoFormGroup.valueChanges.pipe(
        distinctUntilChanged()
      ).subscribe(field => {
        if (field.privacyCtrl === false) {
          this.profile.privacyCtrl.setErrors({ required: true });
        } else {
          this.profile.privacyCtrl.setErrors(null);
        }
      }),
      this.profileInfoFormGroup.get('profileTypeCtrl').valueChanges.pipe(
        distinctUntilChanged()
      ).subscribe(profileType => {
        this.isSponsoredSelected = profileType === 'sponsored';
        this.setFormValidation(profileType);
      }),
    );
     this.bankingDetailsFormGroup.get("Type").valueChanges.pipe(distinctUntilChanged())
    .subscribe((AccountType)=>{
      this.OtherAccount = AccountType ==="OTHER";
    });
  }

  setFormValidation(profileType: string) {
    if (profileType === 'coach' || profileType === 'regular') {
      this.addRequiredValidator(this.profile.birthdayCtrl);
      this.addRequiredValidator(this.profile.nationalityCtrl);
      this.addRequiredValidator(this.profile.countryOfResidenceCtrl);
    } else {
      this.removeValidators(this.profile.birthdayCtrl);
      this.removeValidators(this.profile.nationalityCtrl);
      this.removeValidators(this.profile.countryOfResidenceCtrl);
    }
    if (profileType === 'sponsored') {
      this.addRequiredValidator(this.profileInfoFormGroup.get('coachAgentNameCtrl'));
    } else {
      this.removeValidators(this.profileInfoFormGroup.get('coachAgentNameCtrl'));
    }
  }

  addRequiredValidator(formControl: AbstractControl) {
    formControl.setValidators([Validators.required]);
  }

  removeValidators(formControl: AbstractControl) {
    formControl.reset();
    formControl.clearValidators();
    formControl.updateValueAndValidity();
  }

  // paymentUpdate(object) {
  //   this.paymentObject = object;
  //   this.submitting = true;

  //   this.onSignUpFormSubmit();
  // }

  async onSignUpFormSubmit() {
    //  verify that all data are present and submit calling the AuthenticationService method signUpWithEmailAndPassword
    this.saveError = '';
    this.submitting = true;
    if (this.accountInfoFormGroup.invalid || this.profileInfoFormGroup.invalid) {
      this._markAsDirty(this.accountInfoFormGroup);
      this._markAsDirty(this.profileInfoFormGroup);
      this.snackbar.open('Error on save. Check the form value', 'Close', {
        duration: 3000,
      });
      this.submitting = false;
      return;
    }

    switch (this.profileInfoFormGroup.get('profileTypeCtrl').value) {
      case 'sponsored': {
        this.createSponsoredClient();
        break;
      }
      case 'regular': {
        this.createRegularClient({...this.buildUserFromForm(), profileType: 'Client'});
        break;
      }
      case 'coach': {
        this.findCoachEmail();
        break;
      }
      default: {
        this.submitting = false;
        return;
      }
    }
  }

  async findCoachEmail() {
    try {
      // Find the coach by the email that the user entered
      const data = await this.afFirestore.collection<Coach>(
        'coaches', ref => ref.where('email', '==', this.accountInfoFormGroup.get('emailCtrl').value)
      ).get().toPromise();
      if (data.docs && data.docs.length) {
        this.existingCoach = data.docs[0];
        this.createCoachUser();
      } else {
        this.snackbar.open('Coach not found', 'Close', {duration: 3000});
      }
    } finally {
      this.submitting = false;
    }
  }

  async createCoachUser() {
    try {
      // Create mangoPay user

      if(this.continent === 'Europe'){
        // this.paymentObject['paymentGateway'] = 'mangopay'
        if (!this.mangoUser) {
          this.mangoUser = await this.createMangoPayUser().toPromise();
          if (!this.mangoUser) {
            throw Error('Error creating mango user');
          }
        }
        // Create mangoPay bank account
        if (!this.mangoBankAccount) {
          const bankAccount = this.bankingDetailsFormGroup.getRawValue();
          bankAccount.BIC = bankAccount.BIC || undefined;
          this.mangoBankAccount = await this.mangoPay.createBankAccount(bankAccount, this.mangoUser.Id).toPromise();
          if (!this.mangoBankAccount) {
            throw Error('Error creating bank account');
          }
        }
          if (!this.mangoBankAccount && this.OtherAccount ) {
        const bankAccount = this.bankingDetailsFormGroup.getRawValue();
        delete bankAccount.Type;
        console.log(bankAccount);

        bankAccount.BIC = bankAccount.BIC || undefined;

        this.mangoBankAccount = await this.mangoPay
          .createOtherBankAccount(bankAccount, this.mangoUser.Id)
          .toPromise();
        if (!this.mangoBankAccount) {
          throw Error("Error creating bank account");
        }
      }
        // Create mangoPay wallet
        if (!this.mangoWallet) {
          const wallet = {Owners: [this.mangoUser.Id], Description: 'default wallet', Currency: 'EUR'};
          this.mangoWallet = await this.mangoPay.createWallet(wallet).toPromise();
          if (!this.mangoWallet) {
            throw Error('Error creating wallet');
          }
        }
      }


        this.snackbar.open('Thank you for signing up with us! Let’s make the magic happen.', 'Close', {duration: 3000});
      //  this.user = {...this.user, ...this.paymentObject}

      this.createClient({...this.buildUserFromForm(), coach: this.existingCoach.id, profileType: 'Coach'});
    } catch (e) {
      this.snackbar.open('Error Creating coach account', 'Close', {duration: 3000});
      console.log(e);
      this.snackbar.open('Error Creating coach account', 'Close', {duration: 3000});
    }
  }

  updateCoachPaypal(paypal) {
    if (!this.existingCoach) {
      this.submitting = false;
      return;
    }
    this.afFirestore.collection<Coach>(
      'coaches'
    ).doc(this.existingCoach.id).update(paypal);
    this.submitting = false;
  }

  updateCoachBankAccount(bankAccount) {
    if (!this.existingCoach) {
      this.submitting = false;
      return;
    }
    this.afFirestore.collection<Coach>(
      'coaches'
    ).doc(this.existingCoach.id).update({paymentGateway: 'mangopay',mangoBankAccountId: bankAccount.Id});
    this.submitting = false;
  }

  updateCoachWallet(mangoWallet) {
    if (!this.existingCoach) {
      this.submitting = false;
      return;
    }
    this.afFirestore.collection<Coach>(
      'coaches'
    ).doc(this.existingCoach.id).update({paymentGateway: 'mangopay',mangoWallet: mangoWallet.Id});
    this.submitting = false;
  }

  async createSponsoredClient() {
    // Find a coach agent user by name
    const data = await this.afFirestore.collection<AppUser>(
      'users', ref => ref.where('profileType', '==', 'Coach Agent')
                         .where('displayName', '==', this.profile.coachAgentNameCtrl.value)
    ).get().toPromise();
    if (data.docs && data.docs.length) {
      this.createClient({
        ...this.buildUserFromForm(),
        coachAgent: data.docs[0].id,
        profileType: 'Client'
      });
    } else {
      this.submitting = false;
      this.snackbar.open('Coach Agent not found', 'Close', {duration: 3000});
    }
  }

  async createRegularClient(user: AppUser) {
    try {

      // if(!Object.keys(this.paymentObject).length){

        // Create mango client
      //   if (!this.mangoUser) {
      //     this.mangoUser = await this.createMangoPayUser().toPromise();
      //     if (!this.mangoUser) {
      //       this.submitting = false;
      //       throw Error('Error creating mango user');
      //     }
      //   }

      //   // Create cardRegistration
      //   if (!this.cardRegistration) {
      //     this.cardRegistration = await this.mangoPay.createCardRegistration(this.mangoUser.Id).toPromise();
      //     if (!this.cardRegistration) {
      //       this.submitting = false;
      //       throw Error('Error creating the cardRegistration');
      //     }
      //   }

      //   // Send card info
      //   if (!this.cardInfo) {
      //     this.cardInfo = await this.mangoPay.postCardInfo(this.cardRegistration, {
      //       cardNumber: this.payment.cardNumber.value,
      //       cardExpirationDate: this.payment.cardExpirationDate.value,
      //       cardCvx: this.payment.cardCvx.value,
      //       cardType: 'CB_VISA_MASTERCARD'
      //     });
      //     if (!this.cardInfo || !this.cardInfo.RegistrationData) {
      //       this.submitting = false;
      //       throw Error('Error posting the card info');
      //     }
      //   }
      // } else {
      //   console.log(this.paymentObject,user)

        // user = {...user, ...this.paymentObject}
        // console.log(user)
      // }

      // Create appUser
      this.createClient(user);
      this.user = await this.getUser();
      this.bookings = await this.getBookings();
    } catch (e) {
      this.submitting = false;
      console.log(e);
    }
  }

  createMangoPayUser() {
    const profile = this.profileInfoFormGroup.getRawValue();
    const account = this.accountInfoFormGroup.getRawValue();
    return this.mangoPay.createNaturalUsers({
      'FirstName': profile.firstnameCtrl,
      'LastName': profile.lastnameCtrl,
      'Birthday': Number(moment(profile.birthdayCtrl).tz('UTC').format('X')),
      'Nationality': profile.nationalityCtrl,
      'CountryOfResidence': profile.countryOfResidenceCtrl,
      'Email': account.emailCtrl
    });
  }

  async createClient(user: AppUser) {
    // let paypal = {};
    // if(Object.keys(this.paymentObject).length){

    //   if (this.paymentObject['paypalEmail'] && this.paymentObject['paypalPayerId']) {
    //     paypal['paypalEmail'] = this.paymentObject['paypalEmail'];
    //     paypal['paypalPayerId'] = this.paymentObject['paypalPayerId'];
    //     paypal['paymentGateway'] = this.paymentObject['paymentGateway'];
    //     delete this.paymentObject['paypalEmail']
    //     delete this.paymentObject['paypalPayerId']
    //   }
    //   user = {...user, ...this.paymentObject}
    // }



    if (this.mangoUser) {
      user.mangoUserId = this.mangoUser.Id;
    }
    if (this.cardInfo) {
      user.mangoCardId = this.cardInfo.CardId;
    }
    const result = await this.authenticationService.signUpWithEmailAndPassword(
      user, this.accountInfoFormGroup.get('passwordCtrl').value
    );

    if (result && result.message !== '') {
      if (result.message === 'The email address is already in use by another account.') {
        this.saveError = `You already signed up with
        this email address, if you need a second account, you are most welcome, but we
        need you to use a different email address.`;
      } else if (result.message === 'A network error (such as timeout, interrupted connection or unreachable host) as occurred.') {
        this.saveError = `Oops there is something wrong with the connection. Maybe a time out or just an
        internet interruption. Please check?`;
      } else {
        this.saveError = result.message;
      }
      this.snackbar.open('Error on save. Check the form value', 'Close', {duration: 3000});
      this.submitting = false;
    } else {

      if (this.profileInfoFormGroup.get('profileTypeCtrl').value === 'coach' && this.continent !== 'Europe') {
        this.updateCoachPaypal({paypalEmail: this.bankingDetailsFormGroup.get('PaypalEmail').value, paymentGateway: 'paypal'});
      }

      if (this.mangoBankAccount) {
        this.updateCoachBankAccount(this.mangoBankAccount);
      }
      if (this.mangoWallet) {
        this.updateCoachWallet(this.mangoWallet);
      }
    }
  }

  buildUserFromForm(): AppUser {
    return {
      email: this.account.emailCtrl.value,
      firstname: this.profile.firstnameCtrl.value,
      sponsored: this.profile.profileTypeCtrl.value === 'sponsored',
      lastname: this.profile.lastnameCtrl.value,
      displayName: `${this.profile.firstnameCtrl.value} ${this.profile.lastnameCtrl.value}`,
      enable: true,
      termAndCondition: false,
      address: null,
      telephone: '',
      gender: '',
      birthDate: this.profile.birthdayCtrl.value ? this.profile.birthdayCtrl.value : null,
      websiteUrl: '',
      privacy: this.profile.privacyCtrl.value,
      confirmEmail: false,
      deleted: false,
      nationality: this.profile.nationalityCtrl.value ? this.profile.nationalityCtrl.value : null,
      countryOfResidence: this.profile.countryOfResidenceCtrl.value
    };
  }

  onAccountInfoFormNext() {
    if (this.accountInfoFormGroup.invalid) {
      this._markAsDirty(this.accountInfoFormGroup);
      return false;
    }
    return true;
  }

  _markAsDirty(group: FormGroup) {
    group.markAsDirty();
    for (const i in group.controls) {
      if (i) {
        group.controls[i].markAsTouched({ onlySelf: true });
      }
    }
  }

  openBottomSheetPrivacy(): void {
    this.bottomSheet.open(PrivacyComponent);
  }
    getUser(): Promise<AppUser> {
    return new Promise((resolve) => {
      this.subscriptions.push(
        this.authenticationService.user.subscribe(async (res) => {
          resolve(res);
          this.user = res;
          if (res) {
            this.bookingswithEmailOnly = await this.getBookingswithEmail();
          }
        })
      );
    });
  }
  getBookings(): Promise<Booking[]> {
    return new Promise(async (resolve) => {
      if (this.user) {
        const bookings = await this.bookingsService.getBookingsByClient(
          this.user
        );
        resolve(bookings);
      } else {
        resolve([]);
      }
    });
  }
  getBookingswithEmail(): Promise<Booking[]> {
    return new Promise(async (resolve) => {
      if (this.user) {
        const bookings =
          await this.bookingsService.getBookingsByClientWithEmail(this.user);
        resolve(bookings);
        if (bookings[0].client == "") {
          this.AddclientIdTobooking(bookings);
      } else {
        resolve([]);
      }
    }
    });
  }
  AddclientIdTobooking(bookings) {
    const clientData = {};
    clientData["client"] = this.user.uid;
    this.bookingsService.updateClientBooking(bookings[0].id, clientData);
  }

}
