import {Component, Input, OnInit} from '@angular/core';
import {Coach} from '../../../models/Coach';

@Component({
  selector: 'app-detail-re',
  templateUrl: './detail-re.component.html',
  styleUrls: ['./detail-re.component.css']
})
export class DetailReComponent implements OnInit {

  @Input() coach: Coach;

  constructor() { }

  ngOnInit() {
  }

}
