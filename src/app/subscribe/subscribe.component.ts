import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { PrivacyComponent } from '../components/public/privacy/privacy.component';
import { ConditionComponent } from '../components/public/condition/condition.component';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ProfileType } from 'src/app/models/profile-type';

import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { AppUser } from '../models/AppUser';
@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

  formGroup: FormGroup = this.fb.group({
    first: ['', Validators.required],
    last: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    privacyCtrl: [true, [Validators.requiredTrue]],
    termCtrl: [true, [Validators.requiredTrue]]
  });

  profileTypeList: Observable<ProfileType[]>;
  userRef: Observable<AppUser | null>;
  user: AppUser;
  selectedProfile: string;
  submitting;
  validationMessages = {
    'field': {
      'required': 'Required field',
      'email': 'Invalid email address'
    }
  };
  constructor(private afFirestore: AngularFirestore,
    public authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubscribeComponent>,
    private bottomSheet: MatBottomSheet,
    @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe(field => {
      if (field.privacyCtrl === false) {
        this.form.privacyCtrl.setErrors({ required: true });
      } else {
        this.form.privacyCtrl.setErrors(null);
      }
    });
  }

  get form() {
    return this.formGroup.controls;
  }

  send() {
    this.formGroup.markAsTouched({ onlySelf: false });
    if (this.formGroup.invalid) {
      return;
    }
    this.submitting = true;
    const value = this.formGroup.getRawValue();
    if (!value) {
      return;
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

  openBottomSheetPrivacy(): void {
    this.bottomSheet.open(PrivacyComponent);
  }

  openBottomSheetTerms(): void {
    this.bottomSheet.open(ConditionComponent);
  }
}
