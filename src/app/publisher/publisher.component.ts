import { Component, AfterViewInit, ViewChild, Input, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { OpentokService } from '../opentok.service';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})
export class PublisherComponent implements AfterViewInit, OnDestroy {
  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  @Input() session: OT.Session;
  publisher: OT.Publisher;
  publishing: Boolean;
  error;
  retried;
  audioInputDevices;
  videoInputDevices;
  audioIndex = 0;
  videoIndex = 0;
  attempts = 0;

  constructor(
    private opentokService: OpentokService,
    private ref: ChangeDetectorRef
  ) {
    this.publishing = false;
  }

  ngOnDestroy() {
    if (this.publisher) {
      this.publisher.destroy();
    }
  }

  ngAfterViewInit() {
    try {
      this.initPublisher();
    } catch (e) {
      console.log(e);
    }
  }

  initPublisher() {
    const OTObject = this.opentokService.getOT();

    this.getDevices();
    const el = this.publisherDiv.nativeElement;
    this.publisher = OTObject.initPublisher(el, this.getPubOptions(), (e) => {
      this.publisherCallback(e);
    });
    this.publisher.on('streamDestroyed', function (event) {
      event.preventDefault();
      console.log('The publisher stopped streaming.');
    });
  }

  publisherCallback(e) {
    if (e) {
      if (this.attempts > 3) {
        this.error = e;
        console.log(this.error);
        // if (this.error.message) {
        //   this.error.message = this.error.message.split('(')[0];
        // }
        this.ref.detectChanges();
        return;
      }
      this.attempts++;
      this.publisher.destroy();
      this.publisher = null;

      setTimeout(() => {
        this.initPublisher();
      }, 3000);

    } else {
      if (this.session) {
        if (this.session['isConnected']()) {
          this.publish();
        }
        this.session.on('sessionConnected', () => {
          this.publish();
        });
        this.session.on('sessionDisconnected', () => {
          this.publish();
        });
      }
    }
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }

  getDevices() {
    OT.getDevices((error, devices) => {
      this.audioInputDevices = devices.filter(function(element) {
        return element.kind === 'audioInput';
      });
      this.videoInputDevices = devices.filter(function(element) {
        return element.kind === 'videoInput';
      });
    });
  }

  getPubOptions() {
    const options: any = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      fitMode: 'contain'
    };
    if (this.audioInputDevices && this.audioInputDevices.length) {
      options.audioSource = this.audioInputDevices[this.audioIndex].deviceId;
    }
    if (this.videoInputDevices && this.videoInputDevices.length) {
      options.videoSource = this.videoInputDevices[this.videoIndex].deviceId;
    }
    return options;
  }
}
