import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatButton, MatDialog } from '@angular/material';
import { Person, Msg } from 'src/app/variables/icommon';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { UserService } from 'src/app/api/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Observer } from 'rxjs';
import { EmployeeService } from 'src/app/api/employee.service';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.scss']
})
export class DialogDetailComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('btnBack') private btnBack: MatButton;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['time', 'account', 'content', 'money'];
  radioOptions: string;
  constructor(
    private matDialogRef: MatDialogRef<DialogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Person,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit() {
    try {
      this.dataSource.paginator = this.paginator;
      this.radioOptions = '0';
      this.changeOptions();
    } catch (ex) {
      this.ngxSpinnerService.hide();
    }

  }

  ngAfterViewInit() {
    this.btnBack.focus();
  }
  closeClick() {
    this.matDialogRef.close(false);
  }

  changeOptions() {
    switch (this.radioOptions) {
      case '0':
        this.Get_Detail_Receive(this.data.account_number).subscribe(
          result => {
            this.dataSource.data = [];
            const array = [];
            result.local.forEach(data => {
              array.push({
                amount: `+${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                message: data.message,
                time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
              });
            });

            result.global.forEach(data => {
              array.push({
                amount: `+${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                message: data.message,
                time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
              });
            });
            this.dataSource.data = array.sort((a, b) => a.time > b.time ? 1 : -1);
            if (this.dataSource.data.length === 0) {
              this.openDialog({ Text: 'Không có dữ giao dịch liệu nhận tiền!', Title: 0 });
            }
          },
          error => {
            if (error.status === 401) {
              this.Renew_Token().subscribe(
                result => {
                  if (result) {
                    this.Get_Detail_Receive(this.data.account_number).subscribe(
                      result2 => {
                        this.dataSource.data = [];
                        const array = [];
                        result2.local.forEach(data => {
                          array.push({
                            amount: `+${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                            from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                            message: data.message,
                            time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                          });
                        });

                        result2.global.forEach(data => {
                          array.push({
                            amount: `+${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                            from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                            message: data.message,
                            time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                          });
                        });
                        this.dataSource.data = array.sort((a, b) => a.time > b.time ? 1 : -1);
                        if (this.dataSource.data.length === 0) {

                          this.openDialog({ Text: 'Không có dữ liệu giao dịch nhận tiền!', Title: 0 });
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
        break;
      case '1':
        this.Get_Detail_Transfer(this.data.account_number).subscribe(
          result => {
            this.dataSource.data = [];
            const array = [];
            result.local.forEach(data => {
              array.push({
                amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                message: data.message,
                time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
              });
            });

            result.global.forEach(data => {
              array.push({
                amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                message: data.message,
                time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
              });
            });
            this.dataSource.data = array.sort((a, b) => a.time > b.time ? 1 : -1);
            if (this.dataSource.data.length === 0) {
              this.openDialog({ Text: 'Không có dữ liệu giao dịch chuyển khoản!', Title: 0 });
            }
          },
          error => {
            if (error.status === 401) {
              this.Renew_Token().subscribe(
                result => {
                  if (result) {
                    this.Get_Detail_Transfer(this.data.account_number).subscribe(
                      result2 => {
                        this.dataSource.data = [];
                        const array = [];
                        result2.local.forEach(data => {
                          array.push({
                            amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                            from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                            message: data.message,
                            time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                          });
                        });

                        result2.global.forEach(data => {
                          array.push({
                            amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                            from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                            message: data.message,
                            time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                          });
                        });
                        this.dataSource.data = array.sort((a, b) => a.time > b.time ? 1 : -1);
                        if (this.dataSource.data.length === 0) {
                          this.openDialog({ Text: 'Không có dữ liệu giao dịch chuyển khoản!', Title: 0 });
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
        break;
      case '2':
        this.Get_Detail_Debit(this.data.account_number).subscribe(
          result => {
            this.dataSource.data = [];
            const array = [];
            result.forEach(data => {
              array.push({
                amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                from_account_number: data.from_account_number === '0000' ? 'BBD Banking' : data.from_account_number,
                message: data.message,
                time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
              });
            });
            this.dataSource.data = array.sort((a, b) => a.time > b.time ? 1 : -1);
            if (this.dataSource.data.length === 0) {
              this.openDialog({ Text: 'Không có dữ liệu giao dịch thanh toán nhắc nợ!', Title: 0 });
            }
          },
          error => {
            if (error.status === 401) {
              this.Renew_Token().subscribe(
                result => {
                  if (result) {
                    this.Get_Detail_Debit(this.data.account_number).subscribe(
                      result2 => {
                        this.dataSource.data = [];
                        const array = [];
                        result2.forEach(data => {
                          array.push({
                            amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                            from_account_number: data.from_account_number === '0000' ? 'BBD Banking' : data.from_account_number,
                            message: data.message,
                            time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                          });
                        });
                        this.dataSource.data = array.sort((a, b) => a.time > b.time ? 1 : -1);
                        if (this.dataSource.data.length === 0) {
                          this.openDialog({ Text: 'Không có dữ liệu giao dịch thanh toán nhắc nợ!', Title: 0 });
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
        break;
      default:
        break;
    }
  }


  private Get_Detail_Receive(id): Observable<any> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<any>) => {
      this.userService.getHistoryReceive(id).subscribe(
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

  private Get_Detail_Transfer(id): Observable<any> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<any>) => {
      this.userService.getHistoryTransfer(id).subscribe(
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

  private Get_Detail_Debit(id): Observable<any> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<any>) => {
      this.userService.getHistoryDebit(id).subscribe(
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

  private openDialog(mess: Msg) {
    const dialogRef = this.dialog.open(DialogWarningComponent, {
      width: '400px',
      hasBackdrop: true,
      data: mess
    });

    return dialogRef;
  }
}
