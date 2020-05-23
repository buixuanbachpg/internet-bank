import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { RoutePath, RouteInfo, Msg } from './variables/icommon';
import { browser, Browser } from 'protractor';
import { Observable, Observer } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from './api/employee.service';
import { MatDialog } from '@angular/material';
import { DialogWarningComponent } from './dialog-warning/dialog-warning.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private path: RouteInfo[] = [];
  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private ngxSpinnerService: NgxSpinnerService,
    private dialog: MatDialog
  ) { }
  @HostListener('window:hashchange', ['$event'])

  ngOnInit() {
    this.path = RoutePath;
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (event.url === event.urlAfterRedirects) {
          if (!localStorage.getItem('permission')) {
            this.router.navigateByUrl('', { replaceUrl: true });
          } else {
            if (this.router.url === '/login') {
              this.router.navigateByUrl('', { replaceUrl: true });
            } else if (this.path.filter(
              x => x.permission === localStorage.getItem('permission') && x.path === this.router.url
            ).length === 0) {
              this.router.navigateByUrl('**', { replaceUrl: true });
            }
          }
        }
      });
  }
}
