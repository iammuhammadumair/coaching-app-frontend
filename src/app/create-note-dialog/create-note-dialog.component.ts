import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Note } from '../models/Note';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Coach } from '../models/Coach';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';
import { CoachFinderFirestoreService } from '../services/coach-finder-firestore.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-note-dialog',
  templateUrl: './create-note-dialog.component.html',
  styleUrls: ['./create-note-dialog.component.css']
})
export class CreateNoteDialogComponent implements OnInit, OnDestroy {

  notesCollectionRef: AngularFirestoreCollection<Note>;
  coach: Coach;
  form = this.fb.group({
    note: ['', Validators.required]
  });
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private coachFinderService: CoachFinderFirestoreService,
    private afDb: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<CreateNoteDialogComponent>
  ) { }

  ngOnInit() {
    const userRef = this.authenticationService.user;
    this.subscriptions.push(
      userRef.subscribe(user => {
        if (user) {
          this.subscriptions.push(
            this.coachFinderService.getCoachFromId(user.coach).subscribe(re => {
              this.coach = re;
            })
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  get note() {
    return this.form.get('note');
  }

  createNote() {
    if (!this.form.valid || !this.note.value) {
      return;
    }
    const notesCollectionRef = this.afDb.collection<Note>('notes');
    const note: Note = {
      date: new Date(),
      client: this.data.client,
      coach: this.coach.id,
      note: this.note.value
    };
    notesCollectionRef.add(note).then(res => {
      note.id = res.id;
      this.dialogRef.close({
        note: note,
        coach: this.coach
      });
    }).catch(e => {
      throw e;
    });
  }
}
