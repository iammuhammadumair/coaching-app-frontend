import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-client-slots',
  templateUrl: './client-slots.component.html',
  styleUrls: ['./client-slots.component.css']
})
export class ClientSlotsComponent implements OnInit {

  @Output() slotClickedOutput = new EventEmitter<any>();
  @Input() selectedDate;
  @Input() bookedSlots;
  timezone;

  constructor(private router:Router) { }

  ngOnInit() {
    this.timezone = moment().tz(moment.tz.guess()).format('z');
  }

  get displayDate() {
    return  new Date(
      this.selectedDate.year,
      this.selectedDate.month - 1,
      this.selectedDate.day
    );
  }

  toggleSlot(slot) {
    if (this.canCancelSlot(slot)) {
      this.slotClickedOutput.emit(slot);
    }
  }
  redirectToSession($event: MouseEvent, booking_id:any){
    this.router.navigate(['/session/'+booking_id]);
    // window.open("/session/" + booking_id, '_blank');
  }

//   redirectTosessions(booking_id:any){
//   this.router.navigate(['/role'+booking_id]);
// }
  canCancelSlot(slot) {
    const today = new Date();
    const slotDate = slot.jsdate;
    const oneDay = 1 * 24 * 60 * 60 * 1000;
    return (today.getTime() + oneDay) < slotDate.getTime();
  }
}
