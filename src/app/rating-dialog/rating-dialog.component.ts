import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.css']
})
export class RatingDialogComponent implements OnInit {

  showError;
  rateForm: FormGroup = this.fb.group({
    rate: ['', Validators.required],
    review: ['']
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public booking,
    private fb: FormBuilder,
    private afFirestore: AngularFirestore,
    private dialogRef: MatDialogRef<RatingDialogComponent>
  ) {
  }

  ngOnInit() {
  }

  get rate() {
    return this.rateForm.get('rate');
  }

  get review() {
    return this.rateForm.get('review');
  }

  save() {
    this.showError = false;
    if (!this.rateForm.valid) {
      this.rate.markAsDirty();
      this.rate.updateValueAndValidity();
      this.review.markAsDirty();
      this.review.updateValueAndValidity();
      return;
    }
    this.afFirestore.collection('ratings').add({
      rate: this.rate.value,
      review: this.review.value,
      coach: this.booking.coach,
      client: this.booking.client,
      booking: this.booking.id,
      created: new Date()
    }).then(() => {
      this.dialogRef.close();
    }).catch(() => {
      this.showError = true;
    });
  }

  close() {
    this.dialogRef.close();
  }
}
