import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/api/employee.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material';
import { Msg } from 'src/app/variables/icommon';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export let ROUTES: RouteInfo[] = [];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private ngxSpinnerService: NgxSpinnerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    ROUTES = localStorage.getItem('permission') === '1' ? [
      // { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
      // { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '' },
      // { path: '/maps', title: 'Maps', icon: 'ni-pin-3 text-orange', class: '' },
      // { path: '/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '' },
      // { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '' },
      // { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '' },
      // { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '' },
      { path: '/manager', title: 'Employee Manager', icon: 'ni-badge text-primary', class: '' },
      { path: '/report', title: 'Trade Report', icon: 'ni-single-copy-04 text-primary', class: '' },
    ] : [
        { path: '/customer', title: 'Register Customer', icon: 'ni-single-02 text-primary', class: '' },
        { path: '/trade', title: 'Trade', icon: 'ni-credit-card text-primary', class: '' },
        { path: '/reviewtrade', title: 'Trade Review', icon: 'ni-money-coins text-primary', class: '' },
      ];
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  logout() {
    this.ngxSpinnerService.show();
    this.employeeService.logout({ email: localStorage.getItem('email') }).subscribe(
      result => {
        this.ngxSpinnerService.hide();
        this.router.navigate(['']);
      },
      error => {
        this.ngxSpinnerService.hide();
        this.openDialog({ Text: 'Hệ thống bị lỗi!', Title: 0 });
      }
    );
  }

  private openDialog(mess: Msg) {
    const dialogRef = this.dialog.open(DialogWarningComponent, {
      width: '350px',
      hasBackdrop: true,
      data: mess
    });
  }

}
