import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppUser } from '../models/AppUser';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-select-payment',
  templateUrl: './select-payment.component.html',
  styleUrls: ['./select-payment.component.css']
})
export class SelectPaymentComponent implements OnInit {

  user: AppUser;
  coach;
  envPaymentType;
  loading;
  continent;
  paymentType;

  paymentMade = new EventEmitter<any>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<SelectPaymentComponent>,
    private afFirestore: AngularFirestore,
  ) {
    dialogRef.disableClose = true;
    this.user = data.user;
    this.coach = data.coach;
    this.continent = data.continent;
  }

  ngOnInit() {
    // this.paymentComplete('test')
    this.envPaymentType = environment.paymentMethod
  }

  changePaymentType(e) {
    this.paymentType = e.target.value
  }

  updatePreferredPayment() {

    const { uid } = this.user

    let paymentType = this.paymentType

    if (!this.paymentType && this.user.paymentType !== "") {
      paymentType = this.user.paymentType
    }

    this.afFirestore.doc('users/' + uid).update({
      paymentType
    });

    this.dialogRef.close(true);
  }


  close(val) {
    if (this.loading) {
      return;
    }
    this.dialogRef.close(val);
  }
}
