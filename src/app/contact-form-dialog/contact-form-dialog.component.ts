import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countriesList } from '../models/AppUser';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-contact-form-dialog',
  templateUrl: './contact-form-dialog.component.html',
  styleUrls: ['./contact-form-dialog.component.css']
})
export class ContactFormDialogComponent implements OnInit {

  formGroup: FormGroup = this.fb.group({
    first: ['', Validators.required],
    last: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    country: ['', Validators.required],
    description: ['', Validators.required]
  });

  submitting;
  countries = countriesList;
  validationMessages = {
    'field': {
      'required': 'Required field',
      'email': 'Invalid email address'
    }
  };

  constructor(
    private afFirestore: AngularFirestore,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ContactFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) { }

  ngOnInit() {
  }

  get form() {
    return this.formGroup.controls;
  }

  send() {
    this.formGroup.markAsTouched({onlySelf: false});
    if (this.formGroup.invalid) {
      return;
    }
    this.submitting = true;
    const value = this.formGroup.getRawValue();
    if (!value) {
      return;
    }
    if (value.country) {
      const country = this.countries.find(c => {
        return c.code === value.country;
      });
      if (country) {
        value.country = country.name;
      }
    }
    this.afFirestore.collection('contactMessages').add(value).then(doc => {
      this.submitting = false;
      if (doc && doc.id) {
        this.dialogRef.close(this.data);
      }
    }).catch(e => {
      this.submitting = false;
      throw e;
    });
  }

  close() {
    this.dialogRef.close();
  }

}
