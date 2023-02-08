import { Component, OnInit } from '@angular/core';
  declare const loadScript: any;
@Component({
  selector: 'app-who-we-are',
  templateUrl: './who-we-are.component.html',
  styleUrls: ['./who-we-are.component.css']
})
export class WhoWeAreComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  loadScript();

  }

}
