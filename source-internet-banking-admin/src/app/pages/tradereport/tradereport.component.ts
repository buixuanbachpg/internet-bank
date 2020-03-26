import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Report } from 'src/app/variables/icommon';

@Component({
  selector: 'app-tradereport',
  templateUrl: './tradereport.component.html',
  styleUrls: ['./tradereport.component.scss']
})
export class TradereportComponent implements OnInit {
  displayedColumns: string[] = ['position', 'time', 'source', 'destination', 'bank', 'money'];
  dataSource = new MatTableDataSource<Report>(ELEMENT_DATA);
  date: FormControl;
  fBanks: FormControl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.date = new FormControl(new Date());
    this.fBanks = new FormControl('', Validators.required);
  }

}

const ELEMENT_DATA: Report[] = [
  { position: 1, time: '2019-01-01', source: '00-00', destination: '11-11', bank: 'ABC', money: '111111' },
  { position: 2, time: '2019-01-01', source: '00-00', destination: '11-11', bank: 'ABC', money: '111111' },
  { position: 3, time: '2019-01-01', source: '00-00', destination: '11-11', bank: 'ABC', money: '111111' },
  { position: 4, time: '2019-01-01', source: '00-00', destination: '11-11', bank: 'ABC', money: '111111' },
  { position: 5, time: '2019-01-01', source: '00-00', destination: '11-11', bank: 'ABC', money: '111111' },
  { position: 6, time: '2019-01-01', source: '00-00', destination: '11-11', bank: 'ABC', money: '111111' },
  { position: 7, time: '2019-01-01', source: '00-00', destination: '11-11', bank: 'ABC', money: '111111' },
  { position: 8, time: '2019-01-01', source: '00-00', destination: '11-11', bank: 'ABC', money: '111111' },
  { position: 9, time: '2019-01-01', source: '00-00', destination: '11-11', bank: 'ABC', money: '111111' },
  { position: 10, time: '2019-01-01', source: '00-00', destination: '11-11', bank: 'ABC', money: '111111' },

];

