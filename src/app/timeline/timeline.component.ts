import { Component, OnInit } from '@angular/core';
import { Note } from '../models/Note';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { CreateNoteDialogComponent } from '../create-note-dialog/create-note-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Coach } from '../models/Coach';
import { map } from 'rxjs/operators';
import { CalendarService } from '../calendar.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  notes: Array<Note>;
  notesCollection: AngularFirestoreCollection<Note>;
  coaches: any = {};
  role;
  user;

  constructor(
    private route: ActivatedRoute,
    private afFirestore: AngularFirestore,
    private dialog: MatDialog,
    private calendar: CalendarService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getNotes();
    this.user = this.authenticationService.user;
    this.user.subscribe(us => (this.role = (
      us && us.profileType ? us.profileType.toLocaleLowerCase() : ''
    )));
  }

  async getNotes() {
    const clientId = this.route.snapshot.params.client;
    this.notesCollection = this.afFirestore.collection<Note>(
      'notes', ref => ref.where('client', '==', clientId)
                         .orderBy('date', 'desc')
    );
    const coaches = [];
    this.notes = await this.notesCollection.get().pipe(map(
      res => res.docs.map(doc => {
        const note: Note = doc.data();
        note.id = doc.id;
        note['jsdate'] = this.calendar.getJsDateFromTimestampDate(note.date);
        note['strDate'] = this.getDateString(note['jsdate']);
        coaches.push(note.coach);
        return note;
      })
    )).toPromise();
    this.getCoaches(coaches);
  }

  async getCoaches(coaches) {
    for (const coachId of coaches) {
      if (!this.coaches[coachId]) {
        const coach = await this.afFirestore.collection<Coach>(
          'coaches'
        ).doc(coachId).get().pipe(map(doc => doc.data())).toPromise();
        this.coaches[coachId] = coach;
      }
    }
  }

  addNote() {
    const dialogRef = this.dialog.open(CreateNoteDialogComponent, {
      data: {client: this.route.snapshot.params.client}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const note = res.note;
        note['jsdate'] = new Date(note.date);
        note['strDate'] = this.getDateString(note['jsdate']);
        this.notes.unshift(note);

        if (!this.coaches[res.coach.id]) {
          this.coaches[res.coach.id] = res.coach;
        }
      }
    });
  }

  getDateString(date: Date) {
    return date.getFullYear() + date.getMonth() + date.getDate();
  }
}
