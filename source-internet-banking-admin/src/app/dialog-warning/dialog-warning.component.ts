import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Msg } from '../variables/icommon';

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
      default:
        break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


