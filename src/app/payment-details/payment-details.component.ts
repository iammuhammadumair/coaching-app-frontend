import { Component, OnInit, OnDestroy } from '@angular/core';
import { MangopayService } from '../mangopay.service';
// import { BraintreeService } from '../braintree.service';

import { AuthenticationService } from '../services/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from '../add-card/add-card.component';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit, OnDestroy {

  user;
  cards = [];
  paymentType;
  envPaymentType;
  // paypal = [];
  card = {
    mangoPay: false,
    paypal: false
  };
  subscriptions: Array<Subscription> = [];
  done;
  loading = false;

  constructor(
    private snackbar: MatSnackBar,
    // private braintreePaypal: BraintreeService,
    private mango: MangopayService,
    private auth: AuthenticationService,
    private dialog: MatDialog,
    private afFirestore: AngularFirestore,
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.auth.user.pipe(filter(user => !!user)).subscribe(user => {
        this.user = user;
        const { paymentMethod } = environment;
        // console.log(user)
        this.envPaymentType = environment.paymentMethod;
        // if (user.paymentType === "paypal" && !paymentMethod.paypal){
          // alert('Please change your payment type Paypal is disabled on the system')
        // }
          this.paymentType = user.paymentType
        this.getCards();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async getCards() {
    // console.log(this.user)
    try {
      if (this.user && this.user.mangoUserId) {
        this.cards = await this.mango.getUserCards(this.user.mangoUserId).toPromise();
        // console.log('card:' ,this.cards)
        this.card.mangoPay = true;
        if (!this.cards) {
          this.card.mangoPay = false;
          this.cards = [];
        }
      }

      // if(this.user && this.user.paypalUserId){
      //   // console.log(this.user)
      //   let { paymentMethods } = await this.braintreePaypal.findCustomer(this.user.paypalUserId).toPromise();
      //   // console.log(customer)
      //   this.card.paypal = true;
      //   this.paypal = paymentMethods;
      //   // console.log(this.paypal)

      //   // console.log(this.paypal)
      //   if(!paymentMethods.length){
      //     this.card.paypal = false;
      //   }
      // }

    } finally {
      this.done = true;
    }
  }

  changePaymentType(e) {
    this.paymentType = e.target.value
    this.user.paymentType = e.target.value;
  }

  async updatePreferredPayment() {

    this.loading = true;
    const { uid } = this.user

    const paymentType = this.paymentType

    if (!this.paymentType) return

    await this.afFirestore.doc('users/' + uid).update({
      paymentType
    });

    this.loading = false;
    this.snackbar.open('Preferred payment method updated.', 'Close', {duration: 3000});

  }

  openAddCard() {
    let width = '90%';
    if (window.innerWidth > 1200) {
      width = '40%';
    } else if (window.innerWidth > 800) {
      width = '60%';
    }
    const dialogRef = this.dialog.open(AddCardComponent, {
      width: width,
      data: { user: this.user }
    });
    dialogRef.afterClosed().subscribe(async data => {
      if (data && data.cardInfo && data.cardInfo.CardId) {
        await this.mango.updateUserCard(data.cardInfo.CardId, this.user.uid);
        this.cards.unshift(data.cardInfo);
        this.getCards();
      }
    });
  }

  async makeActive(card, paymentMethod, type) {
    // console.log(card)
    if (paymentMethod === 'mangopay') {
      let a = await this.mango.updateUserCard(card.Id, this.user.uid);
      //  console.log(a)
    } else {



      // this.braintreePaypal.updatePaymentMethod(card.token);
      // this.braintreePaypal.updateUserInDatabase(card.token, this.user.uid,type)
    }
  }
}
