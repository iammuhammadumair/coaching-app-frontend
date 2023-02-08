import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUser } from '../../../../models/AppUser';
import { AuthenticationService } from '../../../../services/authentication.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patternValidator } from 'src/app/components/public/sign-up/sign-up.component';

declare const gapi;
@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  readonly DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  readonly SCOPES = 'https://www.googleapis.com/auth/calendar';

  loading: boolean;
  googleCalSync: boolean;
  isLinear = false;
  accountInfoFormGroup: FormGroup;
  userRef: Observable<AppUser | null>;
  user: AppUser;

  saveError = '';

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must include at least one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
    'field': {
      'required': 'Required field'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
    public snackbar: MatSnackBar
  ) {
    this.userRef = authenticationService.user;
    this.userRef.subscribe(u => {
      this.user = u;
      if (u) {
        this.buildForm();
      }
    });
  }

  get account() { return this.accountInfoFormGroup.controls; }

  ngOnInit() {
    this.accountInfoFormGroup = this.formBuilder.group({
      emailCtrl: ['', [<any>Validators.required, <any>Validators.email]],
      passwordCtrl: ['', [<any>Validators.required]],
      confirmPasswordCtrl: ['', [<any>Validators.required]]
    });
  }

  private buildForm(): void {
    this.accountInfoFormGroup = this.formBuilder.group({
      emailCtrl: [this.user.email, [Validators.required, Validators.email]],
      passwordCtrl: ['', [Validators.required, Validators.minLength(6),
      Validators.maxLength(40)]],
      confirmPasswordCtrl: ['']
    });

    this.accountInfoFormGroup.valueChanges.subscribe(field => {
      if (field.passwordCtrl !== field.confirmPasswordCtrl) {
        this.account.confirmPasswordCtrl.setErrors({ mismatch: true });
      } else {
        this.account.confirmPasswordCtrl.setErrors(null);
      }
      if (!patternValidator(/[A-Za-z]/, field.passwordCtrl)) {
        this.account.passwordCtrl.setErrors({ pattern: true });
      }
      if (!patternValidator(/[0-9]/, field.passwordCtrl)) {
        this.account.passwordCtrl.setErrors({ pattern: true });
      }
    });

  }

  onSignUpFormSubmit(): void {
    //  verify that all data are present and submit calling the AuthenticationService method signUpWithEmailAndPassword
    if (this.accountInfoFormGroup.invalid) {

      this._markAsDirty(this.accountInfoFormGroup);
      this.snackbar.open('Error on save. Check the form value', 'Close', {
        duration: 3000,
      });
      return;
    }
    // Creation of User Object
    const registeredUser = <AppUser>{};
    registeredUser.uid = this.user.uid;
    registeredUser.email = this.accountInfoFormGroup.get('emailCtrl').value;
    registeredUser.profileType = this.user.profileType;
    registeredUser.firstname = this.user.firstname;
    registeredUser.lastname = this.user.lastname;
    registeredUser.displayName = this.user.displayName;
    registeredUser.address = this.user.address;
    registeredUser.telephone = this.user.telephone;
    registeredUser.gender = this.user.gender;
    registeredUser.birthDate = this.user.birthDate;
    registeredUser.enable = this.user.enable;

    // Call of Authentication service with method signUpWithEmailAndPassword
    this.authenticationService.updateUser(
      registeredUser,
      this.accountInfoFormGroup.get('passwordCtrl').value
    ).then((result) => {
      if (result && result.message !== '') {
        this.saveError = result.message;
        this.snackbar.open('Error on save. Check the form value', 'Close', {
          duration: 3000,
        });
      }
    });
    // this.router.navigate(['/welcome']);
  }

  _markAsDirty(group: FormGroup) {
    group.markAsDirty();
    for (const i in group.controls) {
      if (i) {
        group.controls[i].markAsTouched({ onlySelf: true });
      }
    }
  }
}

