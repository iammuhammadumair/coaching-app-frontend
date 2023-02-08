import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Coach } from '../models/Coach';
import { SearchOption } from '../models/search-option';
import { AppUser } from '../models/AppUser';
import firebase from 'firebase/app';
import firestore = firebase.firestore;

@Injectable({
    providedIn: 'root'
})
export class CoachFinderFirestoreService {
    private basePath = 'coaches';

    coachRef: AngularFirestoreCollection<Coach>;
    coaches: Observable<Coach[]>;
    coachesSearch: Coach[];
    coach: Observable<Coach>;

    constructor(private afDb: AngularFirestore) {
        this.coachRef = afDb.collection<Coach>(this.basePath, ref => ref.where('deleted', '==', false));
    }

    getCoaches(): Observable<Coach[]> {
        this.coaches = this.coachRef.snapshotChanges().pipe(
            map(
                changes => {
                    return changes.map(c => ({
                        id: c.payload.doc.id, ...c.payload.doc.data()
                    }));
                }
            )
        );
        return this.coaches;
    }

    getCoachesByCountry(country: string): Observable<Coach[]> {
        this.coachRef = this.afDb.collection<Coach>(this.basePath, ref => ref.where('country', '==', country));
        return this.coachRef.valueChanges();
    }

    getCoachesBySearch(searchOpt: SearchOption, coachAgent: string): Observable<Coach[]> {
        this.coachRef = this.afDb.collection<Coach>(
            this.basePath, ref => this.getCoachesSearchRef(ref, coachAgent)
        );
        const coaches = this.coachRef.snapshotChanges().pipe(map(
            doc => this.getDocFromPayload(doc)
        )).pipe(map(
            arr => this.filterSearch(arr, searchOpt)
        ));
        return coaches;
    }

    getCoachesBySearchForClientPage(searchOpt: SearchOption, coachAgent: string): Observable<Coach[]> {
        const coachRef = this.afDb.collection<Coach>(
            this.basePath, ref => this.getCoachesSearchRef(ref, coachAgent)
        );
        const coaches = coachRef.snapshotChanges().pipe(map(
            doc => this.getDocFromPayload(doc)
        )).pipe(map(
            arr => this.filterSearchForClientPage(arr, searchOpt)
        ));
        return coaches;
    }

    getCoachesSearchRef(ref, coachAgent) {
        if (coachAgent) {
            return ref.where('deleted', '==', false).where('coachAgent', '==', coachAgent);
        } else {
            return ref.where('deleted', '==', false);
        }
    }

    filterSearch(arr, searchOpt) {
        return arr.filter(coach => (coach.deleted !== true) &&
           (searchOpt.coachName && searchOpt.coachName !== ""
          ? coach.coachName === searchOpt.coachName
          : "1" === "1") &&
            // (searchOpt.country && searchOpt.country !== '' ? coach.country === searchOpt.country : '1' === '1') &&
            (searchOpt.city && searchOpt.city !== '' ? coach.city === searchOpt.city : '1' === '1') &&
            (searchOpt.language && searchOpt.language !== '' ? coach.language.indexOf(searchOpt.language) > -1 : '1' === '1') &&
(searchOpt.specialty && searchOpt.specialty !== '' ? coach.specialty.some(code => JSON.stringify(code) === JSON.stringify(searchOpt.specialty)) :'1'==='1')&&
            (searchOpt.sponsoring && searchOpt.sponsoring !== null ? coach.sponsoring === searchOpt.sponsoring : '1' === '1') &&
            (searchOpt.maxPrice && searchOpt.maxPrice !== 0 ? coach.price <= searchOpt.maxPrice : '1' === '1'));
    }

    filterSearchForClientPage(arr, searchOpt) {
        return arr.filter(coach => (coach.deleted !== true) &&
         (searchOpt.coachName && searchOpt.coachName !== ""
          ? coach.coachName === searchOpt.coachName
          : "1" === "1") &&
            // (searchOpt.country && searchOpt.country !== '' ? coach.country === searchOpt.country : '1' === '1') &&
            (searchOpt.city && searchOpt.city !== '' ? coach.city === searchOpt.city : '1' === '1') &&
            (searchOpt.language && searchOpt.language !== '' ? coach.language.indexOf(searchOpt.language) > -1 : '1' === '1') &&
 (searchOpt.specialty && searchOpt.specialty !== '' ? coach.specialty.some(code => JSON.stringify(code) === JSON.stringify(searchOpt.specialty)) :'1'==='1')&&
            (searchOpt.sponsoring && searchOpt.sponsoring !== null ? coach.sponsoring === searchOpt.sponsoring : '1' === '1') &&
            (searchOpt.maxPrice && searchOpt.maxPrice !== 0 ? coach.price <= searchOpt.maxPrice : '1' === '1') &&
            (searchOpt.idIn.length ? searchOpt.idIn.indexOf(coach.id) > -1 : '1' === '1'));
    }

