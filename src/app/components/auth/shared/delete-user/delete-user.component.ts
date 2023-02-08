import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  firstname: string;
  lastname: string;

  constructor(
    private dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.firstname = data.user.firstname;
    this.lastname = data.user.lastname;
  }

  ngOnInit() {
  }

  close(data) {
    this.dialogRef.close(data);
  }

}
