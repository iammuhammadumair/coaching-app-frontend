import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Language } from '../models/Language';

@Injectable({
  providedIn: 'root'
})
export class LanguagesFinderService {

  languageCollectionRef: AngularFirestoreCollection<Language>;

  constructor(private afFirestore: AngularFirestore) {
    this.languageCollectionRef = afFirestore.collection<Language>('languages', ref => ref.orderBy('name'));
   }

   getLanguages(): Observable<Language[]> {
    return this.languageCollectionRef.valueChanges();
   }

   addLanguageIfNotExist(_language: string) {
    const language: Language = {
      name: _language
    };
    this.languageCollectionRef.add(language);
   }
}
