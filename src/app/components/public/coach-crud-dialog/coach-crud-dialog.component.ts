import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coach } from 'src/app/models/Coach';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-coach-crud-dialog',
  templateUrl: './coach-crud-dialog.component.html',
  styleUrls: ['./coach-crud-dialog.component.css']
})
export class CoachCrudDialogComponent implements OnInit {

  form: FormGroup;
  coach: Coach;
  title: string;

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private formbui: FormBuilder, private dialogRef: MatDialogRef<CoachCrudDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Coach) {

      this.coach = data;
     }

  ngOnInit() {

    this.title = this.coach ? 'Update existing Real Estate' : 'Insert new Real Estate';
    this.form = this.formbui.group(
      {
        address:            this.coach ? this.coach.address : '',
        city:               this.coach ? this.coach.city : '',
        zipCode:            this.coach ? this.coach.zipCode : '',
        country:            this.coach ? this.coach.country : '',
        latitude:            '',
        longitude:          '',
        price:              this.coach ? this.coach.price : '',
        currency:           this.coach ? this.coach.currency : '',
        reReferenceNumber:  this.coach ? this.coach.reReferenceNumber : '',
        reAgentWebSiteUrl:  '',
        agentRegisterFormUrl:  '',
        emailAddress:          ''
      }
    );

  }

  save() {
    this.dialogRef.close(this.form.value);
}
  close() {
    this.dialogRef.close();
  }

  getErrorMessage() {
    return this.email.hasError('emailAddress') ? 'Not a valid email' : '';
  }

}
