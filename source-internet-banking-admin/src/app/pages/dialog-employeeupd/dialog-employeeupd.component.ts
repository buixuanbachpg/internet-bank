import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Employee } from 'src/app/variables/icommon';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dialog-employeeupd',
  templateUrl: './dialog-employeeupd.component.html',
  styleUrls: ['./dialog-employeeupd.component.scss']
})
export class DialogEmployeeupdComponent implements OnInit {
  updForm: FormGroup;
  constructor(
    private matDialogRef: MatDialogRef<DialogEmployeeupdComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Employee
  ) { }

  ngOnInit() {
    this.updForm = new FormGroup({
      'name': new FormControl(this.data.name),
      'sex': new FormControl(this.data.sex === 'Nam' ? 'male' : 'female'),
      'email': new FormControl(this.data.email),
      'phone': new FormControl(this.data.phone),
      'address': new FormControl(this.data.address)
    });

    this.updForm.controls['name'].disable();
    this.updForm.controls['email'].disable();
  }

  updateClick() { }

  closeClick() {
    this.matDialogRef.close();
  }
}
