import { Component, OnInit, ElementRef} from '@angular/core';
import { Coach } from 'src/app/models/Coach';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideosService } from 'src/app/services/videos.service';
import { MatDialog } from '@angular/material/dialog';
import { SubscribeComponent } from 'src/app/subscribe/subscribe.component';
import { CanonicalService } from '../../../services/canonical.service';
declare const loadScript: any;
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})

export class VideosComponent implements OnInit {
  PageContentData: any;
  coach: Coach;
  ViewVideoUrl: SafeResourceUrl;
  VideosData: any;
  videoplayer: ElementRef;
  constructor(public sanitizer: DomSanitizer,
    private VideoServices: VideosService, private dialog: MatDialog, private canonical : CanonicalService) { }

  ngOnInit() {
     // loadScript();
    this.VideoServices.GetVideosRecords().subscribe(data => {
      const d = [];
      data.forEach(e => {
        d.push(e.payload.doc.data());
      });
      this.VideosData = d;
      console.log(this.VideosData);
    });
    this.GetPageData();
  }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  Subscribe() {
    this.dialog.open(SubscribeComponent, {
      width: '40em',
    });
  }

  GetPageData() {
    this.VideoServices.GetPageContentRecords().subscribe(data => {
      const d = [];
      data.forEach(e => {
        const id = e.payload.doc.id;
        d.push(e.payload.doc.data());
      });
      this.PageContentData = d;
      console.log(this.PageContentData);
    });
  }
}
