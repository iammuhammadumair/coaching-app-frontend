import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Coach } from 'src/app/models/Coach';
import {CoachShowPopupComponent} from '../coach-show-popup/coach-show-popup.component';
import {CoachCrudDialogComponent} from '../coach-crud-dialog/coach-crud-dialog.component';

@Component({
  selector: 'app-coach-card',
  templateUrl: './coach-card.component.html',
  styleUrls: ['./coach-card.component.css']
})


export class CoachCardComponent implements OnInit {


  @Input() coach: Coach;
  @Input() source: string;

  dialogRef: MatDialogRef<CoachShowPopupComponent>;
  reFormRef: MatDialogRef<CoachCrudDialogComponent>;
  video: string;
  imageRE: string;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.video = '=';
    this.imageRE = this.getIcon();
    // console.log(this.video);
  }

  openDialog(coach: Coach) {

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

  openFormRe(coach: Coach) {
    this.reFormRef = this.dialog.open(CoachCrudDialogComponent, {
      hasBackdrop: true,
      data: coach,
      width: '80%'
    });
    this.reFormRef.afterClosed().subscribe(
        data => console.log('Form value:', data)
    );
  }

  getIcon() {
    const random = Math.floor(Math.random() * 4) + 1;

    switch (random) {
      case 1: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/897b8a8d-9b25-4692-83e2-a490b192e626.jpeg';
         break;
      }
      case 2: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/378a6356-d5ae-40b6-8e29-c9a289d8347a.jpg';
        break;
      }
      case 3: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/LOTCASA%40.jpeg';
        break;
      }
      case 4: {
        return 'https://irp-cdn.multiscreensite.com/223b9c0a/dms3rep/multi/mobile/Grahamcasa.jpeg';
        break;
      }
   }

  }

}
