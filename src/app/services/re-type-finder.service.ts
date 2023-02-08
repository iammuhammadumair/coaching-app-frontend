import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {PropertyType} from 'src/app/models/property-type';

@Injectable({
  providedIn: 'root'
})
export class ReTypeFinderService {

  propertyTypeCollectionRef: AngularFirestoreCollection<PropertyType>;

  constructor(private afFirestore: AngularFirestore) {
    this.propertyTypeCollectionRef = afFirestore.collection<PropertyType>('reTypes', ref => ref.orderBy('order'));
   }

   getTypes(): Observable<PropertyType[]> {
    return this.propertyTypeCollectionRef.valueChanges();

   }


}
