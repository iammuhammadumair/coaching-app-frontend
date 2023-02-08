import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-button',
  templateUrl: './form-button.component.html',
  styleUrls: ['./form-button.component.css']
})
export class FormButtonComponent implements OnInit {

  @Input() type = 'submit';
  @Input() color: 'violet' | 'orange' | 'blue' =  'violet';
  @Input() size: 's' | 'm' | 'l' =  's';
  @Input() padding =  true;
  @Input() disabled = false;

  constructor() { }

  ngOnInit() {
  }

}
