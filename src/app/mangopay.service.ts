import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from './models/AppUser';

declare const mangoPay: any;

@Injectable({
  providedIn: 'root'
})
export class MangopayService {

  constructor(
    private http: HttpClient,
    private afFirestore: AngularFirestore
  ) {
    mangoPay.cardRegistration.baseURL = environment.mangoPay.url;
    mangoPay.cardRegistration.clientId = environment.mangoPay.clientId;
  }

  createNaturalUsers(user): Observable<any> {
    return this.http.post(
      `${environment.firebase.cloudFunctionsUrl}/createNaturalUsers`,
      user,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).pipe(map((res => this.formatCloudResponse(res))));
  }

  createBankAccount(bankAccount, UserId) {
    return this.http.post(
      `${environment.firebase.cloudFunctionsUrl}/createBankAccount`,
      {UserId, bankAccount},
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).pipe(map((res => this.formatCloudResponse(res))));
  }

   createOtherBankAccount(bankAccount, UserId) {
    console.log(bankAccount)
    return this.http.post(
      `${environment.firebase.cloudFunctionsUrl}/createOtherBankAccount`,
      {UserId, bankAccount},
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).pipe(map((res => this.formatCloudResponse(res))));
  }

  createWallet(wallet) {
    return this.http.post(
      `${environment.firebase.cloudFunctionsUrl}/createWallet`,
      wallet,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).pipe(map((res => this.formatCloudResponse(res))));
  }

  createCardRegistration(UserId: string): Observable<any> {
    // Initialize with card register data prepared on the server
   
    return this.http.post(
      `${environment.firebase.cloudFunctionsUrl}/createCardRegistration`,
      {UserId},
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).pipe(map((res => this.formatCloudResponse(res))));
  }
  createKYCDocumentRegistration(coach){
    console.log(coach)
    var body = { 
      UserId: coach //scalar value 
    }
  //  'http://localhost:5001/app-3dhomes-int/us-central1/createKycDocument',
    // Initialize with card register data prepared on the server
    return this.http.post(
       `${environment.firebase.cloudFunctionsUrl}/createKycDocument`,
       {body},
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).pipe(map((res => this.formatCloudResponse(res))));
  }

  updateCardRegistration(CardRegistrationId: string, RegistrationData: string): Observable<any> {
    return this.http.post(
      `${environment.firebase.cloudFunctionsUrl}/updateCardRegistration`,
      {CardRegistrationId: CardRegistrationId, RegistrationData: RegistrationData},
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).pipe(map((res => this.formatCloudResponse(res))));
  }

  postCardInfo(cardRegistration, cardInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      mangoPay.cardRegistration.init({
        cardRegistrationURL: cardRegistration.CardRegistrationURL,
        preregistrationData: cardRegistration.PreregistrationData,
        accessKey: cardRegistration.AccessKey,
        Id: cardRegistration.Id
      });
      mangoPay.cardRegistration.registerCard(
        cardInfo,
        (res) => {
          // Success, you can use res.CardId now that points to registered card
          resolve(res);
        },
        (err) => {
          // Handle error, see res.ResultCode and res.ResultMessage
          console.log(err);
          reject(err);
        }
      );
    });
  }

  getUserCards(UserId: string): Observable<any> {
    return this.http.post(
      `${environment.firebase.cloudFunctionsUrl}/getUserCards`,
      {UserId: UserId},
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).pipe(map((res => this.formatCloudResponse(res))));
  }

  updateUserCard(cardId, UserId): Promise<any> {
    return this.afFirestore.collection<AppUser>(
      'users'
    ).doc(UserId).update({mangoCardId: cardId, paymentGateway: 'mangopay'});
  }

  formatCloudResponse(res: any) {
    return (res.error || !res.data) ? null : res.data;
  }

}
