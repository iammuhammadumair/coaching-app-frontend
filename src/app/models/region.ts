import firebase from 'firebase/app';
import GeoPoint = firebase.firestore.GeoPoint;

export class Region {
    Name: string;
    Country: string;
    GPSCoords: GeoPoint;
}
