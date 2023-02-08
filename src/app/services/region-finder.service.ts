import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {Region} from 'src/app/models/region';
import  firebase from 'firebase/app';
import firestore = firebase.firestore;

@Injectable({
  providedIn: 'root'
})
export class RegionFinderService {
  regionCollectionRef: AngularFirestoreCollection<Region>;

  constructor(private afFirestore: AngularFirestore) {
    this.regionCollectionRef = afFirestore.collection<Region>('regions', ref => ref.orderBy('Name'));
   }

   getRegions(): Observable<Region[]> {
    return this.regionCollectionRef.valueChanges();
   }

   addRegionIfNotExist(region: Region) {

    const reg: Region = {
      Name: region.Name,
      Country: region.Country,
      GPSCoords: new firestore.GeoPoint(
        region.GPSCoords && region.GPSCoords.latitude ? region.GPSCoords.latitude : 0,
        region.GPSCoords && region.GPSCoords.longitude ? region.GPSCoords.longitude : 0
      )
    };

    // this.regionCollectionRef.doc('regions.id').set(param);
    this.regionCollectionRef.add(reg);
    // this.afFirestore.collection('regions').docs().set(region);
   }
}
