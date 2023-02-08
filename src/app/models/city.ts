import firebase from 'firebase/app';
import GeoPoint = firebase.firestore.GeoPoint;

export class City {
    Name: string;
    Country?: string;
    Region?: string;
    GPSCoords?: GeoPoint;
}
