import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-changepass',
  templateUrl: './dialog-changepass.component.html',
  styleUrls: ['./dialog-changepass.component.scss']
})
export class DialogChangepassComponent implements OnInit {
  changeForm: FormGroup;
  constructor(
    private matDialogRef: MatDialogRef<DialogChangepassComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.changeForm = new FormGroup({
      'oldpass': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(22),
          Validators.minLength(6)
        ]),
      'newpass': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(22),
          Validators.minLength(6)
        ]),
      'confirmpass': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(22),
          Validators.minLength(6)
        ]),
    });
  }

  ngOnInit() {
  }

  closeClick() {
    this.matDialogRef.close(false);
  }

  updateClick() {
    this.matDialogRef.close(true);
  }

}
