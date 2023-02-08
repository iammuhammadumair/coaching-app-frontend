import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {
  showHeaderB() {
    if (this.router.url.startsWith("/partner")) {
      return true;
    } else {
      return false;
    }
  }
  constructor(private router: Router) {
  }

  ngOnInit() {
  }

}
