import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Employee } from 'src/app/variables/icommon';
import { DialogEmployeeupdComponent } from '../dialog-employeeupd/dialog-employeeupd.component';
import { DialogEmployeeaddComponent } from '../dialog-employeeadd/dialog-employeeadd.component';

@Component({
  selector: 'app-employeemanager',
  templateUrl: './employeemanager.component.html',
  styleUrls: ['./employeemanager.component.scss']
})
export class EmployeemanagerComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'sex', 'email', 'phone', 'address', 'update', 'delete'];
  dataSource = new MatTableDataSource<Employee>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialogUpdate(obj: Employee) {
    const dialogUpd = this.dialog.open(DialogEmployeeupdComponent, {
      width: '400px',
      height: '450px',
      data: obj,
      hasBackdrop: true,
    });
  }

  openDialogInsert() {
    const dialogIns = this.dialog.open(DialogEmployeeaddComponent, {
      width: '400px',
      height: '450px',
      hasBackdrop: true,
    });
  }

}



const ELEMENT_DATA: Employee[] = [
  { position: 1, name: 'Hydrogen', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '121231231231231231233' },
  { position: 2, name: 'Helium', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 3, name: 'Beryllium', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 4, name: 'Boron', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 5, name: 'Carbon', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 6, name: 'Nitrogen', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 7, name: 'Oxygen', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 8, name: 'Fluorine', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 9, name: 'Neon', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 10, name: 'Sodium', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 11, name: 'Magnesium', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 12, name: 'Aluminum', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 13, name: 'Silicon', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 14, name: 'Phosphorus', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 15, name: 'Sulfur', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 16, name: 'Hydrogen', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 17, name: 'Chlorine', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 18, name: 'Argon', sex: 'Nữ', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 19, name: 'Potassium', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
  { position: 20, name: 'Calcium', sex: 'Nam', email: 'a@a.com', phone: '11-11', address: '123' },
];
