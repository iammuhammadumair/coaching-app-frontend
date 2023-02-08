import { Component, OnInit, Input } from '@angular/core';
import { City } from 'src/app/models/city';
import { PropertyType } from 'src/app/models/property-type';
import { SearchOption } from 'src/app/models/search-option';
import { Observable } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import { CityFinderService } from 'src/app/services/city-finder.service';
import { ReTypeFinderService } from 'src/app/services/re-type-finder.service';
import { CountriesFinderService } from 'src/app/services/countries-finder.service';
import { Country } from 'src/app/models/Country';
import { LanguagesFinderService } from 'src/app/services/languages-finder.service';
import { Language } from 'src/app/models/Language';
import { specialtiesTranslations } from '../../auth/coachadmins/coach-form/coach-form.component';
import {
  CoachFinderFirestoreService,
} from "src/app/services/coach-finder-firestore.service";
import { Router } from "@angular/router";
import { Coach } from "src/app/models/Coach";

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

  @Input() source: string;

  searchOpt: SearchOption;
  selectedCoachName: string;
  selectedType: PropertyType;
  selectedCity: string;
  // selectedCountry: string;
  selectedLanguage: string;
  maxPrice: any = 5000000;
  coachTopic: string;
  initialized: boolean;
  specialtiesTranslations = specialtiesTranslations;

  // countriesList: Observable<Country[]>;
  cityList: Observable<City[]>;
  propertyTypeList: Observable<PropertyType[]>;
  languagesList: Observable<Language[]>;
  coachNameList: Observable<Coach[]>;
  constructor(
    private sServ: SearchService,
    private countriesFinder: CountriesFinderService,
    private cityFinder: CityFinderService,
    private languageFinder: LanguagesFinderService,
    private reTypeFinder: ReTypeFinderService,
    private router: Router,
    private CoachFinderServices: CoachFinderFirestoreService

  ) {
    // this.countriesList = this.countriesFinder.getCountries();
    this.cityList = this.cityFinder.getCities();
    this.languagesList = this.languageFinder.getLanguages();
    this.propertyTypeList = this.reTypeFinder.getTypes();
    this.coachNameList = this.CoachFinderServices.getCoaches();
  }

  ngOnInit() {
    this.sServ.currentOption.subscribe(current => {
      if (!this.initialized) {
        this.initialized = true;

        if (current) {
          this.selectedCoachName = current.coachName;
          // this.selectedCountry = current.country;
          this.selectedCity = current.city;
          this.selectedLanguage = current.language;
          this.coachTopic = current.specialty;
          if (current.sponsoring) {
            this.maxPrice = 'sponsor';
          } else {
             this.maxPrice = 'All';
            // this.maxPrice = current.maxPrice;
          }
        }
      }
    });
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  searchRe() {
    this.searchOpt = new SearchOption();

     if (this.selectedCoachName) {
      this.searchOpt.coachName = this.selectedCoachName;
    }
    // if (this.selectedCountry) {
    //   this.searchOpt.country = this.selectedCountry;
    // }
    if (this.selectedCity) {
      this.searchOpt.city = this.selectedCity;
    }
    if (this.selectedLanguage) {
      this.searchOpt.language = this.selectedLanguage;
    }
    if (this.maxPrice === 'sponsor') {
      this.searchOpt.sponsoring = true;
    }
    if (this.maxPrice === 'All') {
      this.searchOpt.maxPrice = 500000;
    } else {
      this.searchOpt.maxPrice = this.maxPrice;
    }
    this.searchOpt.specialty = this.coachTopic;
    this.sServ.setSearchOption(this.searchOpt);
  }
}
