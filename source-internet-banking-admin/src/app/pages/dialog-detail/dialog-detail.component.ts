import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DetailPerson } from 'src/app/variables/icommon';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.scss']
})
export class DialogDetailComponent implements OnInit {

  constructor(
    private matDialogRef: MatDialogRef<DialogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: DetailPerson
  ) { }

  ngOnInit() {
  }
  closeClick() {
    this.matDialogRef.close();
  }
}
