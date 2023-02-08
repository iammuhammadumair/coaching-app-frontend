import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rating } from '../models/Rating';
import { CalendarService } from '../calendar.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-reviews-dialog',
  templateUrl: './reviews-dialog.component.html',
  styleUrls: ['./reviews-dialog.component.css']
})
export class ReviewsDialogComponent implements OnInit {

  reviewsCollection: Observable<Array<Rating>>;
  reviews: Observable<Array<Rating>>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ReviewsDialogComponent>,
    private afFirestore: AngularFirestore,
    private calendar: CalendarService
  ) { }

  ngOnInit() {
    this.getCoachReviews();
  }

  getCoachReviews() {
    this.reviewsCollection = this.afFirestore.collection<Rating>(
      'ratings', ref => ref.where('coach', '==', this.data.coach.id)
    ).valueChanges();
    this.reviews = this.reviewsCollection.pipe(map(ratings => {
      return ratings.map(rating => {
        rating['date'] = this.getDateDifference(rating.created);
        return rating;
      });
    }));
  }

  getDateDifference(created) {
    const jsCreated = this.calendar.getJsDateFromTimestampDate(created);
    const now = moment();
    const momentCreated = moment(jsCreated);
    const daysDiff = now.diff(momentCreated, 'days');

    if (daysDiff > 0) {
      return `${daysDiff} days ago`;
    }
    const hoursDiff = now.diff(momentCreated, 'hours');
    if (hoursDiff > 0) {
      return `${hoursDiff} hours ago`;
    }
    return `A moment ago`;
  }

}
