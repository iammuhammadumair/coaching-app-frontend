import { Component, OnInit, ChangeDetectorRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { Coach } from 'src/app/models/Coach';
import { CoachFinderFirestoreService } from '../../../services/coach-finder-firestore.service';
import { SearchService } from '../../../services/search.service';
import { SearchOption } from 'src/app/models/search-option';
import { Observable, Subscription } from 'rxjs';
import { SlidesOutputData } from 'ngx-owl-carousel-o';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})

export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() source: string;

  customOptions: any = {
    autoWidth: true,
    loop: false,
    dotsSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    smartSpeed: 400,
    dragEndSpeed: 350,
    center: false,
    dots: false,
    navText: [
      '<i class=\"material-icons md-light md-24\">chevron_left</i>',
      '<i class=\"material-icons md-light md-24\">chevron_right</i>'
    ],
    nav: true
  };

  activeSlides: SlidesOutputData;
  searchOpt: SearchOption;
  public carouselData: Array<any> = [];
  public coachesColl: Observable<Coach[]>;
  public carouselTileItems$: Coach[];
  subscriptions: Subscription[] = [];
  user;
  role;

  constructor(
    private finder: CoachFinderFirestoreService,
    private sServ: SearchService,
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.initData();
    if (!this.searchOpt) {
      this.searchOpt = new SearchOption();
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initData() {
    this.subscriptions.push(
      this.authenticationService.user.subscribe(u => {
        this.user = u;
        this.role = (this.user && this.user.profileType ? this.user.profileType.toLocaleLowerCase() : '');
        this.getCoaches();
      })
    );
  }

  getCoaches() {
    this.subscriptions.push(
      this.sServ.currentOption.subscribe(receiveddata => {
        this.searchOpt = receiveddata;
        this.carouselData = [];

        const proBono = (this.role === 'client' && this.user.sponsored);
       // const coachAgent = proBono ? this.user.coachAgent : null;
        const coachAgent = null;
        if (this.source === 'client') {
          this.coachesColl = this.finder.getCoachesBySearchForClientPage(this.searchOpt, coachAgent);
        } else {
          this.coachesColl = this.finder.getCoachesBySearch(this.searchOpt, coachAgent);
        }

        this.subscriptions.push(
          this.coachesColl.subscribe(results => {
            this.carouselData = [];
            results = results.filter(e=>e.coachAgent !="ZyVJ2QjnN5NNdOqLH7NJflzjpQw2");
            const len = results.length;
            for (let i = 0; i < len; i++) {
              const j = i + 1;
              if (results[i].id) {
                this.carouselData.push({
                  id: `slide-${j}`,
                  text: results[i].id,
                  dotContent: `text${j}`
                });
              }
            }
          })
        );
      })
    );
  }

  removeLastSlide() {
    this.carouselData.splice(-1, 1);
  }
}
