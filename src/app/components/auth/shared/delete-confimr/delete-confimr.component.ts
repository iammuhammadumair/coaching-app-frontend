import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confimr',
  templateUrl: './delete-confimr.component.html',
  styleUrls: ['./delete-confimr.component.css']
})
export class DeleteConfimrComponent implements OnInit {

  title: string;

  constructor(
    private dialogRef: MatDialogRef<DeleteConfimrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;

  }

  ngOnInit() {
  }

  close(data) {
    this.dialogRef.close(data);
  }

}
