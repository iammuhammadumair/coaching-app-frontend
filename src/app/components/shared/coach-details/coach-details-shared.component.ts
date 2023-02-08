import {Component, Input} from '@angular/core';
import {Coach} from '../../../models/Coach';
import {AppUser} from '../../../models/AppUser';
import {faBed, faShower} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-coach-details-shared',
  templateUrl: './coach-details-shared.component.html',
  styleUrls: ['./coach-details-shared.component.css']
})
export class CoachDetailsSharedComponent {

  @Input() coach: Coach;
  @Input() coachAgent: AppUser;
  @Input() displayDirection = 'column';

  iconBathroom = faShower; // / bath / toilet
  iconBedroom = faBed;

  constructor() { }

  getUrl(url: string) {
    if (url.startsWith('http://')) {
      return url;
    } else {
      return 'http://' + url;
    }
  }

  getDisplayDirection(): string {
    return this.displayDirection;
  }
}
