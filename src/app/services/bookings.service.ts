import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Booking } from '../models/Booking';
import { AppUser } from '../models/AppUser';
import { Coach } from '../models/Coach';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private afFirestore: AngularFirestore) {
  }

  getBookingsByClient(user: AppUser): Promise<Booking[]> {
    const bookingsCollectionRef = this.afFirestore.collection<Booking>(
      'bookings', ref => ref.where('client', '==', user.uid)
    );
    return this.getBookings(bookingsCollectionRef);
  }

  getBookingsByClientWithEmail(user: AppUser): Promise<Booking[]> {
    const bookingsCollectionRef = this.afFirestore.collection<Booking>(
      'bookings', ref => ref
      .where('clientemail', '==', user.email)
    );
    return this.getBookings(bookingsCollectionRef);
  }

  getBookingsByCoach(coach: Coach): Promise<Booking[]> {
    const bookingsCollectionRef = this.afFirestore.collection<Booking>(
      'bookings', ref => ref.where('coach', '==', coach.id)
    );
    return this.getBookings(bookingsCollectionRef);
  }

  getFutureBookingsByCoach(coach: Coach): Promise<Booking[]> {
    const bookingsCollectionRef = this.afFirestore.collection<Booking>(
      'bookings', ref => ref.where('coach', '==', coach.id)
                            .orderBy('date', 'asc')
                            .startAt(new Date())
    );
    return this.getBookings(bookingsCollectionRef);
  }

  getBookingsByTimeSlot(timeSlotId: string): Promise<Booking[]> {
    const bookingsCollectionRef = this.afFirestore.collection<Booking>(
      'bookings', ref => ref.where('timeSlot', '==', timeSlotId)
    );
    return this.getBookings(bookingsCollectionRef);
  }

  private getBookings(bookingsCollectionRef: AngularFirestoreCollection): Promise<Booking[]> {
    return bookingsCollectionRef.get().pipe(map(
      snapshot => {
        if (snapshot.docs.length) {
          return snapshot.docs.map(
            booking => {
              return {
                id: booking.id,
                date: booking.data().date,
                client: booking.data().client,
                timeSlot: booking.data().timeSlot,
                coach: booking.data().coach
              };
            }
          );
        }
        return [];
      }
    )).toPromise();
  }

   updateClientBooking(bookingId, clientdata): void {
    this.afFirestore.doc("bookings/" + bookingId).ref.update(clientdata);
  }
}
