import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/models/message';
import { Observable } from 'rxjs';

@Component({

  selector: 'app-request-feedback',
  templateUrl: './request-feedback.component.html',
  styleUrls: ['./request-feedback.component.css']
})
export class RequestFeedbackComponent implements OnInit {

  @Input() sentMessage: Observable<Message>;

  sending = true;
  constructor() { }

  ngOnInit() {
    if (this.sentMessage !== null) {
    this.sentMessage.subscribe(a => {
        this.sending = !a.messageSent;
      }
    );
  } else {
    this.sending = false;
  }

  }

}
