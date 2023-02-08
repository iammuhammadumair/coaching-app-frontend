import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContactFormDialogComponent } from 'src/app/contact-form-dialog/contact-form-dialog.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openSendMessage() {
    this.dialog.open(ContactFormDialogComponent, {
      width: '40em',
    });
  }

}
