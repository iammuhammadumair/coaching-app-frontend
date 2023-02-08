import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CanonicalService } from '../../../services/canonical.service';
declare const loadScript: any;
@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  clickEventsubscription: Subscription;
  GetBlogData: any;
  count: number;
  message: string;
  constructor(private route: ActivatedRoute, private blogService: BlogService, private canonical: CanonicalService,
    public router: Router) {
    this.clickEventsubscription = this.blogService.getClickEvent('ID').subscribe(() => {
    this.incrementCount();
    });
  }

  ngOnInit() {
    this.canonical.createCanonicalLink();
    loadScript();
    const param1: string = this.route.snapshot.queryParamMap.get('id');
    this.blogService.currentMessage.subscribe(message => this.message = message);
    this.GetPageData(param1);
  }

  GetPageData(blogid: string) {
    this.blogService.GetblogsRecords().subscribe(data => {
      const d = [];
      let counter = 0;
      data.forEach(e => {
      const id = e.payload.doc.id;
      if (blogid !== '' && blogid !== null) {
      if (blogid === counter.toString()) {
       d.push(e.payload.doc.data());
          }
          counter = counter + 1;
        } else {
          if (id === this.message) {
            d.push(e.payload.doc.data());
            counter = counter + 1;
          }
        }


      });
      this.GetBlogData = d;
    
    });
  }

  blogdetails(id) {
    
  }

  incrementCount() {
    this.count++;
  }
  async close() {
    this.router.navigateByUrl('/public/blog');
  }
}
