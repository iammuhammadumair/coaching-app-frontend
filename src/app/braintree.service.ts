import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from './models/AppUser';



// console.log(environment.firebase.cloudFunctionsUrl)
@Injectable({
  providedIn: 'root'
})
export class BraintreeService {

  constructor(
    private afFirestore: AngularFirestore,
    private http: HttpClient,
  ) { }

  // createCustomerWithPayment(customerDetail, paypalNonce) {
  //   return this.http.post(
  //     `${environment.firebase.cloudFunctionsUrl}/createCustomerWithPayment`,
  //     {...customerDetail, paypalNonce},
  //     {headers: new HttpHeaders({'Content-Type': 'application/json'})}
  //   ).pipe(map((res => this.formatCloudResponse(res))));
  // }

  // createPaymentMethod(customerId, paypalNonce) {
  //   return this.http.post(
  //     `${environment.firebase.cloudFunctionsUrl}/createPaymentMethod`,
  //     {customerId, paypalNonce},
  //     {headers: new HttpHeaders({'Content-Type': 'application/json'})}
  //   ).pipe(map((res => this.formatCloudResponse(res))));
  // }

  // updatePaymentMethod(paymentMethodToken) {
  //   return this.http.post(
  //     `${environment.firebase.cloudFunctionsUrl}/updatePaymentMethod`,
  //     {paymentMethodToken},
  //     {headers: new HttpHeaders({'Content-Type': 'application/json'})}
  //   ).pipe(map((res => this.formatCloudResponse(res))));
  // }

  // findCustomer(paypalUserId) {
  //   return this.http.post(
  //     `${environment.firebase.cloudFunctionsUrl}/findCustomer`,
  //     {paypalUserId},
  //     {headers: new HttpHeaders({'Content-Type': 'application/json'})}
  //   ).pipe(map((res => this.formatCloudResponse(res))));
  // }

  // updateUserInDatabase(cardId, UserId,Type): Promise<any> {
  //   return this.afFirestore.collection<AppUser>(
  //     'users'
  //   ).doc(UserId).update({paymentId: cardId, paymentGateway: 'paypal', paymentType: Type});
  // }

  // formatCloudResponse(res: any) {
  //   return (res.error || !res.data) ? null : res.data;
  // }
}
