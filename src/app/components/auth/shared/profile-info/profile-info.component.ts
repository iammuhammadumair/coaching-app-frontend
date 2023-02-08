import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import  firebase from 'firebase/app';
import { Address } from '../../../../models/adress';
// Import Models
import { AppUser } from '../../../../models/AppUser';
// Import Services
import { AuthenticationService } from '../../../../services/authentication.service';
import { LocationService } from '../../../../services/location.service';

import GeoPoint = firebase.firestore.GeoPoint;
import { ProfileTypeFinderService } from 'src/app/services/profile-type-finder.service';
import { Observable } from 'rxjs';
import { ProfileType } from 'src/app/models/profile-type';
import { MatSnackBar} from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { PrivacyComponent } from 'src/app/components/public/privacy/privacy.component';
import { ConditionComponent } from 'src/app/components/public/condition/condition.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {

  location: { lat: number, lng: number };
  loading: boolean;

  isLinear = false;
  saveError = '';
  accountInfoFormGroup: FormGroup;
  profileInfoFormGroup: FormGroup;
  selectedProfile: string;
  selectedGender: string;
  profileTypeList: Observable<ProfileType[]>;

  userRef: Observable<AppUser | null>;
  user: AppUser;

  mapMessage = '';

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'field': {
      'required': 'Required field'
    }
  };

  constructor(private formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
    private geocodeService: LocationService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private profileTypeFinder: ProfileTypeFinderService,
    public snackbar: MatSnackBar,
    private bottomSheet: MatBottomSheet) {
    this.userRef = authenticationService.user;
    this.userRef.subscribe(u => {
    this.user = u;
      if (u) {
        this.selectedProfile = u.profileType;
        this.buildForm();
      }
    });
  }

  get profileType() {
    return this.selectedProfile === 'Client' ? 'Coachee' : this.selectedProfile;
  }

  ngOnInit() {

    this.profileInfoFormGroup = this.formBuilder.group({
      profileTypeCtrl: ['', [Validators.required]],
      firstnameCtrl: ['', [Validators.required]],
      lastnameCtrl: ['', [Validators.required]],
      addressCtrl: [''],
      zipCodeCtrl: [''],
      cityCtrl: [''],
      countryCtrl: [''],
      telephoneCtrl: [''],
      websiteUrlCtrl: [''],
      enable: Boolean,
      confirmEmail: Boolean,
      genderCtrl: ['0'],
      dobCtrl: [''],
      privacyCtrl: [true],
      termCtrl: [true]
    });

    this.profileInfoFormGroup.valueChanges.subscribe(field => {
      if (field.privacyCtrl === false) {
        this.profile.privacyCtrl.setErrors({ required: true });
      } else {
        this.profile.privacyCtrl.setErrors(null);
      }
    });

    this.profileTypeList = this.profileTypeFinder.getTypes();

  }

  get profile() { return this.profileInfoFormGroup.controls; }

  buildForm(): void {

    /* if (this.profileInfoFormGroup && this.profileInfoFormGroup.get('profileTypeCtrl')) {
      pType = this.profileInfoFormGroup.get('profileTypeCtrl').value;
    } */

    if (this.selectedProfile !== 'Client') {
      // const datePipe = new DatePipe('en-US');
      const myFormattedDate = this.user.birthDate ? this.user.birthDate.toDate() : null;

      this.profileInfoFormGroup = this.formBuilder.group({
        profileTypeCtrl: [this.user.profileType, [Validators.required]],
        firstnameCtrl: [this.user.firstname, [Validators.required]],
        lastnameCtrl: [this.user.lastname, [Validators.required]],
        addressCtrl: [this.user.address ? this.user.address.address : '', [Validators.required]],
        zipCodeCtrl: [this.user.address ? this.user.address.zipCode : '', [Validators.required]],
        cityCtrl: [this.user.address ? this.user.address.city : '', [Validators.required]],
        countryCtrl: [this.user.address ? this.user.address.country : '', [Validators.required]],
        telephoneCtrl: [this.user.telephone, [Validators.required]],
        websiteUrlCtrl: [this.user.websiteUrl ? this.user.websiteUrl : ''],
        enable: Boolean,
        confirmEmail: Boolean,
        genderCtrl: [this.user.gender, [Validators.required]],
        dobCtrl: [myFormattedDate, [Validators.required]],
        privacyCtrl: [true, [Validators.requiredTrue]],
        termCtrl: [true, [Validators.requiredTrue]]
      });

      this.profileInfoFormGroup.valueChanges.subscribe(field => {
        if (field.privacyCtrl === false) {
          this.profile.privacyCtrl.setErrors({ required: true });
        } else {
          this.profile.privacyCtrl.setErrors(null);
        }
        if (field.termCtrl === false) {
          this.profile.termCtrl.setErrors({ required: true });
        } else {
          this.profile.termCtrl.setErrors(null);
        }
      });
      this.onAddressLookup();

    } else {
      this.profileInfoFormGroup = this.formBuilder.group({
        profileTypeCtrl: [this.user.profileType, [Validators.required]],
        firstnameCtrl: [this.user.firstname, [Validators.required]],
        lastnameCtrl: [this.user.lastname, [Validators.required]],
        enable: Boolean,
        confirmEmail: Boolean,
        privacyCtrl: [true, [Validators.requiredTrue]]
      });

      this.profileInfoFormGroup.valueChanges.subscribe(field => {
        if (field.privacyCtrl === false) {
          this.profile.privacyCtrl.setErrors({ required: true });
        } else {
          this.profile.privacyCtrl.setErrors(null);
        }
      });
    }

  }

  onAccountInfoFormNext(): void {

  }

  onAddressLookup() {
    const address = <Address>{};
    address.address = this.profileInfoFormGroup.get('addressCtrl').value;
    address.zipCode = this.profileInfoFormGroup.get('zipCodeCtrl').value;
    address.city = this.profileInfoFormGroup.get('cityCtrl').value;
    address.country = this.profileInfoFormGroup.get('countryCtrl').value;
    this.lookupAddressToCoordinates(address);
  }

  onSignUpFormSubmit(): void {
    this.saveError = '';
    //  verify that all data are present and submit calling the AuthenticationService method signUpWithEmailAndPassword
    if (this.profileInfoFormGroup.invalid) {

      this._markAsDirty(this.profileInfoFormGroup);
      this.snackbar.open('Error on save. Check the form value', 'Close', {
        duration: 3000,
      });
      return;
    }
    // Creation of User Object
    const registeredUser = <AppUser>{};
    registeredUser.email = this.user.email;
    registeredUser.profileType = this.profileInfoFormGroup.get('profileTypeCtrl').value;
    registeredUser.firstname = this.profileInfoFormGroup.get('firstnameCtrl').value;
    registeredUser.lastname = this.profileInfoFormGroup.get('lastnameCtrl').value;
    registeredUser.displayName = this.profileInfoFormGroup.get('firstnameCtrl').value + ' '
      + this.profileInfoFormGroup.get('lastnameCtrl').value;

    registeredUser.enable = this.user.enable;
    if (registeredUser.profileType === 'Client') {
      registeredUser.termAndCondition = false;
      const address = null;
      registeredUser.address = address;
      registeredUser.telephone = '';
      registeredUser.websiteUrl = '';
      registeredUser.gender = '';
      registeredUser.birthDate = null;

    } else {

      const address = <Address>{};
      address.address = this.profileInfoFormGroup.get('addressCtrl').value;
      address.zipCode = this.profileInfoFormGroup.get('zipCodeCtrl').value;
      address.city = this.profileInfoFormGroup.get('cityCtrl').value;
      address.country = this.profileInfoFormGroup.get('countryCtrl').value;

      address.location = new GeoPoint(this.location && this.location.lat ? this.location.lat : 0,
        this.location && this.location.lng ? this.location.lng : 0);
      registeredUser.address = address;
      registeredUser.telephone = this.profileInfoFormGroup.get('telephoneCtrl').value;
      registeredUser.websiteUrl = this.profileInfoFormGroup.get('websiteUrlCtrl').value;
      registeredUser.gender = this.profileInfoFormGroup.get('genderCtrl').value;
      registeredUser.birthDate = this.profileInfoFormGroup.get('dobCtrl').value;
      registeredUser.termAndCondition = this.profileInfoFormGroup.get('termCtrl').value;
    }

    registeredUser.privacy = this.profileInfoFormGroup.get('privacyCtrl').value;
    registeredUser.confirmEmail = true;
    registeredUser.deleted = false;
    registeredUser.offers = this.user.offers;
    registeredUser.bookmarks = this.user.bookmarks;
    registeredUser.requests = this.user.requests;
    registeredUser.uid = this.user.uid;
    registeredUser.photoURL = this.user.photoURL;

    // Call of Authentication service with method signUpWithEmailAndPassword
    this.authenticationService.updateUserData(
      registeredUser
    ).then((result) => {
      if (result && result.message !== '') {
        this.saveError = result.message;
        this.snackbar.open('Error on save. Check the form value', 'Close', {
          duration: 3000,
        });
      } else {
        this.router.navigate(['/welcome']);
      }
    });


  }

  lookupAddressToCoordinates(addressToBeLookedUp: Address) {
    this.loading = true;
    this.mapMessage = 'loading information...';
    const location = addressToBeLookedUp.address + ' ' + addressToBeLookedUp.zipCode +
      ' ' + addressToBeLookedUp.city + ' ' + addressToBeLookedUp.country;
    this.geocodeService.geocodeAddress(location)
      .subscribe(

        retrievedLocation => {
          this.location = { lat: retrievedLocation.lat, lng: retrievedLocation.lng };
          this.mapMessage = retrievedLocation.message;
          this.loading = false;
        }

      );
  }

  _markAsDirty(group: FormGroup) {
    group.markAsDirty();
    for (const i in group.controls) {
      if (i) {
        group.controls[i].markAsTouched({ onlySelf: true });
        // group.controls[i].markAsDirty({ onlySelf: true });
      }
    }
  }

  openBottomSheetPrivacy(): void {
    this.bottomSheet.open(PrivacyComponent);
  }

  openBottomSheetTerms(): void {
    this.bottomSheet.open(ConditionComponent);
  }
}
