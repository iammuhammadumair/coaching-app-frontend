import  firebase from 'firebase/app';
import GeoPoint = firebase.firestore.GeoPoint;
export class Video {
    id?: string;
    videotitle: string;
    videoDescription: string;
    VideoUrl: string;
    creationDate: number;
    lastUpdate: number;
}
