import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { DatasharelocalService } from '../../data/datasharelocal.service';
import { EmployeeService } from 'src/app/api/employee.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material';
import { Msg } from 'src/app/variables/icommon';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  focus;
  listTitles: any[];
  location: Location;
  userId: string;
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private employeeService: EmployeeService,
    private ngxSpinnerService: NgxSpinnerService,
    private dialog: MatDialog
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.userId = localStorage.getItem('full_name');
    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }
  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  logout() {
    if (localStorage.getItem('email')) {
      this.ngxSpinnerService.show();
      this.employeeService.logout({ email: localStorage.getItem('email') }).subscribe(
        result => {
          this.ngxSpinnerService.hide();
          this.router.navigateByUrl('', { replaceUrl: true });
        },
        error => {
          this.ngxSpinnerService.hide();
          this.openDialog({ Text: 'Hệ thống bị lỗi!', Title: 0 });
        }
      );
    } else {
      this.router.navigateByUrl('', { replaceUrl: true });
    }
  }

  private openDialog(mess: Msg) {
    const dialogRef = this.dialog.open(DialogWarningComponent, {
      width: '350px',
      hasBackdrop: true,
      data: mess
    });
  }

}
