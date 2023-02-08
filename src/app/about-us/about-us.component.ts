import { Component, OnInit } from '@angular/core';
import { ContactFormDialogComponent } from '../contact-form-dialog/contact-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
declare const loadScript: any;
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  audio;
  playing: boolean;
  audioLoading: boolean;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  loadScript();
  }

  openAudio() {
    if (this.audioLoading) {
      return;
    }
    if (!this.audio) {
      this.audio = new Audio('../../../assets/audio/sue_knight.mp3');
      this.audioLoading = true;
      this.audio.load();

      this.audio.addEventListener('canplaythrough', () => {
        this.audio.play();
        this.audio.addEventListener('playing', () => {
          this.audioLoading = false;
          this.playing = true;
        });
      });
    } else {
      if (this.playing) {
        this.playing = false;
        this.audio.pause();
      } else {
        this.playing = true;
        this.audio.play();
      }
    }
  }

  openSendMessage() {
    this.dialog.open(ContactFormDialogComponent, {
      width: '40em',
    });
  }

}
