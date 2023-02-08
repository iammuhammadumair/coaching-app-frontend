import {
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "app-schedule-free-intake-dialog",
  templateUrl: "./schedule-free-intake-dialog.component.html",
  styleUrls: ["./schedule-free-intake-dialog.component.css"],
})
export class ScheduleFreeIntakeDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ScheduleFreeIntakeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  get coachName() {
    return this.data && this.data.coach && this.data.coach.name;
  }
  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
  goToSignUp() {
    this.dialogRef.close(true);
  }
}
