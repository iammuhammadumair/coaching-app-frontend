import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-success-dialog',
  templateUrl: './schedule-success-dialog.component.html',
  styleUrls: ['./schedule-success-dialog.component.css']
})
export class ScheduleSuccessDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ScheduleSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  get coachName() {
    return this.data && this.data.coach && this.data.coach.name;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  goToCalendar() {
    this.dialogRef.close(true);
  }
}
