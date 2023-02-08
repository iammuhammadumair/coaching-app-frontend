import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { specialtiesTranslations } from '../components/auth/coachadmins/coach-form/coach-form.component';
import { Coach } from '../models/Coach';
import { CoachFinderFirestoreService } from '../services/coach-finder-firestore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-update-coach-dialog',
  templateUrl: './update-coach-dialog.component.html',
  styleUrls: ['./update-coach-dialog.component.css']
})
export class UpdateCoachDialogComponent implements OnInit {

  coach: Coach;
  specialtiesTranslations = specialtiesTranslations;
  updateCoachForm = this.fb.group({
    specialty: [''],
    quote: ['']
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {coach: Coach},
    public snackbar: MatSnackBar,
    private fb: FormBuilder,
    private coachService: CoachFinderFirestoreService,
    private dialog: MatDialogRef<UpdateCoachDialogComponent>
  ) {
    if (data && data.coach) {
      this.coach = data.coach;
      this.formControls.specialty.patchValue(this.coach.specialty);
      this.formControls.quote.patchValue(this.coach.quote);

    }
  }

  ngOnInit() {
  }

  get formControls () { return this.updateCoachForm.controls; }

  save() {
    if (!this.coach) {
      return;
    }
    this.coach.specialty = this.formControls.specialty.value;
    this.coach.quote = this.formControls.quote.value;
    this.coachService.updateCoach(this.coach);
    this.snackbar.open('Profile Updated', 'Close', {
      duration: 3000,
    });

    this.dialog.close();
  }

  close() {
    this.dialog.close();
  }
}
