import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Msg } from 'src/app/variables/icommon';
import { MatDialog } from '@angular/material';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';
import { EmployeeService } from 'src/app/api/employee.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registercustomer',
  templateUrl: './registercustomer.component.html',
  styleUrls: ['./registercustomer.component.scss']
})
export class RegistercustomerComponent implements OnInit {
  @ViewChild('name') private iName: ElementRef;
  @ViewChild('username') private iUserName: ElementRef;
  @ViewChild('email') private iEmail: ElementRef;
  @ViewChild('phone') private iPhone: ElementRef;
  @ViewChild('address') private iAddress: ElementRef;

  registerForm: FormGroup;
  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      'name': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ),
      'username': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(6),
          Validators.pattern('^[a-z0-9]*$')
        ]
      ),
      'email': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(45),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        ]
      ),
      'phone': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^[0-9]{1,}$'),
        ]
      ),
      'address': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(200),
        ]),
      'sex': new FormControl('Nam')
    });
  }

  ngOnInit() {
  }


  onSubmit() {
    const name = this.registerForm.get('name');
    const username = this.registerForm.get('username');
    const email = this.registerForm.get('email');
    const phone = this.registerForm.get('phone');
    const adress = this.registerForm.get('address');
    if (!this.CheckInput(name, username, email, phone, adress)) {
      return;
    }

    this.openDialog({ Text: 'Bạn có muốn đăng ký với thông tin này không?', Title: 3 }).afterClosed()
      .subscribe(
        insConfirm => {
          if (insConfirm) {
            this.Check_User_Exists(username.value).subscribe(
              usernameCheck => {
                if (!usernameCheck) {
                  this.Check_User_Exists(email.value).subscribe(
                    emailCheck => {
                      if (!emailCheck) {
                        this.Insert_Customer().subscribe(
                          isInsert => {
                            if (isInsert) {
                              this.registerForm.get('name').setValue('');
                              this.registerForm.get('username').setValue('');
                              this.registerForm.get('email').setValue('');
                              this.registerForm.get('phone').setValue('');
                              this.registerForm.get('address').setValue('');
                              this.openDialog({
                                Text: 'Thêm dữ liệu khách hàng thành công!',
                                Title: 1
                              });
                            } else {
                              this.openDialog({
                                Text: 'Thêm dữ liệu khách hàng thất bại!',
                                Title: 0
                              });
                            }
                          },
                          error => {
                            if (error.status === 401) {
                              this.Renew_Token().subscribe(
                                result => {
                                  if (result) {
                                    this.Insert_Customer().subscribe(
                                      isInsert => {
                                        if (isInsert) {
                                          this.registerForm.get('name').setValue('');
                                          this.registerForm.get('username').setValue('');
                                          this.registerForm.get('email').setValue('');
                                          this.registerForm.get('phone').setValue('');
                                          this.registerForm.get('address').setValue('');
                                          this.openDialog({
                                            Text: 'Thêm dữ liệu khách hàng thành công!',
                                            Title: 1
                                          });
                                        } else {
                                          this.openDialog({
                                            Text: 'Thêm dữ liệu khách hàng thất bại!',
                                            Title: 0
                                          });
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
                      } else {
                        this.openDialog({
                          Text: 'Email đã tồn tại xin hãy nhập email khác!',
                          Title: 0
                        });
                      }
                    }
                  );
                } else {
                  this.openDialog({
                    Text: 'Tên đăng nhập đã tồn tại xin hãy nhập tên đăng nhập khác!',
                    Title: 0
                  });
                }
              }
            );
          }
        }
      );
  }

  private Check_User_Exists(value): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.Get_User_Id(value).subscribe(
        checkUser => {
          if (checkUser) {
            observer.next(true);
          } else {
            observer.next(false);
          }
          observer.complete();
        },
        error => {
          if (error.status === 401) {
            this.Renew_Token().subscribe(
              result => {
                if (result) {
                  this.Get_User_Id(value).subscribe(
                    checkUser => {
                      if (checkUser) {
                        observer.next(true);
                      } else {
                        observer.next(false);
                      }
                      observer.complete();
                    },
                    errors => {
                      this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
                      observer.complete();
                    });
                } else {
                  this.openDialog({ Text: 'Phiên làm việc đã kết thúc!', Title: 2 }).afterClosed()
                    .subscribe(
                      Prosc => {
                        this.router.navigateByUrl('', { replaceUrl: true });
                      }
                    );
                  observer.complete();
                }
              }
            );
          } else {
            this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
            observer.complete();
          }
        }
      );
    });
  }

  private CheckInput(name, username, email, phone, address): boolean {
    let mess = '';
    if (name.errors) {
      mess = name.errors.required
        ? 'Vui lòng không để trống phần họ tên!'
        : 'Số ký tự của họ tên không được vượt quá 200 ký tự!';
      this.openDialog({ Text: mess, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iName.nativeElement.focus();
          }
        );
      return false;
    }

    if (username.errors) {
      if (username.errors.minlength) {
        mess = 'Số ký tự của tên đăng nhập không được dưới 6 ký tự!';
      } else if (username.errors.maxlength) {
        mess = 'Số ký tự của tên đăng nhập không được vượt quá 45 ký tự!';
      } else if (username.errors.required) {
        mess = 'Vui lòng không để trống tên đăng nhập!';
      } else {
        mess = 'Tên đăng nhập không chứa ký tự đặc biệt!';
      }
      this.openDialog({ Text: mess, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iUserName.nativeElement.focus();
          }
        );
      return false;
    }

    if (email.errors) {
      if (email.errors.required) {
        mess = 'Vui lòng không để trống email!!';
      } else if (email.errors.maxlength) {
        mess = 'Số ký tự của email không được vượt quá 45 ký tự';
      } else {
        mess = 'Vui lòng nhập đúng định dạng email!';
      }
      this.openDialog({ Text: mess, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iEmail.nativeElement.focus();
          }
        );
      return false;
    }

    if (phone.errors) {
      if (phone.errors.required) {
        mess = 'Vui lòng không để trống số điện thoại!!';
      } else if (phone.errors.maxlength) {
        mess = 'Số ký tự của số điện thoại không được vượt quá 15 ký tự';
      } else {
        mess = 'Số điện thoại phải là số!';
      }
      this.openDialog({ Text: mess, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iPhone.nativeElement.focus();
          }
        );
      return false;
    }

    if (address.errors) {
      mess = address.errors.required
        ? 'Vui lòng không để trống số địa chỉ!'
        : 'Số ký tự của địa chỉ không được vượt quá 200 ký tự!';
      this.openDialog({ Text: mess, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iAddress.nativeElement.focus();
          }
        );
      return false;
    }
    return true;
  }

  private Get_User_Id(id): Observable<boolean> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<boolean>) => {
      this.employeeService.getUser(id).subscribe(
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

  private Insert_Customer() {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<boolean>) => {
      this.employeeService.insertCustomer(
        {
          username: this.registerForm.get('username').value,
          account_balance: 100000,
          full_name: this.registerForm.get('name').value,
          email: this.registerForm.get('email').value,
          phone: this.registerForm.get('phone').value,
          address: this.registerForm.get('address').value,
          sex: this.registerForm.get('sex').value,
          password: `${this.registerForm.get('email').value.split('@')[0]}12345`
        }
      ).subscribe(
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
