import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordResetComponent } from 'src/app/password-reset/password-reset.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signInFormGroup: FormGroup;
  errorLogin = '';
  Calender: string;
  constructor(
    private formBuilder: FormBuilder,
    private  dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.Calender = this.route.snapshot.params['click'];
    this.buildForm();
  }

  onSignInWithEmailAndPassword() {
    this.errorLogin = '';
    this.authenticationService.signInWithEmailAndPassword(
      this.signInFormGroup.controls['emailCtrl'].value,
      this.signInFormGroup.controls['passwordCtrl'].value,
      this.Calender
    ).then((result) => {
      if (result && result.message !== '') {
        this.errorLogin = result.message;
      }
    });
  }

  onSignInWithGoogle() {
    this.authenticationService.signInWithGoogle();
  }

  onSignInWithGitHub() {

  }

  reset() {
    this.buildForm();
  }

  forgotPassword() {
    this.dialog.open(PasswordResetComponent);
  }

  private buildForm(): void {
    this.signInFormGroup = this.formBuilder.group({
      emailCtrl: ['', [<any>Validators.required, <any>Validators.email]],
      passwordCtrl: ['', [<any>Validators.required]]
    });
  }

}
