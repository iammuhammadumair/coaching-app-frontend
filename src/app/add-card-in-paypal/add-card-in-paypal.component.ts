import { Component, OnInit, Inject, EventEmitter,Output,Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppUser } from '../models/AppUser';
// import { BraintreeService } from '../braintree.service';
// import braintree from 'braintree-web';
import { AngularFirestore } from '@angular/fire/firestore';
// import { AddCardComponent } from '../add-card/add-card.component';
import { AuthenticationService } from '../services/authentication.service';

import { loadScript  } from "@paypal/paypal-js";
import {
  environment
} from '../../environments/environment';

// console.log(environment)


@Component({
  selector: 'app-add-card-in-paypal',
  templateUrl: './add-card-in-paypal.component.html',
  styleUrls: ['./add-card-in-paypal.component.css']
})
export class AddCardInPaypalComponent implements OnInit {
  loadAPI: Promise<any>;

  user: AppUser;
  loading = false;
  showHostFields = false;

  @Input() profile = null;
  @Input() coach = null;
  @Output() payment = new EventEmitter();
  @Output() closePaymentModal = new EventEmitter();
  @Output() paymentMade = new EventEmitter<any>();




  
  constructor(
    private afFirestore: AngularFirestore,
    private authenticationService: AuthenticationService,
    // private dialogRef: MatDialogRef<SelectPaymentComponent>,
    // private selectDateRef: MatDialogRef<SelectedDateDialogComponent>,

  ) {
  }
  
  


  ngOnInit(): void {
    this.authenticationService.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    
    this.paypalInitialize()
  
 
    this.showHostFields = this.user ? true : this.profile ? this.profile['profileTypeCtrl'].value === 'regular' : false
  }

 


  async paypalInitialize() {

    let _this = this;

    let paypal;

    try {
        paypal = await loadScript({ 
          "client-id": environment.paypal.client_id,
          "components":"buttons,funding-eligibility",
          "currency": _this.coach.currency
          
        });
    } catch (error) {
        console.error("failed to load the PayPal JS SDK script", error);
    }


    if (paypal) {

      var FUNDING_SOURCES = [
        paypal.FUNDING.PAYPAL,
        // paypal.FUNDING.CREDIT,
        // paypal.FUNDING.CARD
    ];
    
    // Loop over each funding source/payment method
    

      try {

        FUNDING_SOURCES.forEach(function(fundingSource) {
    
          // Initialize the buttons
          var button = paypal.Buttons({
              fundingSource: fundingSource,
              createOrder: function(data, actions) {
                return actions.order.create({
                   "purchase_units": [{
                      "amount": {
                        "currency": _this.coach.currency,
                        "value": _this.coach.price
                      },
                      "description": "Payment for session at succeed.world with " + _this.coach.coachName,
                      // "description": _this.user.firstname + ' ' + _this.user.lastname + " has paid the amount " + _this.coach.currency + " " + _this.coach.price + " to the coach " + _this.coach.coachName + " and paypal email is " + _this.coach.paypalEmail,
                      "payment_descriptor": "Payment for Session with " + _this.coach.coachName 
                    }]
                });
              },
               // Finalize the transaction after payer approval
               onApprove: function(data, actions) {
                return actions.order.capture().then( async function(orderData) {
                  // Successful capture! For dev/demo purposes:
                      // console.log('Capture result', orderData);

                      const transactionObject = {
                        status: 'pending',
                        paymentGateway: 'paypal',
                        client: _this.user.uid,
                        coach: _this.coach.id,
                        transaction: {
                          id: orderData['id'],
                          payerId: orderData['payer'].payer_id,
                          captureId: orderData.purchase_units[0].payments.captures[0].id
                        }
                      }

                      await _this.createTransaction(transactionObject);
                      
                      _this.paymentMade.emit(true);
                      // var transaction = orderData.purchase_units[0].payments.captures[0];
                      // alert('Transaction '+ transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');
        
                  // When ready to go live, remove the alert and show a success message within this page. For example:
                  // var element = document.getElementById('paypal-button');
                  // element.innerHTML = '';
                  // element.innerHTML = '<h3>Thank you for your payment!</h3>';
                  // Or go to another URL:  actions.redirect('thank_you.html');
                }).catch(async function(err){
                  console.log('catch error: ',err)
                });
              },
              onError: function(err,err2) {
                console.log('onerror: ' ,err,err2)                
              }
          });
      
          // Check if the button is eligible
          if (button.isEligible()) {
      
              // Render the standalone button for that funding source
              button.render('#paypal-button');
          }
      });
        
      } catch (error) {
          console.error("failed to render the PayPal Buttons", error);
      }
  }

 



  }

  async createTransaction(transaction){

    await this.afFirestore.collection<any>(
      'transactions'
    ).add(transaction);
            
  }



  close() {
    
    this.loading = false;
    
    if(this.user){
      this.closePaymentModal.emit()
    }
    
  }
}
