import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {City} from 'src/app/models/city';
import firebase from 'firebase/app';
import firestore = firebase.firestore;

@Injectable({
  providedIn: 'root'
})
export class CityFinderService {

  cityCollectionRef: AngularFirestoreCollection<City>;

  constructor(private afFirestore: AngularFirestore) {
    this.cityCollectionRef = afFirestore.collection<City>('cities', ref => ref.orderBy('Name'));
   }

   getCities(): Observable<City[]> {
    return this.cityCollectionRef.valueChanges();
   }

   getCitiesByVal(search: string): Observable<City[]> {
    this.cityCollectionRef = this.afFirestore.collection<City>('cities', ref => ref.where('Name', '==', search).orderBy('Name'));
    return this.cityCollectionRef.valueChanges();

   }

   getCitiesByRegion(search: string): Observable<City[]> {
     if (search !== '') {
      this.cityCollectionRef = this.afFirestore.collection<City>('cities', ref => ref.where('Region', '==', search).orderBy('Name'));
     } else {
      this.cityCollectionRef = this.afFirestore.collection<City>('cities', ref => ref.orderBy('Name'));
     }

    return this.cityCollectionRef.valueChanges();
   }

   addCityIfNotExist(city: string) {
    const ci: City = {
      Name: city
    };
    this.cityCollectionRef.add(ci);
   }
}
