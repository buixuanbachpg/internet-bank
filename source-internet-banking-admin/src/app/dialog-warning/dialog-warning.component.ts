import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Msg } from '../variables/icommon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-warning',
  templateUrl: './dialog-warning.component.html',
  styleUrls: ['./dialog-warning.component.scss']
})
export class DialogWarningComponent implements OnInit {
  pageTitle: string;
  constructor(
    private dialogRef: MatDialogRef<DialogWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Msg
  ) { }

  ngOnInit() {
    switch (this.data.Title) {
      case 0:
        this.pageTitle = 'Cảnh báo';
        break;
      case 1:
        this.pageTitle = 'Xác nhận';
        break;
      case 2:
        this.pageTitle = 'Thông báo';
        break;
      default:
        break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}


