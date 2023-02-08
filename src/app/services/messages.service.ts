import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from 'src/app/models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  messagesRef: AngularFirestoreCollection<any>;
  messaggeSended: Observable<any>;

  constructor(private afFirestore: AngularFirestore) {
    this.messagesRef = afFirestore.collection<Message>('messages');
  }

  addMessage(fromMail: string, to: string, subject: string, body: string, uidSender?: string): Promise<string> {
    const msg = {
      from: fromMail,
      to: to,
      subject: subject,
      body: body,
      uidSender: uidSender ? uidSender : null,
      creationDate: new Date().getTime(),
      messageSent: false,
      messageSentDate: null
    };
    return this.messagesRef.add(msg).then(
      doc => {
        return doc.id;
      }
    );
  }

  getMessage(id: string): Observable<Message> {
    return this.afFirestore.doc(`messages/${id}`).valueChanges() as Observable<Message>;
  }
}
