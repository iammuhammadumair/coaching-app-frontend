import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Coach } from 'src/app/models/Coach';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {CoachShowPopupComponent} from 'src/app/components/public/coach-show-popup/coach-show-popup.component';

@Component({
  selector: 'app-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.css']
})
export class CoachDetailsComponent implements OnInit {

  @Input() coach: Coach;

  re3DVideo: SafeResourceUrl;
  dialogRef: MatDialogRef<CoachShowPopupComponent>;

  constructor(private sanitizer: DomSanitizer, private dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(coach: Coach, viedoType: string) {
    // if (this.source !== 'map') {
    this.dialogRef = this.dialog.open(CoachShowPopupComponent, {
      hasBackdrop: true,
      data: coach,
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh'
    });
    // }
  }

}
