import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { Coach } from '../models/Coach';
import { SearchOption } from '../models/search-option';
import { AppUser } from '../models/AppUser';

@Injectable({
  providedIn: 'root'
})
export class CoachFinderService {
  private basePath = '/coaches';

  coachesRef: AngularFireList<any>;
  coaches: Observable<Coach[]>;
  coachesSearch: Coach[];
  coach: Observable<Coach>;

  constructor(private afDb: AngularFireDatabase) {
    // console.log('FirebaseServiceProvider Provider');
    this.coachesRef = afDb.list(this.basePath);
  }

  getCoaches(): Observable<Coach[]> {
    // retrieve the objectRef
    this.coachesRef = this.afDb.list(this.basePath);
    // retrieve the list of objects from the objectRef
    this.coaches = this.coachesRef.snapshotChanges().pipe(
      map(
        changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val()
          }));
        }
      )
    );

    this.coaches = this.coaches.pipe(
      map(arr =>
        arr.filter(r => (r.deleted !== true)
        )
      )
    );
    return this.coaches;
  }

  getCoachesByCountry(country: string): Observable<Coach[]> {
    // retrieve the objectRef
    this.coachesRef = this.afDb.list(this.basePath, ref => ref.orderByChild('country').equalTo(country));
    // retrieve the list of objects from the objectRef
    this.coaches = this.coachesRef.snapshotChanges().pipe(
      map(
        changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val()
          }));
        }
      )
    );
    return this.coaches;
  }

  getCoachesBySearch(searchOpt: SearchOption): Observable<Coach[]> {
    this.coachesRef = this.afDb.list(this.basePath);
    // retrieve the list of objects from the objectRef
    this.coaches = this.coachesRef.snapshotChanges().pipe(
      map(
        changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val()
          }));
        }
      )
    );
    this.coaches = this.coaches.pipe(
      map(arr =>
        arr.filter(coach => (coach.deleted !== true)
          && (searchOpt.country && searchOpt.country !== '' ? coach.country === searchOpt.country : '1' === '1')
          && (searchOpt.city && searchOpt.city !== '' ? coach.city === searchOpt.city : '1' === '1')
          && (searchOpt.language && searchOpt.language !== '' ? coach.language.indexOf(searchOpt.language) > -1 : '1' === '1')
          && (searchOpt.specialty && searchOpt.specialty !== '' ? coach.specialty.indexOf(searchOpt.specialty) > -1 : '1' === '1')
          && (searchOpt.maxPrice && searchOpt.maxPrice !== 0 ? coach.price <= searchOpt.maxPrice : '1' === '1')
          && (searchOpt.idIn.length ? searchOpt.idIn.indexOf(coach.id) > -1  : '1' === '1')
        )
      )
    );
    return this.coaches;
  }

  getCoachesByCoachAgent(user: AppUser): Observable<Coach[]> {

    this.coachesRef = this.afDb.list(this.basePath, ref => ref.orderByChild('uid').equalTo(user.uid));
    // retrieve the list of objects from the objectRef
    this.coaches = this.coachesRef.snapshotChanges().pipe(
      map(
        changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val()
          }));
        }
      )
    );

    this.coaches = this.coaches.pipe(
      map(arr =>
        arr.filter(r => r.deleted !== true)
      ));

    return this.coaches;

  }

  getCoachFromUid(refUid: string): Observable<Coach[]> {

    this.coachesRef = this.afDb.list(this.basePath);

    // retrieve the list of objects from the objectRef
    this.coaches = this.coachesRef.snapshotChanges().pipe(
      map(
        changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val()
          }));
        }
      )
    );

    this.coaches = this.coaches.pipe(
      map(arr =>
        arr.filter(r => r.id === refUid)
      ));

    return this.coaches;

  }

  getCoachFromRef(refNumber: string): Observable<Coach[]> {

    this.coachesRef = this.afDb.list(this.basePath);

    // retrieve the list of objects from the objectRef
    this.coaches = this.coachesRef.snapshotChanges().pipe(
      map(
        changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val()
          }));
        }
      )
    );

    this.coaches = this.coaches.pipe(
      map(arr =>
        arr.filter(r => r.reReferenceNumber.toString() === refNumber)
      ));

    return this.coaches;

  }

  saveCoach(coach: Coach): void {
    this.coachesRef.push(coach);
  }

  updateCoach(coach: Coach): void {
    this.coachesRef.update(coach.id, coach);
  }

}
