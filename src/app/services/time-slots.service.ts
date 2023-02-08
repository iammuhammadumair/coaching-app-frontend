import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TimeSlot } from '../models/TimeSlot';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotsService {

  constructor(
    private afFirestore: AngularFirestore
  ) {}

  getFutureTimeSlots(coach): Promise<TimeSlot[]> {
    const timeSlotsRef = this.afFirestore.collection<TimeSlot>(
      'timeSlots', ref => ref.where('coach', '==', coach.id)
                             .orderBy('date', 'asc')
                             .startAt(new Date())
    );
    return timeSlotsRef.get().pipe(map(
      data => {
        return data.docs.map(doc => {
          const session: any = doc.data();
          session.id = doc.id;
          return session;
        });
      }
    )).toPromise();
  }

  getTimeSlots(coach): Promise<TimeSlot[]> {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0);
    startDate.setSeconds(-1);

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2);
    endDate.setDate(1);
    endDate.setHours(0, 0, 0);
    endDate.setSeconds(-1);


    const timeSlotsRef = this.afFirestore.collection<TimeSlot>(
      'timeSlots', ref => ref.where('coach', '==', coach.id)
                            //  .orderBy('date', 'asc')
                            //  .startAt(startDate)
                            //  .endAt(endDate)
    );
    return timeSlotsRef.get().pipe(map(
      data => {
        return data.docs.map(doc => {
          const session: any = doc.data();
          session.id = doc.id;
          return session;
        });
      }
    )).toPromise();
  }

  getTimeSlotById(timeSlotId: string) {
    const timeSlotsRef = this.afFirestore.collection<TimeSlot>('timeSlots');
    return timeSlotsRef.doc(timeSlotId).get().pipe(map(
      doc => {
        const data = doc.data();
        if (data) {
          data.id = doc.id;
        }
        return data || null;
      }
    )).toPromise();
  }
}
