import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatBottomSheet} from '@angular/material/bottom-sheet';
import { MatIconRegistry} from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AppUser } from '../../../models/AppUser';
import { Address } from '../../../models/adress';
import { PrivacyComponent } from 'src/app/components/public/privacy/privacy.component';
import { ConditionComponent } from 'src/app/components/public/condition/condition.component';
import GeoPoint = firebase.firestore.GeoPoint;
import { AuthenticationService } from '../../../services/authentication.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileTypeFinderService } from 'src/app/services/profile-type-finder.service';
import { ProfileType } from 'src/app/models/profile-type';
import { LocationService } from '../../../services/location.service';


@Component({
  selector: 'app-user-info-dialog',
  templateUrl: 'user-info-dialog.component.html',
  styleUrls: ['./user-info-dialog.component.css']
})
export class UserInfoDialogComponent {

  location: { lat: number, lng: number };
  loading: boolean;
  mapMessage = '';
  selectedGender: string;

  enable: Boolean;
  confirmEmail: Boolean;
  deleted: Boolean;
  selectedProfile: string;
  userForm: FormGroup;
  user: AppUser;
  updatedUser: AppUser;
  userRef: Observable<AppUser>;
  profileTypes: Observable<ProfileType[]>;

  constructor(public dialogRef: MatDialogRef<UserInfoDialogComponent>,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    public authenticationService: AuthenticationService,
    private profileTypeFinder: ProfileTypeFinderService,
    private formbuilder: FormBuilder,
    private bottomSheet: MatBottomSheet,
    private geocodeService: LocationService,
    @Inject(MAT_DIALOG_DATA) public data: AppUser
  ) {
    this.user = data;
    this.selectedProfile = this.user.profileType;
    this.bindUser();
    iconRegistry.addSvgIcon(
      'update',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/update.svg')
    );
    this.profileTypes = this.profileTypeFinder.getTypes();
  }

  bindUser() {
    if (this.user) {
      if (this.selectedProfile !== 'Client') {
        this.enable = this.user.enable ? true : false;
        this.confirmEmail = this.user.confirmEmail ? true : false;
        this.userForm = this.formbuilder.group({
          profileType: [this.user.profileType, ''],
          firstname: [this.user.firstname, ''],
          lastname: [this.user.lastname, ''],
          addressCtrl: [(this.user.address) ? this.user.address.address : '', ''],
          zipCodeCtrl: [(this.user.address) ? this.user.address.zipCode : '', ''],
          cityCtrl: [(this.user.address) ? this.user.address.city : '', ''],
          countryCtrl: [(this.user.address) ? this.user.address.country : '', ''],
          telephone: [this.user.telephone, ''],
          enable: [this.user.enable ? true : false],
          confirmEmail: [this.user.confirmEmail ? true : false],
          gender: [this.user.gender, ''],
          birthDate: [this.user.birthDate ? this.user.birthDate.toDate() : ''],
          privacyCtrl: [this.user.privacy ? true : false],
          termCtrl: [this.user.termAndCondition ? true : false]
        });
        this.onAddressLookup();
      } else {
        this.enable = this.user.enable ? true : false;
        this.confirmEmail = this.user.confirmEmail ? true : false;
        this.userForm = this.formbuilder.group({
          profileType: [this.user.profileType, ''],
          firstname: [this.user.firstname, ''],
          lastname: [this.user.lastname, ''],
          enable: [this.user.enable ? true : false],
          confirmEmail: [this.user.confirmEmail ? true : false],
          privacyCtrl: [this.user.privacy ? true : false]
        });
      }
    }
  }

  save() {
    const registeredUser = <AppUser>{};
    registeredUser.email = this.user.email;
    registeredUser.profileType = this.user.profileType;
    registeredUser.sponsored = this.user.sponsored;
    registeredUser.firstname = this.userForm.get('firstname').value;
    registeredUser.lastname = this.userForm.get('lastname').value;
    registeredUser.displayName = this.userForm.get('firstname').value + ' '
      + this.userForm.get('lastname').value;

    if (registeredUser.profileType === 'Client') {
      registeredUser.telephone = this.user.telephone;
      registeredUser.gender = this.user.gender;
      registeredUser.birthDate = this.user.birthDate;
      registeredUser.address = this.user.address;
      registeredUser.termAndCondition = this.user.termAndCondition;
      registeredUser.address = this.user.address;
      registeredUser.telephone = this.user.telephone;
      registeredUser.gender = this.user.gender;
      registeredUser.birthDate = this.user.birthDate;
      registeredUser.termAndCondition = this.user.termAndCondition;
    } else {
      const address = <Address>{};
      address.address = this.userForm.get('addressCtrl').value;
      address.zipCode = this.userForm.get('zipCodeCtrl').value;
      address.city = this.userForm.get('cityCtrl').value;
      address.country = this.userForm.get('countryCtrl').value;
      address.location = new GeoPoint(this.location && this.location.lat ? this.location.lat : 0,
        this.location && this.location.lng ? this.location.lng : 0);
      registeredUser.address = address;
      registeredUser.telephone = this.userForm.get('telephone').value;
      registeredUser.gender = this.userForm.get('gender').value;
      registeredUser.birthDate = this.userForm.get('birthDate').value;
      registeredUser.termAndCondition = this.userForm.get('termCtrl').value;
    }

    registeredUser.privacy = this.userForm.get('privacyCtrl').value;
    registeredUser.enable = this.userForm.get('enable').value;
    registeredUser.confirmEmail = this.userForm.get('confirmEmail').value;
    registeredUser.deleted = this.user.deleted;
    registeredUser.offers = this.user.offers;
    registeredUser.bookmarks = this.user.bookmarks;
    registeredUser.requests = this.user.requests;
    registeredUser.uid = this.user.uid;
    registeredUser.photoURL = this.user.photoURL;

    // Call of Authentication service with method signUpWithEmailAndPassword
    this.authenticationService.updateUserData(registeredUser);
    this.dialogRef.close();
  }

  onAddressLookup() {
    const address = <Address>{};
    address.address = this.userForm.get('addressCtrl').value;
    address.zipCode = this.userForm.get('zipCodeCtrl').value;
    address.city = this.userForm.get('cityCtrl').value;
    address.country = this.userForm.get('countryCtrl').value;
    this.lookupAddressToCoordinates(address);
  }

  lookupAddressToCoordinates(addressToBeLookedUp: Address) {
    this.loading = true;
    this.mapMessage = 'loading information...';
    const location = addressToBeLookedUp.address + ' ' + addressToBeLookedUp.zipCode +
      ' ' + addressToBeLookedUp.city + ' ' + addressToBeLookedUp.country;
    this.geocodeService.geocodeAddress(location)
    .subscribe(retrievedLocation => {
        this.location = { lat: retrievedLocation.lat, lng: retrievedLocation.lng };
        this.mapMessage = retrievedLocation.message;
        this.loading = false;
      }
    );
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

  getErrorMessage() {
  }
}
