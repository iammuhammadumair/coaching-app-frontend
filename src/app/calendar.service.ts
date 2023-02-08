import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import { Coach } from './models/Coach';
import * as cloneDeep from 'lodash/cloneDeep';

export interface Slot {
  starts: string;
  ends: string;
  ref: number;
  hours: number;
  minutes: number;
}

export const amTimeslots: Slot[] = [
  { starts: '08:00', ends: '09:15', ref: 1, hours: 8, minutes: 0 },
  { starts: '09:15', ends: '10:30', ref: 2, hours: 9, minutes: 15 },
  { starts: '10:30', ends: '11:45', ref: 3, hours: 10, minutes: 30 },
  { starts: '11:45', ends: '13:00', ref: 4, hours: 11, minutes: 45 }
];
export const pmTimeslots: Slot[] = [
  { starts: '13:00', ends: '14:15', ref: 5, hours: 13, minutes: 0 },
  { starts: '14:15', ends: '15:30', ref: 6, hours: 14, minutes: 15 },
  { starts: '15:30', ends: '16:45', ref: 7, hours: 15, minutes: 30 },
  { starts: '16:45', ends: '18:00', ref: 8, hours: 16, minutes: 45 },
  { starts: '18:00', ends: '19:15', ref: 9, hours: 18, minutes: 0 },
  { starts: '19:15', ends: '20:30', ref: 10, hours: 19, minutes: 15 },
  { starts: '20:30', ends: '21:45', ref: 11, hours: 20, minutes: 30 }
];

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  getDatetimekeyFromJsDate(jsdate: Date) {
    const datekey = this.getDatekeyFromJsDate(jsdate);
    let hours = jsdate.getHours().toString();
    hours = (hours.length === 1) ? `0${hours}` : hours;
    let minutes = jsdate.getMinutes().toString();
    minutes = (minutes.length === 1) ? `0${minutes}` : minutes;
    return `${datekey}${hours}${minutes}`;
  }

  getTimekeyFromSlotDate(slot) {
    let hours = slot.hours.toString();
    hours = (hours.length === 1) ? `0${hours}` : hours;
    let minutes = slot.minutes.toString();
    minutes = (minutes.length === 1) ? `0${minutes}` : minutes;
    return `${hours}${minutes}`;
  }


  getJsDateFromTimestampDate(sessionDate): Date {
    return new Date(sessionDate['seconds'] * 1000);
  }

  getNgbdateFromSessionDate(sessionDate): NgbDate {
    const jsdate = this.getJsDateFromTimestampDate(sessionDate);
    const year = jsdate.getFullYear();
    const month = jsdate.getMonth() + 1;
    const day = jsdate.getDate();
    return new NgbDate(year, month, day);
  }

  getNgbdateFromJsDate(jsdate: Date): NgbDate {
    const year = jsdate.getFullYear();
    const month = jsdate.getMonth() + 1;
    const day = jsdate.getDate();
    return new NgbDate(year, month, day);
  }

  getJsDateFromNgbDate(date: NgbDate): Date {
    const jsDate = new Date(
      date.year,
      date.month - 1,
      date.day
    );
    jsDate.setHours(0, 0, 0);
    return jsDate;
  }

  getDatekeyFromNgbDate(date: NgbDate) {
    return '' + date.year +
           (date.month.toString().length === 1 ? '0' + date.month : date.month) +
           (date.day.toString().length === 1 ? '0' + date.day : date.day);
  }


  getDatetimekeyFromDateSlot(date: NgbDate, slot) {
    if (!slot) {
      return null;
    }
    return this.getDatekeyFromNgbDate(date) + slot.ref;
  }

  getDateSlot(date: Date, coach: Coach) {
    const d = moment(date).tz(coach.timezone);
    const hours: any = d.format('h');
    const minutes: any = d.format('m');

    const slots = [...cloneDeep(amTimeslots), ...cloneDeep(pmTimeslots)];
    return slots.find(s => s.hours === Number(hours) && s.minutes === Number(minutes));
  }

  getDatetimekeyWithJsDate(date: NgbDate, jsdate: Date) {
    const hours: any = (jsdate.getHours().toString().length === 1 ? '0' + jsdate.getHours() : jsdate.getHours());
    const minutes: any = (jsdate.getMinutes().toString().length === 1 ? '0' + jsdate.getMinutes() : jsdate.getMinutes());
    return this.getDatekeyFromNgbDate(date) + hours + minutes;
  }

  getDatekeyFromJsDate(date: Date) {
    const year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    month = (month.toString().length === 1) ? `0${month}` : `${month}`;
    let day: any = date.getDate();
    day = (day.toString().length === 1) ? `0${day}` : `${day}`;
    return `${year}${month}${day}`;
  }

  getTimekeyFromJsDate(date: Date) {
    let hours: any = date.getHours();
    hours = hours.toString().length === 1 ? `0${hours}` : `${hours}`;
    let minutes: any = date.getMinutes();
    minutes = minutes.toString().length === 1 ? `0${minutes}` : `${minutes}`;
    return `${hours}${minutes}`;
  }

  getCalendarBookings(bookings) {
    const selectedDates = {};
    for (const booking of bookings) {
      const jsdate = this.getJsDateFromTimestampDate(booking.date);
      const ngbDate: NgbDate = this.getNgbdateFromSessionDate(booking.date);

      // Set the dates selected
      const jsdateStart = new Date(jsdate);
      jsdateStart.setHours(0, 0, 0);
      selectedDates[this.getDatekeyFromNgbDate(ngbDate)] = {
        jsdate: jsdateStart,
        timeSlotId: booking.id
      };
    }
    return selectedDates;
  }

  getJsDateFromNgbDateAndStaticSlot(date: NgbDate, slot: {hours: number; minutes: number}): Date {
    const jsdate = this.getJsDateFromNgbDate(date);
    jsdate.setHours(slot.hours);
    jsdate.setMinutes(slot.minutes);
    return jsdate;
  }
}
