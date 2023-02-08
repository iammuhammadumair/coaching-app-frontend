import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContactFormDialogComponent } from 'src/app/contact-form-dialog/contact-form-dialog.component';
declare const loadScript: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    loadScript();
  }
openSendMessage() {
    this.dialog.open(ContactFormDialogComponent, {
      width: '40em',
    });
  }

}
