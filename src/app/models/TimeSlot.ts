import { Coach } from './Coach';
import { Booking } from './Booking';

export class TimeSlot {
    id?: string;
    date: Date;
    coach: string | Coach;

    // Injected field
    booking?: Booking;
}
