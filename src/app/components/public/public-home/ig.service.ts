import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IgService {
  meUrl = 'https://graph.instagram.com/me?fields=media&access_token=';
  mediaUrl = 'https://graph.instagram.com/';

  constructor(private http: HttpClient) {}

  getAccessToken() {
    return this.http.get(
      `${environment.firebase.cloudFunctionsUrl}/getAccessToken`,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    );
  }

  getUserMedia(accessToken) {
    return this.http.get(this.meUrl + accessToken);
  }

  getMediaUrl(mediaId: string, accessToken) {
    return this.http.get(`${this.mediaUrl}${mediaId}?fields=media_url&access_token=${accessToken}`);
  }
}
