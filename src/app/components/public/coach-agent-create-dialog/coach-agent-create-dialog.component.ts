import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef  } from '@angular/material/dialog';
import { MatIconRegistry} from '@angular/material/icon';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar} from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { AppUser, countriesList } from '../../../models/AppUser';
import { PrivacyComponent } from 'src/app/components/public/privacy/privacy.component';
import { ConditionComponent } from 'src/app/components/public/condition/condition.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileType } from 'src/app/models/profile-type';
import { patternValidator } from '../sign-up/sign-up.component';
import { MangopayService } from 'src/app/mangopay.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-coach-agent-create-dialog',
  templateUrl: './coach-agent-create-dialog.component.html',
  styleUrls: ['./coach-agent-create-dialog.component.css']
})
export class CoachAgentCreateDialogComponent implements OnDestroy {

  loading: boolean;
  mapMessage = '';
  selectedGender: string;
  coachAgentType: string;
  mangoUser: any;
  cardRegistration: any;
  enable: Boolean;
  confirmEmail: Boolean;
  deleted: Boolean;
  selectedProfile: string;
  userForm: FormGroup;
  user: AppUser;
  updatedUser: AppUser;
  userRef: Observable<AppUser>;
  profileTypes: Observable<ProfileType[]>;
  saveError = '';
  subscriptions: Subscription[] = [];
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must include at least one letter and one number.',
      'minlength': 'Password must be at least 6 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
    'field': {
      'required': 'Required field'
    }
  };
  mangoBankAccount;
  mangoWallet;

  countries = countriesList;

  constructor(
    public dialogRef: MatDialogRef<CoachAgentCreateDialogComponent>,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    public authenticationService: AuthenticationService,
    private fb: FormBuilder,
    public snackbar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private mangoPay: MangopayService
  ) {
    this.formInit();
    iconRegistry.addSvgIcon(
      'update',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/update.svg')
    );
  }

  ngOnDestroy() {
   this.subscriptions.forEach(s => s.unsubscribe());
  }

  get form() { return this.userForm.controls; }
  get mangoUserForm() { return this.form.mangoUser['controls']; }
  get banking() { return this.form.bankingDetailsFormGroup['controls']; }
  get ownerAddress() { return (this.banking.OwnerAddress as FormGroup).controls; }

   formInit() {
    this.userForm = this.fb.group({
      emailCtrl: ['', [Validators.email, Validators.required]],
      passwordCtrl: ['', Validators.required],
      confirmPasswordCtrl: ['', Validators.required],
      firstnameCtrl: ['', Validators.required],
      lastnameCtrl: ['', Validators.required],
      privacyCtrl: ['', Validators.required],
      termCtrl: ['', Validators.required],
      birthdayCtrl: ['', Validators.required],
      nationalityCtrl: ['', Validators.required],
      countryOfResidenceCtrl: ['', Validators.required],
      CoachAgentTypeCtrl: ['',Validators.required]
        });

      // mangoUser: this.fb.group({
      //   birthdayCtrl: ['', Validators.required],
      //   nationalityCtrl: ['', Validators.required],
      //   countryOfResidenceCtrl: ['', Validators.required],
      // })
      // ,
      // bankingDetailsFormGroup: this.fb.group({
      //   // BIC: '',
      //   // IBAN: ['', Validators.required],
      //   OwnerName: ['', Validators.required],
      //   OwnerAddress: this.fb.group({
      //     AddressLine1: ['', Validators.required],
      //     AddressLine2: '',
      //     City: ['', Validators.required],
      //     Region: ['', Validators.required],
      //     PostalCode: ['', Validators.required],
      //     Country: ['', Validators.required]
      //   })
      // })
    //});

    this.subscriptions.push(
      this.userForm.valueChanges.subscribe(field => {
        if (field.passwordCtrl !== field.confirmPasswordCtrl) {
          this.form.confirmPasswordCtrl.setErrors({ mismatch: true });
        } else {
          this.form.confirmPasswordCtrl.setErrors(null);
        }
        if (!patternValidator(/[A-Za-z]/, field.passwordCtrl)) {
          this.form.passwordCtrl.setErrors({ pattern: true });
        }
        if (!patternValidator(/[0-9]/, field.passwordCtrl)) {
          this.form.passwordCtrl.setErrors({ pattern: true });
        }
      })
    );
  }

  async save() {
    try {
      this.saveError = '';
      if (this.userForm.invalid || this.userForm.invalid) {
        this._markAsDirty(this.userForm);
        this.snackbar.open('Error on save. Check the form', 'Close', {duration: 3000});
        return;
      }

      // // Create mango client
      // if (!this.mangoUser) {
      //   this.mangoUser = await this.createMangoPayUser().toPromise();
      //   if (!this.mangoUser) {
      //     throw Error('Error creating mango user');
      //   }
      // }
      // // Create mangoPay bank account
      // if (!this.mangoBankAccount) {
      //   const bankAccount = (this.form.bankingDetailsFormGroup as FormGroup).getRawValue();
      //   bankAccount.BIC = bankAccount.BIC || undefined;
      //   this.mangoBankAccount = await this.mangoPay.createBankAccount(bankAccount, this.mangoUser.Id).toPromise();
      //   if (!this.mangoBankAccount) {
      //     throw Error('Error creating bank account');
      //   }
      // }
      // // Create mangoPay wallet
      // if (!this.mangoWallet) {
      //   const wallet = {Owners: [this.mangoUser.Id], Description: 'default wallet', Currency: 'EUR'};
      //   this.mangoWallet = await this.mangoPay.createWallet(wallet).toPromise();
      //   if (!this.mangoWallet) {
      //     throw Error('Error creating wallet');
      //   }
      // }

      this.createSucceedUser();
    } catch (e) {
      console.log(e);
    }
  }
  createMangoPayUser() {
    return this.mangoPay.createNaturalUsers({
      'FirstName': this.form.firstnameCtrl.value,
      'LastName': this.form.lastnameCtrl.value,
      'Birthday': Number(moment(this.mangoUserForm.birthdayCtrl.value).tz('UTC').format('X')),
      'Nationality': this.mangoUserForm.nationalityCtrl.value,
      'CountryOfResidence': this.mangoUserForm.countryOfResidenceCtrl.value,
      'Email': this.form.emailCtrl.value
    });
  }

  async createSucceedUser() {
    const user: AppUser = this.getUserFromForm();
    // if (this.mangoUser) {
    //   user.mangoUserId = this.mangoUser.Id;
    // }
    // if (this.mangoBankAccount) {
    //   user.mangoBankAccountId = this.mangoBankAccount.Id;
    // }
    const result = await this.authenticationService.createCoachAgent(user, this.form.passwordCtrl.value);
    if (result && result.message !== '') {
      this.saveError = result.message;
      this.snackbar.open('Error on save. Check the form value', 'Close', {duration: 3000});
    } else {
      this.close();
    }
  }

  getUserFromForm() {
    return {
      email: this.form.emailCtrl.value,
      firstname: this.form.firstnameCtrl.value,
      lastname: this.form.lastnameCtrl.value,
      displayName: `${this.form.firstnameCtrl.value} ${this.form.lastnameCtrl.value}`,
      enable: true,
      address: null,
      telephone: '',
      gender: '',
      birthDate: null,
      websiteUrl: '',
      termAndCondition: this.form.termCtrl.value,
      privacy: this.form.privacyCtrl.value,
      confirmEmail: false,
      deleted: false,
      profileType: 'Coach Agent',
      coachAgentType: this.form.CoachAgentTypeCtrl.value
    };
  }

  _markAsDirty(group: FormGroup) {
    group.markAsDirty();
    for (const i in group.controls) {
      if (i) {
        group.controls[i].markAsTouched({ onlySelf: true });
      }
    }
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
