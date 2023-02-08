import { Component, OnInit, Inject,Input,Output,EventEmitter } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MangopayService } from '../mangopay.service';
import * as moment from 'moment-timezone';
import { AppUser, countriesList } from '../models/AppUser';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timingSafeEqual } from 'crypto';
@Component({
  selector: 'app-add-card-in-mangopay',
  templateUrl: './add-card-in-mangopay.component.html',
  styleUrls: ['./add-card-in-mangopay.component.css']
})
export class AddCardInMangopayComponent implements OnInit {

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
  paymentDetailsFormGroup = this.fb.group({
    cardNumber: ['', Validators.required],
    cardExpirationDate: ['', Validators.required],
    cardCvx: ['', Validators.required]
  });

  validationMessages = {
    'field': {
      'required': 'Required field'
    },
    'Card': {
      'card':'This card already Register please use another one'
    },
  };
  mangoUser;
  cardRegistration;
  cardInfo;
  RegisteredCards=[];
  user: AppUser;
  loading;
  countries = countriesList;
  error;
  cards = [];
  constructor(
    private authenticationService: AuthenticationService,
    private afFirestore: AngularFirestore,
    private fb: FormBuilder,
    // @Inject(MAT_DIALOG_DATA) public data,
    // private dialogRef: MatDialogRef<AddCardInMangopayComponent>,
    private mangoPay: MangopayService,
    public snackbar: MatSnackBar,
  ) {
    // dialogRef.disableClose = true;
    // this.user = data.user;
  }

  // @Input() userProfile = null;
  // @Input() signupAccount = null;
  // @Input() signupProfile = null;
  @Output() signupPaymentEvent = new EventEmitter();
  @Output() closePaymentModal = new EventEmitter();



  get profile() { return this.profileInfoFormGroup.controls; }
  get payment() { return this.paymentDetailsFormGroup.controls; }

  ngOnInit(): void {

    this.authenticationService.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.getCards()
  }

  close() {
    if (this.loading) {
      return;
    }
    // this.dialogRef.close(false);
  }

  
  async saveCard() {
    // if(this.RegisteredCards && this.RegisteredCards.includes(this.payment.cardNumber.value.slice(-4)) ){
    //   this.payment.cardNumber.setErrors({ 'card': true });
    //   this.snackbar.open('This card is already register please use different one', 'Close', {
    //   duration: 3000, 
    // });
    // return;   
    // }
    this.error = null;
    this.loading = true;
    try {
      // Create mango client

      if (this.user && (!this.mangoUser && !this.user.mangoUserId)) {
        this.mangoUser = await this.createMangoPayUser().toPromise();
        if (!this.mangoUser) {
          throw Error('Error creating mango user');
        } else {
          // update user mangoUserId
          this.updateUserMangoUserId();
        }
      }

      // Create cardRegistration
      if (!this.cardRegistration) {
        const id = this.mangoUser ? this.mangoUser.Id : this.user.mangoUserId;
        this.cardRegistration = await this.mangoPay.createCardRegistration(id).toPromise();
        if (!this.cardRegistration) {
          throw Error('Error creating the cardRegistration');
        }
      }

      // Send card info
      if (!this.cardInfo) {
        this.cardInfo = await this.mangoPay.postCardInfo(this.cardRegistration, {
          cardNumber: this.payment.cardNumber.value.toString(),
          cardExpirationDate: this.payment.cardExpirationDate.value.toString(),
          cardCvx: this.payment.cardCvx.value.toString(),
          cardType: 'CB_VISA_MASTERCARD'
        });
        if (!this.cardInfo || !this.cardInfo.RegistrationData) {
          throw Error('Error posting the card info');
        }
      }

      // if (this.signupProfile) {
        // this.payment.emit({ paymentGateway: 'paypal', paypalUserId: customer.id, paymentType: paypal['type'], paymentId: customer['paymentMethods'][0].token, paypalNonce: paypal['nonce'] });
        // this.signupPaymentEvent.emit({ paymentGateway: 'mangopay', paymentType: 'MangoPayCard', paymentId: this.cardInfo.CardId, mangoUserId: this.mangoUser.Id })
      // }

      this.finishCreation({
        cardInfo: this.cardInfo,
        cardRegistration: this.cardRegistration,
      });
    } catch (e) {
      if (e && (e.ResultMessage === 'PAST_EXPIRY_DATE_ERROR' || e.ResultMessage === 'EXPIRY_DATE_FORMAT_ERROR')) {
        this.error = 'Expiration date needs to be a future date in the format MMYY';
      } else if (e) {
        this.error = e.ResultMessage;
      } else {
        this.error = 'Error processing payment. Please try again later';
      }
      console.log(e);
    } finally {
      this.loading = false;
      this.getCards();
    }
  }

  updateUserMangoUserId() {

    if(this.user){
      this.afFirestore.collection<any>(
        'users'
      ).doc(this.user.uid).update({mangoUserId: this.mangoUser.Id});
    }

    // if(this.signupProfile){

    // }
  }

  createMangoPayUser() {

    // const profile = this.signupProfile ? this.signupProfile : this.profileInfoFormGroup.getRawValue();
    const profile = this.user ? this.user : this.profileInfoFormGroup.getRawValue();
    return this.mangoPay.createNaturalUsers({
      'FirstName': profile['firstname'],
      'LastName': profile['lastname'],
      'Birthday': profile.birthDate ? Number(moment(profile['birthDate'].toDate()).tz('UTC').format('X')) : '',
      'Nationality': profile['nationality'] ? profile['nationality'] : '',
      'CountryOfResidence': profile['countryOfResidence'],
      'Email': profile['email'] //: this.signupAccount['emailCtrl'].value
    });
  }

  finishCreation(cardInfo) {

    if(this.user){
      this.closePaymentModal.emit()
      this.snackbar.open('Card details successfully Added', 'Close', {
      duration: 3000,
    });
    }
  }
//Get User Registered Card
  async getCards() {
    try {
      if (this.user && this.user.mangoUserId) {
        this.cards = await this.mangoPay.getUserCards(this.user.mangoUserId).toPromise();  
       this.RegisteredCards = this.cards.map((obj) => obj.Alias.slice(-4));
       console.log(this.cards)
      }
    } finally {
     
    }
  }

}


