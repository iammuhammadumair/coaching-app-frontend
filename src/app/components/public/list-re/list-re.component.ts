import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Coach} from '../../../models/Coach';
import {Country} from '../../../models/Country';
import {LocationFinderService} from '../../../services/location-finder.service';
import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';

@Component({
  selector: 'app-list-re',
  templateUrl: './list-re.component.html',
  styleUrls: ['./list-re.component.css']
})
export class ListReComponent implements OnInit {

  @Input() country: string;

  selectedCoach: Coach;

  public countries: Observable<Country[]>;

  public coaches: Observable<Coach[]>;

  constructor(private coachFinderService: CoachFinderFirestoreService, private locationFinderService: LocationFinderService) { }

  ngOnInit() {
    this.countries = this.locationFinderService.getCountries();

    this.coaches = this.coachFinderService.getCoaches();
  }

  onSelect(coach: Coach): void {
    this.selectedCoach = coach;
  }
}