    getDocFromPayload(doc) {
        return doc.map(c => ({
            id: c.payload.doc.id, ...c.payload.doc.data()
        }));
    }

    getCoachesByCoachAgent(user: AppUser): Observable<Coach[]> {
        this.coachRef = this.afDb.collection<Coach>(this.basePath, ref =>
            ref.where('deleted', '==', false)
                .where('coachAgent', '==', user.uid));
        // retrieve the list of objects from the objectRef
        this.coaches = this.coachRef.snapshotChanges().pipe(
            map(
                changes => {
                    return changes.map(c => ({
                        id: c.payload.doc.id, ...c.payload.doc.data()
                    }));
                }
            )
        );
        return this.coaches;
    }

    getCoachFromId(refNumber: string): Observable<Coach> {
        const reRef: AngularFirestoreDocument<Coach> = this.afDb.doc(`coaches/${refNumber}`);
        let obRe: Observable<Coach>;
        obRe = reRef.valueChanges().pipe(map(coach => {
            coach.id = refNumber;
            return coach;
        }));
        return obRe;
    }

    getCoachFromUsername(username: string): Promise<Coach> {
        return new Promise(resolve => {
            this.afDb.collection(`coaches`,
                ref => ref.where('username', '==', username)
            ).get().subscribe(coaches => {
                if (coaches.empty) {
                    resolve(null);
                } else {
                    const coach = coaches.docs[0].data() as Coach;
                    coach.id = coaches.docs[0].id;
                    resolve(coach);
                }
            });
        });
    }

    getCoachPromiseFromId(refNumber: string): Promise<Coach> {
        return this.afDb.doc(`coaches/${refNumber}`).get().pipe(map(
            doc => {
                const data: any = doc.data();
                data.id = doc.id;
                return data;
            }
        )).toPromise();
    }

    getCoachFromReaId(refUid: string): Observable<Coach[]> {

        this.coachRef = this.afDb.collection<Coach>(this.basePath, ref =>
            ref.where('deleted', '==', false)
                .where('coachAgent', '==', refUid));

        // retrieve the list of objects from the objectRef
        this.coaches = this.coachRef.snapshotChanges().pipe(
            map(
                changes => {
                    return changes.map(c => ({
                        id: c.payload.doc.id, ...c.payload.doc.data()
                    }));
                }
            )
        );

        return this.coaches;

    }

    saveCoach(coach: Coach): Promise<any> {
        const param: Coach = {
            address: coach.address ? coach.address : null,
            city: coach.city ? coach.city : null,
            country: coach.country ? coach.country : null,
            creationDate: coach.creationDate ? coach.creationDate : null,
            currency: coach.currency ? coach.currency : null,
            deleted: coach.deleted ? coach.deleted : false,
            quote: coach.quote ? coach.quote : null,
            username: coach.username ? coach.username : null,
            formattedAddress: coach.formattedAddress ? coach.formattedAddress : null,
            isFeatured: null,
            lastUpdate: coach.lastUpdate ? coach.lastUpdate : null,
            place_id: coach.place_id ? coach.place_id : null,
            price: coach.price ? coach.price : null,
            reReferenceNumber: coach.reReferenceNumber ? coach.reReferenceNumber : null,
            coachAgent: coach.coachAgent ? coach.coachAgent : null,
            zipCode: coach.zipCode ? coach.zipCode : null,
            dateOfBirth: coach.dateOfBirth ? coach.dateOfBirth : null,
            gender: coach.gender ? coach.gender : null,
            coachImage: coach.coachImage ? coach.coachImage : null,
            sponsoring: coach.sponsoring ? coach.sponsoring : null,
            specialty: coach.specialty ? coach.specialty : null,
            name: coach.name ? coach.name : null,
            coachName: coach.coachName ? coach.coachName : null,
            language: coach.language ? coach.language : null,
            email: coach.email ? coach.email : null,
            coachVideoUrl: coach.coachVideoUrl ? coach.coachVideoUrl : null
        };
        return this.coachRef.add(param);
    }

    updateCoach(coach: Coach): void {
        this.coachRef.doc(coach.id).ref.update(coach);
    }
}
