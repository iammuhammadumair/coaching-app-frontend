import { Component, OnInit} from '@angular/core';
import {BlogService} from 'src/app/services/blog.service';
import {MatDialog} from '@angular/material/dialog';
import {SubscribeComponent} from 'src/app/subscribe/subscribe.component';
import {CanonicalService} from '../../../services/canonical.service';
import {Meta, Title} from '@angular/platform-browser';

declare const loadScript: any;
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {
  GetBlogData: any;
  shortdescription: string;
  constructor(private blogService: BlogService, private dialog: MatDialog,  private canonical: CanonicalService,
    private meta:Meta, private title:Title) { 
      this.meta.addTags([  { name: 'description', content: 'This is an article about Angular Meta service' },
      { name: 'keywords', content: 'angular, javascript, typescript, meta, seo' } ]);
    }



  ngOnInit() {
     loadScript();
    this.GetPageData();
    this.canonical.createCanonicalLink();
  }


  GetPageData() {
    this.blogService.GetblogsRecords().subscribe(data => {
      const d = [];
      let counter = 0;
      data.forEach(e => {
        const id = e.payload.doc.id;
        d.push(e.payload.doc.data());
        d[counter].ID = id;
        counter = counter + 1;
      });
      this.GetBlogData = d;
      this.shortdescription = this.GetBlogData.BlogDescription;
    });
  }

  Subscribe() {
    this.dialog.open(SubscribeComponent, {
      width: '40em',
    });
  }

  blogdetails(data) {
    this.blogService.changeMessage(data);
  }

}
