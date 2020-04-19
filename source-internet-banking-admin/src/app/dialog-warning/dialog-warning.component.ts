import { Component, OnInit, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Msg } from '../variables/icommon';

@Component({
  selector: 'app-dialog-warning',
  templateUrl: './dialog-warning.component.html',
  styleUrls: ['./dialog-warning.component.scss']
})
export class DialogWarningComponent implements OnInit, AfterViewInit {
  pageTitle: string;
  confH: boolean;
  constructor(
    private dialogRef: MatDialogRef<DialogWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Msg,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.confH = false;
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
      case 3:
        this.pageTitle = 'Xác nhận lại';
        this.confH = true;
        break;
      default:
        break;
    }
  }

  ngAfterViewInit() {
    if (this.confH) {
      this.elementRef.nativeElement.querySelector('#btnBack').focus();
    }
  }

  onNoClick(bool): void {
    this.dialogRef.close(bool);
  }

}


