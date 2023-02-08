import { Component, ElementRef, AfterViewInit, ViewChild, Input, OnDestroy } from '@angular/core';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})

export class SubscriberComponent implements AfterViewInit, OnDestroy {
  @ViewChild('subscriberDiv') subscriberDiv: ElementRef;
  @Input() session: OT.Session;
  @Input() stream: OT.Stream;

  subscriber;

  constructor() { }

  ngAfterViewInit() {
    this.subscriber = this.session.subscribe(this.stream, this.subscriberDiv.nativeElement, {
      style: {
        buttonDisplayMode: 'off',
       // fitMode: 'contain'
      },
      fitMode: 'contain'
    }, (err) => {
      if (err) {
        console.log(err.message);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriber && this.subscriber.unsubscribe) {
      this.subscriber.unsubscribe();
    }
  }
}
