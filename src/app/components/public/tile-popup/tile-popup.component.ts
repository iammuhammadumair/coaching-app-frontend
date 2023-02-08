import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coach } from 'src/app/models/Coach';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-tile-popup',
  templateUrl: './tile-popup.component.html',
  styleUrls: ['./tile-popup.component.css']
})
export class TilePopupComponent implements OnInit {

  coach: Coach;
  source: string;
  constructor(public sanitizer: DomSanitizer, private dialogRef: MatDialogRef<TilePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.coach = data.coach;
    this.source = data.source;
  }

  ngOnInit() {
  }
}
