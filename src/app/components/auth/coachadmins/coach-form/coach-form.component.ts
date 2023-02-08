import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import { AppUser } from '../../../../models/AppUser';
// Import Services
import { AuthenticationService } from '../../../../services/authentication.service';
import { Coach } from 'src/app/models/Coach';
import { Observable, Subscription, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { City } from 'src/app/models/city';
import { Country } from 'src/app/models/Country';

import { CityFinderService } from 'src/app/services/city-finder.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteConfimrComponent } from 'src/app/components/auth/shared/delete-confimr/delete-confimr.component';

import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';
import { CountriesFinderService } from 'src/app/services/countries-finder.service';
import { LanguagesFinderService } from 'src/app/services/languages-finder.service';
import * as moment from 'moment-timezone';

export const specialtiesList = [
  'Personal leadership',
  'Self-confidence',
  'Communication',
  'Public speaking',
  'Challenges',
  'Better relationship(s)',
  'Inner conflict',
  'Transition',
  'Create impact',
  'Career',
  'Business growth',
  'Professional leadership',
  'Handle stress',
  'Mental support',
  'Handle emotions',
  'Prevent Burnout',
  'Work-life balance',
  'Quit smoking',
  'Healthy lifestyle',
  'Life coaching',
  'Executive coaching',
  'Skills mentoring',
  'Resilience',
  'Mindfulness',
  'Grief',
  'Anxiety'
];

export const specialtiesTranslations = [
  { text: 'Personal leadership', value: 0 },
  { text: 'Self-confidence', value: 1 },
  { text: 'Communication', value: 2 },
  { text: 'Public speaking', value: 3 },
  { text: 'Challenges', value: 4 },
  { text: 'Better relationship(s)', value: 5 },
  { text: 'Inner conflict', value: 6 },
  { text: 'Transition', value: 7 },
  { text: 'Create impact', value: 8 },
  { text: 'Career', value: 9 },
  { text: 'Business growth', value: 10 },
  { text: 'Professional leadership', value: 11 },
  { text: 'Handle stress', value: 12 },
  { text: 'Mental support', value: 13 },
  { text: 'Handle emotions', value: 14 },
  { text: 'Prevent Burnout', value: 15 },
  { text: 'Work-life balance', value: 16 },
  { text: 'Quit smoking', value: 17 },
  { text: 'Healthy lifestyle', value: 18 },
  { text: 'Life coaching', value: 19 },
  { text: 'Executive coaching', value: 20 },
  { text: 'Skills mentoring', value: 21 },
  { text: 'Resilience', value:22},
  { text: 'Mindfulness', value:23},
  { text: 'Grief', value:24},
  { text: 'Anxiety', value:25}

]; 
@Component({
  selector: 'app-coach-form',
  templateUrl: './coach-form.component.html',
  styleUrls: ['./coach-form.component.css']
})
export class CoachFormComponent implements OnInit, OnDestroy {

  @ViewChild('adField') adRef: ElementRef;
  @ViewChild('bdField') bdRef: ElementRef;
  @ViewChild('cdField') cdRef: ElementRef;
  @ViewChild('zipField') zipRef: ElementRef;

  coach: Coach = new Coach();
  coachRef: Observable<Coach[]>;
  specialtiesTranslations = specialtiesTranslations;

  cityCk: City;
  form: FormGroup;
  title: string;
  location: { lat: number, lng: number, place_id: string, formattedAddress: string, region: string, zip_code: string };
  locationRegion: { lat: number, lng: number, place_id: string, formattedAddress: string, region: string, zip_code: string };
  uploadPercent: Observable<number>;
  cityList: Observable<City[]>;

  countryList: Observable<Country[]>;

  addressCtrl: string;
  zipCodeCtrl: string;
  cityCtrl: string;
  countryCtrl: string;

  percentage: string;
  showPerc: boolean;

  videoPercentage = 0;
  videoPercentageString: string;
  videoShowPerc: boolean;

  isNew = false;
  userRef: Observable<AppUser | null>;
  user: AppUser;
  coachAgentRef: Observable<AppUser | null>;
  coachAgent: AppUser;
  submitText;
  unsubscribe = new Subject();

  constructor(private formbui: FormBuilder, private route: ActivatedRoute,
    private coachService: CoachFinderFirestoreService,
    private cityFinder: CityFinderService,
    private countryFinder: CountriesFinderService,
    private languageFinder: LanguagesFinderService,
    private storage: AngularFireStorage,
    public snackbar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    public deleteDialog: MatDialog) {

    this.cityList = this.cityFinder.getCities();
    this.countryList = this.countryFinder.getCountries();

    this.userRef = authenticationService.user;
    this.userRef.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      if (user) {
        this.user = user;
        this.authenticationService.getUserFromUid(this.user.uid).subscribe(data => {
          if (data) {
            this.user = data;
          }
          this.bindForm();
        });
      }
    });
  }

  ngOnInit() {
    this.bindForm();
    const id = this.route.snapshot.paramMap.get('refNum');
    if (id.toString() !== 'NEW') {
      this.coachService.getCoachFromId(id.toString()).pipe(
        takeUntil(this.unsubscribe)
      ).subscribe(coach => {
        if (coach) {
          this.coach = coach;
          if (!this.coach.id) {
            this.coach.id = id.toString();
          }
          this.authenticationService.getUserFromUid(this.coach.coachAgent).pipe(
            takeUntil(this.unsubscribe)
          ).subscribe(data => {
            this.coachAgent = data;
            this.bindForm();
            this.isNew = false;
          });
        } else {
          this.router.navigate(['/unauthorized']);
        }
      });
    } else {
      this.isNew = true;
      if (this.user && this.user.profileType === 'Coach Agent') {
        this.coachAgent = this.user;
      }
    }
    this.cityCk = new City();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
  }

  bindForm() {

    this.title = this.coach && this.coach.name ? 'Update existing Coach' : 'Insert New Coach';
    this.submitText = this.coach && this.coach.name ? 'Update' : 'Create';

    this.form = this.formbui.group(
      {
        username: [this.coach ? this.coach.username : '', Validators.required],
        address: [this.coach ? this.coach.address : '', Validators.required],
        city: [this.coach ? this.coach.city : '', Validators.required],
        zipCode: [this.coach ? this.coach.zipCode : ''],
        country: [this.coach ? this.coach.country : '', Validators.required],
        dateOfBirth: [this.coach ? this.coach.dateOfBirth : ''],
        gender: [this.coach ? this.coach.gender : ''],
        sponsoring: [this.coach ? this.coach.sponsoring : ''],
        price: [this.coach ? this.coach.price : '', Validators.required],
        currency: [this.coach ? this.coach.currency : '', Validators.required],
        coachName: [this.coach ? this.coach.coachName : ''],
        language: [this.coach ? this.coach.language : ''],
        email: [this.coach ? this.coach.email : ''],
        coachVideoUrl: [this.coach && this.coach.coachVideoUrl ? this.coach.coachVideoUrl : ''],
        specialty: [this.coach ? this.coach.specialty : ''],
        coachImage: [this.coach ? this.coach.coachImage : ''],
        name: [this.coach ? this.coach.name : '', Validators.required],
        quote: [this.coach ? this.coach.quote : '']
      }
    );
  }

  get f() { return this.form.controls; }

  startUpload(event) {
    // The File object
    this.showPerc = true;
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    // The storage path
    const path = `re-images/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(path);
    const task = fileRef.put(file);

    task.percentageChanges().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(p => this.percentage = p.toString() + '%');
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(
          takeUntil(this.unsubscribe)
        ).subscribe(url => {
          this.form.patchValue({ 'coachImage': url });
          this.showPerc = false;
        });
      })
    ).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  startUploadVideo(event) {
    // The File object
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    this.videoShowPerc = true;

    // Client-side validation example
    if (file && file.name && !this.validateVideoExt(file.name)) {
      console.error('unsupported file type :( ');
      this.snackbar.open('Unsupported file type. You can upload .mov and .mp4 files.', 'Close', {
        duration: 3000,
      });
      return;
    }
    // The storage path
    const path = `re-videos/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(path);
    const task = fileRef.put(file);

    task.percentageChanges().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(
      p => {
        this.videoPercentage = parseInt(p.toString(), null);
        this.videoPercentageString = p.toString().split('.')[0] + '%';
      }
    );
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(
          takeUntil(this.unsubscribe)
        ).subscribe(url => {
          this.form.patchValue({ 'coachVideoUrl': url });
          this.videoShowPerc = false;
        });
      })
    ).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  validateVideoExt(name: String) {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'mov' || ext.toLowerCase() === 'mp4') {
      return true;
    } else {
      return false;
    }
  }

  save() {
    // stop here if form is invalid
    if (this.form.invalid) {
      this._markAsDirty(this.form);
      this.snackbar.open('Error on save. Check the form value', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.coach.address = this.form.get('address').value;
    this.coach.dateOfBirth = this.form.get('dateOfBirth').value;
    this.coach.gender = this.form.get('gender').value;
    this.coach.city = this.form.get('city').value;
    this.coach.coachName = this.form.get('coachName').value;
    // this.coach.language = this.form.get('language').value;
    this.coach.language = this.form.get('language').value.toString().split(',');
    this.coach.email = this.form.get('email').value;
    this.coach.country = this.form.get('country').value;
    this.coach.currency = this.form.get('currency').value;
    this.coach.quote = this.form.get('quote').value;
    this.coach.username = this.form.get('username').value;
    this.coach.lastUpdate = new Date().getTime();

    this.coach.price = this.form.get('price').value;
    this.coach.coachVideoUrl = this.form.get('coachVideoUrl').value;
    this.coach.coachImage = this.form.get('coachImage').value;
    this.coach.sponsoring = this.form.get('sponsoring').value;
    this.coach.specialty = this.form.get('specialty').value;
    this.coach.name = this.form.get('name').value;

    this.coach.coachAgent = this.coachAgent && this.coachAgent.uid;
    this.coach.zipCode = this.form.get('zipCode').value;
    this.coach.timezone = moment.tz.guess(true);
    this.coach.deleted = false;

    this.saveFilters();
    this.updateCoach();
  }

  saveFilters() {
    this.cityFinder.getCities().pipe(takeUntil(this.unsubscribe)).subscribe(
      cities => {
        cities = cities.filter(r => (r.Name.toUpperCase() === this.coach.city.toUpperCase()));
        if (cities.length === 0) {
          this.cityFinder.addCityIfNotExist(this.coach.city);
        }
      }
    );
    this.countryFinder.getCountries().pipe(takeUntil(this.unsubscribe)).subscribe(
      countries => {
        countries = countries.filter(r => (r.name.toUpperCase() === this.coach.country.toUpperCase()));
        if (countries.length === 0) {
          this.countryFinder.addCountryIfNotExist(this.coach.country);
        }
      }
    );
    this.languageFinder.getLanguages().pipe(takeUntil(this.unsubscribe)).subscribe(
      languages => {
      languages = languages.filter((r, index) => (r.name.toUpperCase() === this.coach.language[index].toUpperCase()));
        if (languages.length === 0) {
          this.languageFinder.addLanguageIfNotExist(this.coach.language.toString());
        }
      }
    );
  }

  updateCoach() {
    if (this.isNew) {
      // create
      this.coach.creationDate = new Date().getTime();
      this.coachService.saveCoach(this.coach).then(result => {
        if (result && result.id) {
          this.router.navigate(['/welcome']);
        }
      });
    } else {
      // update
      this.coachService.updateCoach(this.coach);
      this.snackbar.open('Coach is saved', 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/welcome']);
    }
  }

  _markAsDirty(group: FormGroup) {
    group.markAsDirty();
    for (const i in group.controls) {
      if (i) {
        group.controls[i].markAsTouched({ onlySelf: true });
      }
    }
  }

  openDeleteDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      'title': this.coach.name, 'id': this.coach.id
    };
    const dialogRef = this.deleteDialog.open(DeleteConfimrComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coach.deleted = true;
        this.coachService.updateCoach(this.coach);
        this.router.navigate(['/welcome']);
      }
    });
  }
}
