import firebase from 'firebase/app';
import GeoPoint = firebase.firestore.GeoPoint;

export interface Address {

  address?:     string;
  zipCode?:     string;
  city?:        string;
  country?:     string;
  addressType?: string;

  location?:          GeoPoint;
  placeId?:           string;
  formattedAddress?:  string;
}
