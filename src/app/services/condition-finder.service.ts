import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {Condition} from 'src/app/models/condition';

@Injectable({
  providedIn: 'root'
})
export class ConditionFinderService {

  conditionCollectionRef: AngularFirestoreCollection<Condition>;

  constructor(private afFirestore: AngularFirestore) {
    this.conditionCollectionRef = afFirestore.collection<Condition>('conditions');
   }

   getConditions(): Observable<Condition[]> {
    return this.conditionCollectionRef.valueChanges();

   }
}
