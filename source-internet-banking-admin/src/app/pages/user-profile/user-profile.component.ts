import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/api/employee.service';
import { Router } from '@angular/router';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';
import { Msg } from 'src/app/variables/icommon';
import { Observable, Observer } from 'rxjs';
import { AdminService } from 'src/app/api/admin.service';
import { DialogChangepassComponent } from '../dialog-changepass/dialog-changepass.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('name') private iName: ElementRef;
  @ViewChild('email') private iEmail: ElementRef;
  @ViewChild('phone') private iPhone: ElementRef;
  @ViewChild('address') private iAddress: ElementRef;
  formUser: FormGroup;
  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private ngxSpinnerService: NgxSpinnerService,
    private adminService: AdminService,
    private router: Router
  ) {
    this.formUser = new FormGroup({
      'fullname': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(200)
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
          Validators.maxLength(15),
        ]),
      'sex': new FormControl('Nam')
    });

  }

  ngOnInit() {
    try {
      this.formUser.controls['email'].disable();
      this.Get_User_Id(localStorage.getItem('email'))
        .subscribe(
          user => {
            if (user) {
              this.formUser.get('email').setValue(user.email);
              this.formUser.get('fullname').setValue(user.full_name);
              this.formUser.get('phone').setValue(user.address);
              this.formUser.get('address').setValue(user.phone);
              this.formUser.get('sex').setValue(user.sex);
            }
          },
          error => {
            if (error.status === 401) {
              this.Renew_Token().subscribe(
                result => {
                  if (result) {
                    this.Get_User_Id(localStorage.getItem('email'))
                      .subscribe(
                        user2 => {
                          if (user2) {
                            this.formUser.get('email').setValue(user2.email);
                            this.formUser.get('fullname').setValue(user2.full_name);
                            this.formUser.get('phone').setValue(user2.address);
                            this.formUser.get('address').setValue(user2.phone);
                            this.formUser.get('sex').setValue(user2.sex);
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

    } catch (ex) {
      this.ngxSpinnerService.hide();
    }

  }

  openDialogChangePass() {
    const dialogRef = this.dialog.open(DialogChangepassComponent, {
      width: '400px',
      height: '350px',
      hasBackdrop: true,
      disableClose: true,
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

  private Get_User_Id(id): Observable<any> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<any>) => {
      this.adminService.getone(id).subscribe(
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

}
