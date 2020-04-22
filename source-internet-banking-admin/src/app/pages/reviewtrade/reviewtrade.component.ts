import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Person, Msg } from 'src/app/variables/icommon';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';
import { EmployeeService } from 'src/app/api/employee.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';
import { Observer, Observable } from 'rxjs';

@Component({
  selector: 'app-reviewtrade',
  templateUrl: './reviewtrade.component.html',
  styleUrls: ['./reviewtrade.component.scss']
})
export class ReviewtradeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'sex', 'username', 'email', 'phone', 'address', 'detail'];
  dataSource = new MatTableDataSource<Person>([]);
  formSearch: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router,
  ) {
    this.formSearch = new FormGroup({
      'name': new FormControl('')
    });
  }

  ngOnInit() {
    try {
      this.dataSource.paginator = this.paginator;
      this.Check_User_Exists('');
    } catch (ex) {
      this.ngxSpinnerService.hide();
    }
  }

  openDialogDetail(Obj: Person) {
    const dialogs = this.dialog.open(DialogDetailComponent, {
      width: '1010px',
      height: '520px',
      hasBackdrop: true,
      disableClose: true,
      data: Obj
    });

    return dialogs;
  }

  onSubmit() {
    this.Check_User_Exists(this.formSearch.get('name').value);
  }

  private Check_User_Exists(value) {
    this.Get_User_Id(value).subscribe(
      checkUser => {
        const array = [];
        if (checkUser instanceof Array) {
          this.dataSource.data = [];
          checkUser.forEach(data => {
            array.push({
              username: data.username,
              account_number: data.account_number,
              address: data.address,
              email: data.email,
              full_name: data.full_name,
              phone: data.phone,
              sex: data.sex
            });
          });
          this.dataSource.data = array.sort((a, b) => a.full_name > b.full_name ? 1 : -1);
        } else if (checkUser instanceof Object) {
          this.dataSource.data = [];
          array.push({
            username: checkUser.username,
            account_number: checkUser.account_number,
            address: checkUser.address,
            email: checkUser.email,
            full_name: checkUser.full_name,
            phone: checkUser.phone,
            sex: checkUser.sex
          });
          this.dataSource.data = array.sort((a, b) => a.full_name > b.full_name ? 1 : -1);
        } else {
          this.openDialog({ Text: 'Tên đăng nhập/STK không tồn tại!', Title: 0 });
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Get_User_Id(value).subscribe(
                  checkUser => {
                    const array = [];
                    if (checkUser instanceof Array) {
                      this.dataSource.data = [];
                      checkUser.forEach(data => {
                        array.push({
                          username: data.username,
                          account_number: data.account_number,
                          address: data.address,
                          email: data.email,
                          full_name: data.full_name,
                          phone: data.phone,
                          sex: data.sex
                        });
                      });
                      this.dataSource.data = array.sort((a, b) => a.full_name > b.full_name ? 1 : -1);
                    } else if (checkUser instanceof Object) {
                      this.dataSource.data = [];
                      array.push({
                        username: checkUser.username,
                        account_number: checkUser.account_number,
                        address: checkUser.address,
                        email: checkUser.email,
                        full_name: checkUser.full_name,
                        phone: checkUser.phone,
                        sex: checkUser.sex
                      });
                      this.dataSource.data = array.sort((a, b) => a.full_name > b.full_name ? 1 : -1);
                    } else {
                      this.openDialog({ Text: 'Tên đăng nhập/STK không tồn tại!', Title: 0 });
                    }
                  },
                  errors => {
                    this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
                  });
              } else {
                this.openDialog({ Text: 'Phiên làm việc đã kết thúc!', Title: 2 }).afterClosed()
                  .subscribe(
                    Prosc => {
                      this.router.navigateByUrl('', { replaceUrl: true });
                    }
                  );
              }
            }
          );
        } else {
          this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
        }
      }
    );
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

  private Get_User_Id(id): Observable<any> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<any>) => {
      this.employeeService.getUser(id).subscribe(
        result => {
          this.ngxSpinnerService.hide();
          if (result) {
            observer.next(result);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        },
        error => {
          this.ngxSpinnerService.hide();
          observer.error(error);
          observer.complete();
        }
      );
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

}
