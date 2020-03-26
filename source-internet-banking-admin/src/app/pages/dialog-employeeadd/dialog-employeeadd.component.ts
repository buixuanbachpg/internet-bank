import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-employeeadd',
  templateUrl: './dialog-employeeadd.component.html',
  styleUrls: ['./dialog-employeeadd.component.scss']
})
export class DialogEmployeeaddComponent implements OnInit {
  insForm: FormGroup;
  constructor(
    private matDialogRef: MatDialogRef<DialogEmployeeaddComponent>
  ) { }

  ngOnInit() {
    this.insForm = new FormGroup({
      'name': new FormControl(''),
      'sex': new FormControl(''),
      'email': new FormControl(''),
      'phone': new FormControl(''),
      'address': new FormControl('')
    });
  }

  insertClick() { }

  closeClick() {
    this.matDialogRef.close();
  }

}
