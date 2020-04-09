import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Msg } from 'src/app/variables/icommon';
import { MatDialog } from '@angular/material';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';
import { EmployeeService } from 'src/app/api/employee.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Observer } from 'rxjs';
import { UserService } from 'src/app/api/user.service';

@Component({
  selector: 'app-registercustomer',
  templateUrl: './registercustomer.component.html',
  styleUrls: ['./registercustomer.component.scss']
})
export class RegistercustomerComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService
  ) { }

  ngOnInit() {
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
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        ]
      ),
      'phone': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(15),
        ]
      )
    });
  }


  onSubmit() {
    this.ngxSpinnerService.show();
    const name = this.registerForm.get('name');
    const username = this.registerForm.get('username');
    const email = this.registerForm.get('email');
    const phone = this.registerForm.get('phone');
    if (!this.CheckInput(name, username, email, phone)) {
      this.ngxSpinnerService.hide();
      return;
    }

    this.Get_User_Id(username.value).subscribe(
      isUserId => {
        if (!isUserId) {
          this.Insert_Customer(name, username, email, phone).subscribe(
            isInsert => {
              if (isInsert) {
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

  private CheckInput(name, username, email, phone): boolean {
    let mess = '';
    if (name.errors) {
      mess = name.errors.required
        ? 'Vui lòng không để trống phần họ tên!'
        : 'Số ký tự không được vượt quá 200 ký tự!';
      this.openDialog({ Text: mess, Title: 0 });
      return false;
    }

    if (username.errors) {
      if (username.errors.minlength) {
        mess = 'Số ký tự không được dưới 6 ký tự!';
      } else if (username.errors.maxlength) {
        mess = 'Số ký tự không được vượt quá 30 ký tự!';
      } else if (username.errors.required) {
        mess = 'Vui lòng không để trống mật khẩu!';
      } else {
        mess = 'Tên tài khoản không chứa ký tự đặc biệt!';
      }
      this.openDialog({ Text: mess, Title: 0 });
      return false;
    }

    if (email.errors) {
      mess = email.errors.required
        ? 'Vui lòng không để trống email!'
        : 'Vui lòng nhập đúng kiểu email!';
      this.openDialog({ Text: mess, Title: 0 });
      return false;
    }

    if (phone.errors) {
      mess = phone.errors.required
        ? 'Vui lòng không để trống số điện thoại!'
        : 'Số ký tự không được vượt quá 15 ký tự!';
      this.openDialog({ Text: mess, Title: 0 });
      return false;
    }
    return true;
  }

  private Get_User_Id(id): Observable<boolean> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<boolean>) => {
      this.userService.getUser(id).subscribe(
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

  private Insert_Customer(name, username, email, phone) {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<boolean>) => {
      this.employeeService.insertCustomer(
        {
          username: username,
          account_balance: 100000,
          full_name: name,
          email: email,
          phone: phone
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
      width: '350px',
      hasBackdrop: true,
      data: mess
    });
  }

}
