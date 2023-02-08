import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import {UrlSafePipePipe} from 'src/app/pipes/url-safe-pipe.pipe';
import { Coach } from 'src/app/models/Coach';


@Component({
  selector: 'app-coach-last-update',
  templateUrl: './coach-last-update.component.html',
  styleUrls: ['./coach-last-update.component.css'],
  providers: [UrlSafePipePipe]
})
export class CoachLastUpdateComponent implements OnInit {

  @Input() coach: Coach;
  @Output() coachEvent = new EventEmitter<Coach>();


  constructor(private savePipe: UrlSafePipePipe) { }

  coachImage: string;
  update: string;
  ngOnInit() {
    this.coachImage = this.coach.coachImage ? this.coach.coachImage : '';
    this.update = this.coach.lastUpdate ? new Date(this.coach.lastUpdate).toLocaleDateString() : '';
  }

  getSavePipeImg(url: string) {
    if ( url !== '') {
      return this.savePipe.transformStyle('url(' + url + ')');
    } else {
      return '';
    }
  }

  mouseEnter() {
    this.coachEvent.emit(this.coach);
  }

  mouseLeave() {
    this.coachEvent.emit(new Coach());
  }
}
