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
        if (event.id === 1
          && event.url === event.urlAfterRedirects
          && event.url !== '/login') {
          // this.Renew_Token().subscribe(
          //   result => {
          //     if (!result) {
          //       this.openDialog({ Text: 'Phiên làm việc đã kết thúc!', Title: 2 }).afterClosed()
          //         .subscribe(
          //           Prosc => {
          //             this.router.navigateByUrl('', { replaceUrl: true });
          //           }
          //         );
          //     }
          //   }
          // );
        } else if (event.url === event.urlAfterRedirects) {
          if (!localStorage.getItem('permission')) {
            this.router.navigateByUrl('', { replaceUrl: true });
          } else {
            if (this.path.filter(
              x => x.permission === localStorage.getItem('permission') && x.path === this.router.url
            ).length === 0) {
              this.router.navigateByUrl('**', { replaceUrl: true });

            }
          }
        }
      });
  }

  private openDialog(mess: Msg) {
    const dialogRef = this.dialog.open(DialogWarningComponent, {
      width: '400px',
      hasBackdrop: true,
      data: mess
    });

    return dialogRef;
  }

  private Renew_Token(): Observable<boolean> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<boolean>) => {
      this.employeeService.renew<any>().subscribe(
        result => {
          localStorage.setItem('access-token', result.access_token);
          this.ngxSpinnerService.hide();
          observer.next(true);
          observer.complete();
        },
        error => {
          this.ngxSpinnerService.hide();
          observer.next(false);
          observer.complete();
        }
      );
    });
  }

}
