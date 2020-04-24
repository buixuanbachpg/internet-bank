import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Report, Msg } from 'src/app/variables/icommon';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { UserService } from 'src/app/api/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/api/employee.service';
import { Router } from '@angular/router';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';
import { Observer, Observable } from 'rxjs';
import { AdminService } from 'src/app/api/admin.service';
import { AppDateAdapter, APP_DATE_FORMATS } from './date.adapter';

@Component({
  selector: 'app-tradereport',
  templateUrl: './tradereport.component.html',
  styleUrls: ['./tradereport.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class TradereportComponent implements OnInit {
  displayedColumns = ['time', 'bank', 'account_from', 'account_to', 'content', 'money'];
  dataSource = new MatTableDataSource<any>([]);
  allBank: any[];
  formSearch: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private adminService: AdminService,
    private router: Router
  ) {
    this.allBank = [
      { bankCd: '', bankNm: 'Tất cả ngân hàng' },
      { bankCd: 'bkt.partner', bankNm: 'BKT Bank' },
      { bankCd: 'tuananh', bankNm: 'TA Bank' },
    ];

    this.formSearch = new FormGroup({
      dateFrom: new FormControl(new Date()),
      dateTo: new FormControl(new Date()),
      fBanks: new FormControl('')
    });
  }

  ngOnInit() {
    try {
      this.dataSource.paginator = this.paginator;
    } catch (ex) {
      this.ngxSpinnerService.hide();
    }

  }

  onSearch() {

    this.GetHistory(
      {
        fromDate: + new Date(this.formSearch.get('dateFrom').value),
        toDate: + new Date(this.formSearch.get('dateTo').value),
        bank: this.formSearch.get('fBanks').value,
      }
    ).subscribe(
      result => {
        this.dataSource.data = [];
        const array = [];
        if (result) {
          result.forEach(data => {
            array.push({
              amount: `${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
              from_account_number: data.from_account_number,
              to_account_number: data.to_account_number,
              message: data.message,
              bank: this.allBank.filter(x => x.bankCd === data.partner_code).length > 0
                ? this.allBank.filter(x => x.bankCd === data.partner_code)[0].bankNm
                : 'Không rõ',
              time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
            });
            this.dataSource.data = array.sort((a, b) => a.time > b.time ? 1 : -1);
          });
        } else {
          this.openDialog({ Text: 'Không có dữ giao dịch!', Title: 0 });
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.GetHistory(
                  {
                    fromDate: + new Date(this.formSearch.get('dateFrom').value),
                    toDate: + new Date(this.formSearch.get('dateTo').value),
                    bank: this.formSearch.get('fBanks').value,
                  }
                ).subscribe(
                  result2 => {
                    this.dataSource.data = [];
                    const array = [];
                    if (result2) {
                      result2.forEach(data => {
                        array.push({
                          amount: `${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                          from_account_number: data.from_account_number,
                          to_account_number: data.to_account_number,
                          message: data.message,
                          bank: this.allBank.filter(x => x.bankCd === data.partner_code).length > 0
                            ? this.allBank.filter(x => x.bankCd === data.partner_code)[0].bankNm
                            : 'Không rõ',
                          time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                        });
                      });
                      this.dataSource.data = array.sort((a, b) => a.time > b.time ? 1 : -1);

                    } else {
                      this.openDialog({ Text: 'Không có dữ giao dịch!', Title: 0 });
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

  private GetHistory(data): Observable<any> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<any>) => {
      this.adminService.gethistory(data).subscribe(
        result => {
          this.ngxSpinnerService.hide();
          if (result instanceof Array && result.length > 0) {
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
