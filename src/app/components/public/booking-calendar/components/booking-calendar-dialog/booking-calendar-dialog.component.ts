import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-calendar-dialog',
  templateUrl: './booking-calendar-dialog.component.html',
  styleUrls: ['./booking-calendar-dialog.component.css']
})
export class BookingCalendarDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
  }
}
