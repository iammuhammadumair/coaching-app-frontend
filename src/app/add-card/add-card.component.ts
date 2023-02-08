import { Component, OnInit, Inject,EventEmitter,Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppUser } from '../models/AppUser';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {

  user: AppUser;
  coach;
  loading;
  continent;

  paymentMade = new EventEmitter<any>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<AddCardComponent>
  ) {
    dialogRef.disableClose = true;
    this.user = data.user;
    this.coach = data.coach;
    this.continent = data.continent;
  }

  ngOnInit() {
    // this.paymentComplete('test')
  }
  

  paymentComplete($event){
    this.paymentMade.emit($event)
  }

  close() {
    if (this.loading) {
      return;
    }
    this.paymentComplete(false)
    this.dialogRef.close(false);
  }
}
