import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Country } from '../models/Country';

@Injectable({
  providedIn: 'root'
})
export class CountriesFinderService {

  countryCollectionRef: AngularFirestoreCollection<Country>;

  constructor(private afFirestore: AngularFirestore) {
    this.countryCollectionRef = afFirestore.collection<Country>('countries', ref => ref.orderBy('name'));
   }

   getCountries(): Observable<Country[]> {
    return this.countryCollectionRef.valueChanges();
   }

   addCountryIfNotExist(_country: string) {
    const country: Country = {
      name: _country
    };
    this.countryCollectionRef.add(country);
   }
}
