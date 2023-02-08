import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.css']
})
export class FormControlComponent implements OnInit {

  @Input() textarea: boolean;

  constructor() { }

  ngOnInit() {
  }

}
