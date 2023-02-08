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
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileType } from 'src/app/models/profile-type';
import { ProfileTypeFinderService } from 'src/app/services/profile-type-finder.service';
// import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  location: {lat: number, lng: number};
  loading: boolean;

  isLinear = false;
  /* profileTypes = [
    { name: 'Client' },
    { name: 'Coach Agent' }
  ];*/

  accountInfoFormGroup:   FormGroup;
  profileInfoFormGroup:   FormGroup;
  selectedProfile: string;
  selectedGender: string;
  profileTypeList: Observable<ProfileType[]>;

  userRef: Observable<AppUser | null>;
  user: AppUser;

  formErrors = {
    'email': '',
    'password': ''
  };

  validationMessages = {
    'email': {
      'required':      'Email is required.',
      'email':         'Email must be a valid email'
    },
    'password': {
      'pattern':       'Password must be include at one letter and one number.',
      'minlength':     'Password must be at least 4 characters long.',
      'maxlength':     'Password cannot be more than 40 characters long.',
    }
  };

  constructor(private formBuilder: FormBuilder,
              public authenticationService: AuthenticationService,
              private geocodeService: LocationService,
              private ref: ChangeDetectorRef,
              private router: Router,
              private profileTypeFinder: ProfileTypeFinderService) {
                this.userRef = authenticationService.user;
                this.userRef.subscribe(u => {this.user = u;
                  if (u) {
                    this.buildForm();
                  }
                });
              }

  ngOnInit() {
    this.accountInfoFormGroup = this.formBuilder.group({
      emailCtrl:            ['', [<any>Validators.required, <any>Validators.email] ],
      passwordCtrl:         ['', [<any>Validators.required] ],
      confirmPasswordCtrl:  ['', [<any>Validators.required] ]
    });

    this.profileInfoFormGroup = this.formBuilder.group({
      profileTypeCtrl:    ['', [<any>Validators.required] ],
      firstnameCtrl:      ['', [<any>Validators.required] ],
      lastnameCtrl:       ['', [<any>Validators.required] ],
      addressCtrl:        ['', [<any>Validators.required] ],
      zipCodeCtrl:        ['', [<any>Validators.required] ],
      cityCtrl:           ['', [<any>Validators.required] ],
      countryCtrl:        ['', [<any>Validators.required] ],
      telephoneCtrl:      ['', [<any>Validators.required] ],
      enable:             Boolean,
      genderCtrl:         ['0', [<any>Validators.required] ],
      dobCtrl:            ['', [<any>Validators.required] ]
    });
    this.profileTypeList = this.profileTypeFinder.getTypes();

  }

  private buildForm(): void {

    this.accountInfoFormGroup = this.formBuilder.group({
      emailCtrl:            [this.user.email, [<any>Validators.required, <any>Validators.email] ],
      passwordCtrl:         ['', [<any>Validators.required] ],
      confirmPasswordCtrl:  ['', [<any>Validators.required] ]
    });

    this.profileInfoFormGroup = this.formBuilder.group({
      profileTypeCtrl:    [this.user.profileType, [<any>Validators.required] ],
      firstnameCtrl:      [this.user.firstname, [<any>Validators.required] ],
      lastnameCtrl:       [this.user.lastname, [<any>Validators.required] ],
      addressCtrl:        [this.user.address.address, [<any>Validators.required] ],
      zipCodeCtrl:        [this.user.address.zipCode, [<any>Validators.required] ],
      cityCtrl:           [this.user.address.city, [<any>Validators.required] ],
      countryCtrl:        [this.user.address.country, [<any>Validators.required] ],
      telephoneCtrl:      [this.user.telephone, [<any>Validators.required] ],
      enable:             Boolean,
      genderCtrl:         [this.user.gender, [<any>Validators.required] ],
      dobCtrl:            [this.user.birthDate, [<any>Validators.required] ]
    });

    this.accountInfoFormGroup.valueChanges.subscribe(data => this.onValueChangedOnAccountInfo(data));
    this.profileInfoFormGroup.valueChanges.subscribe(data => this.onValueChangedOnProfileInfo(data));
  }

  onAccountInfoFormNext(): void {

  }

  onAddressLookup() {
    const address = <Address>{};
    address.address = this.profileInfoFormGroup.get('addressCtrl').value;
    address.zipCode = this.profileInfoFormGroup.get('zipCodeCtrl').value;
    address.city    = this.profileInfoFormGroup.get('cityCtrl').value;
    address.country = this.profileInfoFormGroup.get('countryCtrl').value;
    this.lookupAddressToCoordinates(address);
  }

  onSignUpFormSubmit(): void {
    //  verify that all data are present and submit calling the AuthenticationService method signUpWithEmailAndPassword

    // Creation of User Object
    const registeredUser = <AppUser>{};
    registeredUser.uid = this.user.uid;
    registeredUser.email        = this.accountInfoFormGroup.get('emailCtrl').value;
    registeredUser.profileType  = this.profileInfoFormGroup.get('profileTypeCtrl').value;
    registeredUser.firstname    = this.profileInfoFormGroup.get('firstnameCtrl').value;
    registeredUser.lastname     = this.profileInfoFormGroup.get('lastnameCtrl').value;
    registeredUser.displayName  = this.profileInfoFormGroup.get('firstnameCtrl').value + ' '
      + this.profileInfoFormGroup.get('lastnameCtrl').value;
    const address = <Address>{};
    address.address = this.profileInfoFormGroup.get('addressCtrl').value;
    address.zipCode = this.profileInfoFormGroup.get('zipCodeCtrl').value;
    address.city    = this.profileInfoFormGroup.get('cityCtrl').value;
    address.country = this.profileInfoFormGroup.get('countryCtrl').value;

    address.location = new GeoPoint(this.location && this.location.lat ? this.location.lat : 0,
      this.location && this.location.lng ? this.location.lng : 0);

    registeredUser.address      = address;

    registeredUser.telephone    = this.profileInfoFormGroup.get('telephoneCtrl').value;
    registeredUser.gender       = this.profileInfoFormGroup.get('genderCtrl').value;
    registeredUser.birthDate    = this.profileInfoFormGroup.get('dobCtrl').value;
    registeredUser.enable = true;
    // Call of Authentication service with method signUpWithEmailAndPassword
    this.authenticationService.updateUser(
      registeredUser,
      this.accountInfoFormGroup.get('passwordCtrl').value
    );
    this.router.navigate(['/welcome']);


  }

  // Updates validation state on form changes.
  onValueChangedOnAccountInfo(data?: any) {
    if (!this.accountInfoFormGroup) { return; }
    const form = this.accountInfoFormGroup;
    for (const field of Object.keys(this.formErrors) ) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key of Object.keys(control.errors) ) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
    }

  onValueChangedOnProfileInfo(data?: any) {
    if (!this.profileInfoFormGroup) { return; }
    const form = this.profileInfoFormGroup;
    for (const field of Object.keys(this.formErrors) ) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key of Object.keys(control.errors) ) {
          this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }

  lookupAddressToCoordinates(addressToBeLookedUp: Address) {
    this.loading = true;
    const location = addressToBeLookedUp.address + ' ' + addressToBeLookedUp.zipCode  + ' ' + addressToBeLookedUp.city;
    this.geocodeService.geocodeAddress(location)
      .subscribe(

        retrievedLocation => {
          this.location = retrievedLocation;
          this.loading = false;
          this.ref.detectChanges();
        }

      );
  }

}
