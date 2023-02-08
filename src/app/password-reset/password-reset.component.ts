import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  emailSent: boolean;

  formGroup: FormGroup = this.fb.group({
    email: ['', Validators.email]
  });

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PasswordResetComponent>
  ) { }

  ngOnInit() {
  }

  resetPassword() {
    const value = this.formGroup.getRawValue();
    if (!value.email || !this.formGroup.valid) {
      this.formGroup.get('email').markAsTouched();
      return;
    }

    this.afAuth.sendPasswordResetEmail(
      value.email
    ).then(
      () => this.emailSent = true,
      (rejectionReason) => console.log(rejectionReason)
    )
    .catch(e => {
      throw e;
    });
  }

  close() {
    this.dialogRef.close();
  }
}
