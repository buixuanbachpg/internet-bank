import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { MatDialog, MatRadioGroup } from '@angular/material';
import { EmployeeService } from 'src/app/api/employee.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Msg } from 'src/app/variables/icommon';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {
  @ViewChild('name') private iName: ElementRef;
  @ViewChild('fullname') private iFullname: ElementRef;
  @ViewChild('sex') private iSex: MatRadioGroup;
  @ViewChild('email') private iEmail: ElementRef;
  @ViewChild('phone') private iPhone: ElementRef;
  @ViewChild('address') private iAddress: ElementRef;
  @ViewChild('cash') private iCash: ElementRef;
  @ViewChild('btnIns') private btnIns: ElementRef;
  tradeForm: FormGroup;
  fullname_detail: string;
  sex_detail: string;
  email_detail: string;
  phone_detail: string;
  address_detail: string;
  cash_detail: string;
  private user: any;
  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router,
  ) {
    this.tradeForm = new FormGroup({
      'name': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(45)
        ]),
    });
  }

  ngOnInit() {
    this.user = null;
    this.fullname_detail = '';
    this.sex_detail = 'Nam';
    this.email_detail = '';
    this.phone_detail = '';
    this.address_detail = '';
    this.cash_detail = '';
    this.iEmail.nativeElement.readOnly = true;
    this.iPhone.nativeElement.readOnly = true;
    this.iAddress.nativeElement.readOnly = true;
    this.iCash.nativeElement.readOnly = true;
    this.iFullname.nativeElement.readOnly = true;
    // this.iSex.disabled = true;
    this.btnIns.nativeElement.disabled = true;

  }

  onSubmit() {
    const name = this.tradeForm.get('name');
    if (name.errors) {
      const msg = name.errors.required
        ? 'Vui lòng không để Tên đăng nhập/STK trống!'
        : 'Số ký tự của Tên đăng nhập/STK không được vượt quá 45 ký tự!';
      this.openDialog({ Text: msg, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iName.nativeElement.focus();
          }
        );
      return;
    }
    this.Check_User_Exists(name.value);
  }

  onUpd() {
    if (Number(this.cash_detail) <= 10000) {
      this.openDialog({ Text: 'Số tiền vui lòng lớn hơn 10.000₫', Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iCash.nativeElement.focus();
          }
        );
      return;
    }

    this.openDialog({ Text: 'Bạn có muốn tiến hành nạp tiền?', Title: 3 }).afterClosed()
      .subscribe(
        updateConfirm => {
          if (updateConfirm) {
            this.Update_Balance(
              {
                to_account_number: this.user.account_number,
                amount: Number(this.cash_detail),
                message: 'Nạp tiền'
              }
            ).subscribe(
              result => {
                if (result) {
                  // this.Set_Detail();
                  this.cash_detail = '';
                  this.openDialog({ Text: 'Bạn đã tiến hành nạp tiền thành công!', Title: 1 });
                } else {
                  this.openDialog({ Text: 'Quá trình tiến hành nạp tiền thất bài!', Title: 0 });
                }
              },
              error => {
                if (error.status === 401) {
                  this.Renew_Token().subscribe(
                    result => {
                      if (result) {
                        this.Update_Balance(
                          {
                            to_account_number: this.user.account_number,
                            amount: Number(this.cash_detail),
                            message: 'nạp tiền'
                          }
                        ).subscribe(
                          result2 => {
                            if (result2) {
                              // this.Set_Detail();
                              this.cash_detail = '';
                              this.openDialog({ Text: 'Bạn đã tiến hành nạp tiền thành công!', Title: 1 });
                            } else {
                              this.openDialog({ Text: 'Quá trình tiến hành nạp tiền thất bài!', Title: 0 });
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
        }
      );
  }

  private Set_Detail(value = { full_name: '', sex: 'Nam', email: '', address: '', phone: '' }, flg = false) {
    this.fullname_detail = value.full_name;
    this.sex_detail = value.sex;
    this.email_detail = value.email;
    this.address_detail = value.address;
    this.phone_detail = value.phone;
    this.cash_detail = '';
    this.iCash.nativeElement.readOnly = flg;
    this.btnIns.nativeElement.disabled = flg;
  }

  private Check_User_Exists(value) {
    this.Get_User_Id(value).subscribe(
      checkUser => {
        if (checkUser) {
          this.user = checkUser;
          this.Set_Detail(checkUser);
        } else {
          this.user = null;
          this.Set_Detail();
          this.openDialog({ Text: 'Tên đăng nhập/STK không tồn tại!', Title: 0 });
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Get_User_Id(value).subscribe(
                  checkUser2 => {
                    if (checkUser2) {
                      this.user = checkUser2;
                      this.Set_Detail(checkUser2);
                    } else {
                      this.user = null;
                      this.Set_Detail();
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

  private Update_Balance(user): Observable<boolean> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<boolean>) => {
      this.employeeService.updateAccountBalance(user).subscribe(
        result => {
          this.ngxSpinnerService.hide();
          if (result) {
            observer.next(true);
            observer.complete();
          } else {
            observer.next(false);
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
