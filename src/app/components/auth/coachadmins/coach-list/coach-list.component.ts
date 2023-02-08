import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Coach } from 'src/app/models/Coach';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DeleteConfimrComponent } from '../../shared/delete-confimr/delete-confimr.component';
import { CoachFinderFirestoreService } from 'src/app/services/coach-finder-firestore.service';

@Component({
  selector: 'app-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css']
})
export class CoachListComponent implements OnInit {

  coachSelected: Coach;
  @Input() coaches: Coach[];
  @Output() coachEvent = new EventEmitter<Coach>();

  displayedColumns: string[] = ['title', 'address', 'price', ''];
  // dataSource = this.coaches;

  constructor(public deleteDialog: MatDialog,
    private reService: CoachFinderFirestoreService) { }

  ngOnInit() {
  }

  mouseEnter(coach: Coach) {

    this.coachEvent.emit(coach);
  }

  openDeleteDialog(refNumber: string, id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      'title': refNumber, 'id': id
    };
    const dialogRef = this.deleteDialog.open(DeleteConfimrComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const coach = this.coaches.filter(r => r.id === id)[0];
        coach.deleted = true;
        this.reService.updateCoach(coach);
      }
    });
  }
}
