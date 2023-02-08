import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProfileType } from 'src/app/models/profile-type';

@Injectable({
  providedIn: 'root'
})
export class ProfileTypeFinderService {

  profileTypeCollectionRef: AngularFirestoreCollection<ProfileType>;

  constructor(private afFirestore: AngularFirestore) {
    this.profileTypeCollectionRef = afFirestore.collection<ProfileType>('profileTypes', ref => ref.orderBy('name'));
  }

  getTypes() {
    return this.profileTypeCollectionRef.valueChanges();
  }

   getVisibleTypes(): Observable<ProfileType[]> {
     this.profileTypeCollectionRef = this.afFirestore.collection<ProfileType>('profileTypes', ref => ref.where('visible', '==', true));
     return this.profileTypeCollectionRef.valueChanges();
   }
}
