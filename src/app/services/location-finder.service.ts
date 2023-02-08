import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Country } from '../models/Country';

@Injectable({
  providedIn: 'root'
})
export class LocationFinderService {

  private basePath = '/countries';

  countriesRef: AngularFirestoreCollection<Country>;
  countries: Observable<Country[]>;

  constructor(private afFirestore: AngularFirestore) {

    this.countriesRef = afFirestore.collection<Country>('countries', ref => ref.orderBy('name'));
  }

  getCountries(): Observable<Country[]> {
    return this.countriesRef.valueChanges();
  }
}
