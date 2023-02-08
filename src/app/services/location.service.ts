import { Injectable } from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private geocoder: any;
  private addressComponent: any;

  constructor(private mapLoader: MapsAPILoader) { }

  private initGeocoder() {
    // console.log('Init geocoder!');
    this.geocoder = new google.maps.Geocoder();
    this.addressComponent = google.maps.address_components;
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return fromPromise(this.mapLoader.load())
        .pipe(
          tap(() => this.initGeocoder()),
          map(() => true)
        );
    }
    return of(true);
  }

  calculateDistance(fromLat: number, fromLng: number, toLat: number, toLng: number): any {
    const from = new google.maps.LatLng(fromLat, fromLng);
    const to = new google.maps.LatLng(toLat, toLng);
    let distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);
    distance = (distance / 1000).toFixed(0);
    return distance;

  }

  geocodeAddress(location: string): Observable<any> {
    return this.waitForMapsToLoad().pipe(
      switchMap(() => {
        return new Observable(observer => {
          this.geocoder.geocode({'address': location}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              observer.next({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
                place_id: results[0].place_id,
                formattedAddress: results[0].formatted_address,
                message: 'Address successfully found',
                region: this.getRegion(results[0].address_components),
                zip_code: this.getPostalCode(results[0].address_components)
              });
            } else {
              observer.next({
                message: 'Address not found, refine the fields --> ' + results
              });
            }
            observer.complete();
          });
        });
      })
    );
  }

  getRegion(addressComponent): string {

    this.addressComponent = addressComponent;
    let region = '';
    let a1: string;
    let a2: string;
    let a3: string;
    let a4: string;
    let a5: string;
    this.addressComponent.forEach(el => {
      if (el.types.indexOf('administrative_area_level_1') > -1) {
        a1 = el.long_name;
      }
      if (el.types.indexOf('administrative_area_level_2') > -1) {
        a2 = el.long_name;
      }
      if (el.types.indexOf('administrative_area_level_3') > -1) {
        a3 = el.long_name;
      }
      if (el.types.indexOf('administrative_area_level_4') > -1) {
        a4 = el.long_name;
      }
      if (el.types.indexOf('administrative_area_level_5') > -1) {
        a5 = el.long_name;
      }
    });
    if (a5) {
      region = a5;
    }
    if (a4) {
      region = a4;
    }
    if (a3) {
      region = a3;
    }
    if (a2) {
      region = a2;
    }
    if (a1) {
      region = a1;
    }

    // console.log('region -> ' + region);
    return region;
  }

  getPostalCode(addressComponent): string {

    this.addressComponent = addressComponent;
    let zipcode = '';
    this.addressComponent.forEach(el => {
      if (el.types.indexOf('postal_code') > -1) {
        zipcode = el.long_name;
      }
    });

    return zipcode;
  }

  save() {}
}
