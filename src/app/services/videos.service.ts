import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Video } from '../models/video';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { promise } from 'protractor';
// import { ViewContainerData } from '@angular/core/src/view';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  VideoRef: AngularFirestoreCollection<Video>;
  videosdetails: Observable<Video[]>;
  VideoSearch: Video[];
  video: Observable<Video>;
  years: Observable<any>;

  constructor(private FireServices: AngularFirestore) {

  }
  SaveVideo(Record) {
    return this.FireServices.collection('UploadVideos').add(Record);
  }

  deleterecord(Record) {
    return this.FireServices.collection('UploadVideos').doc(Record).delete();
  }
  GetVideosRecords() {
    return this.FireServices.collection('UploadVideos/').snapshotChanges();
  }

  saveCoach(video: Video): Promise<any> {
    const param: Video = {
      videotitle: video.videotitle ? video.videotitle : null,
      videoDescription: video.videoDescription ? video.videoDescription : null,
      VideoUrl: video.videotitle ? video.VideoUrl : null,
      creationDate: video.creationDate ? video.creationDate : null,
      lastUpdate: video.lastUpdate ? video.lastUpdate : null,

    };
    return this.VideoRef.add(param);
  }

  updateVideo(VideoUpdateID, Record) {
    this.FireServices.doc('UploadVideos/' + VideoUpdateID).update(Record);
  }

  SaveContent(PagContent) {
    return this.FireServices.collection('VideoPageContent').add(PagContent);
  }
  GetPageContentRecords() {
    return this.FireServices.collection('VideoPageContent').snapshotChanges();
  }
  updatePageTitile(Content_Id, UpdatePageContent) {
    this.FireServices.doc('VideoPageContent/' + Content_Id).update(UpdatePageContent);
  }
  deletePageTitle(Data) {
    return this.FireServices.collection('VideoPageContent').doc(Data).delete();
  }

}







