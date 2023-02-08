import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from 'src/app/services/messages.service';
import { Observable } from 'rxjs';
import { Message } from 'src/app/models/message';
import { environment } from 'src/environments/environment';
import { ContactFormDialogComponent } from 'src/app/contact-form-dialog/contact-form-dialog.component';
import { CanonicalService } from '../../../services/canonical.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  form: FormGroup;
  sentMessage: Message = null;
  showSentMessage = false;
  sending = true;
  subject = '';

  constructor(private formbui: FormBuilder, private dialog: MatDialog,
    private sendMessage: MessagesService, private canonical: CanonicalService) { }

  ngOnInit() {
    this.canonical.createCanonicalLink();
    this.initForm();
    this.canonical.createCanonicalLink();
  }

  sendMail() {
    if (!this.form.invalid) {
      this.showSentMessage = true;
      this.sendMessage.addMessage(
        this.form.get('from').value,
        environment.mailToContactUs,
        this.form.get('subject').value,
        this.form.get('message').value
      ).then(idMessage => {
        this.sendMessage.getMessage(idMessage).subscribe(result => {
          if (result !== null) {
            this.subject = result.subject;
            this.sending = !result.messageSent;
          } else {
            this.sending = true;
          }
        });
      });
    }
  }

  showSendedMessage(templateRef) {
    this.dialog.open(templateRef);
  }

  closeMessage() {
    this.showSentMessage = false;
    this.sending = true;
    this.initForm();
  }

  initForm() {
    this.form = this.formbui.group(
      {
        from: ['', Validators.compose([Validators.required, Validators.email])],
        subject: ['Request information', Validators.required],
        message: ''

      }
    );
  }

  openSendMessage() {
    this.dialog.open(ContactFormDialogComponent, {
      width: '40em',
    });
  }
}
