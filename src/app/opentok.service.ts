import { Injectable } from '@angular/core';
import * as OT from '@opentok/client';

@Injectable({
  providedIn: 'root'
})
export class OpentokService {

  session: OT.Session;
  token: string;

  constructor() { }

  getOT() {
    return OT;
  }

  initSession(sessionId, tokenId) {
    const tokBoxApikey = '46729622';
    this.session = this.getOT().initSession(tokBoxApikey, sessionId);
    this.token = tokenId;
    return Promise.resolve(this.session);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.session.connect(this.token, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.session);
        }
      });
    });
  }
}
