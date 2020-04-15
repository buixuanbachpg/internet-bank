import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Employee, Msg } from 'src/app/variables/icommon';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/api/admin.service';
import { EmployeeService } from 'src/app/api/employee.service';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-dialog-employeeupd',
  templateUrl: './dialog-employeeupd.component.html',
  styleUrls: ['./dialog-employeeupd.component.scss']
})
export class DialogEmployeeupdComponent implements OnInit {
  @ViewChild('name') private iName: ElementRef;
  @ViewChild('email') private iEmail: ElementRef;
  @ViewChild('phone') private iPhone: ElementRef;
  @ViewChild('address') private iAddress: ElementRef;
  updForm: FormGroup;
  constructor(
    private matDialogRef: MatDialogRef<DialogEmployeeupdComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Employee,
    private dialog: MatDialog,
    private ngxSpinnerService: NgxSpinnerService,
    private adminService: AdminService,
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.updForm = new FormGroup({
      'name': new FormControl(this.data.full_name,
        [
          Validators.required,
          Validators.maxLength(45)
        ]),
      'sex': new FormControl(this.data.sex),
      'permission': new FormControl(this.data.permission),
      'email': new FormControl(this.data.email,
        [
          Validators.required,
          Validators.maxLength(45),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        ]),
      // 'password': new FormControl(this.data.password, [
      //   Validators.required,
      //   Validators.minLength(6),
      //   Validators.maxLength(45)
      // ]),
      'phone': new FormControl(this.data.phone, Validators.maxLength(15)),
      'address': new FormControl(this.data.address, Validators.maxLength(200))
    });
    // this.chkpass = false;
    this.updForm.controls['email'].disable();
    this.updForm.controls['password'].disable();
  }

  updateClick() {
    if (!this.CheckInput()) {
      return;
    }

    this.Update_Employee().subscribe(
      () => {

      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Update_Employee().subscribe(
                  () => { },
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

  closeClick() {
    this.matDialogRef.close();
  }

  // chkDis(e) {
  //   console.log(e);
  // }

  private openDialog(mess: Msg) {
    const dialogRef = this.dialog.open(DialogWarningComponent, {
      width: '400px',
      hasBackdrop: true,
      data: mess
    });

    return dialogRef;
  }

  private CheckInput(): boolean {
    const name = this.updForm.get('name');
    let msg = '';
    if (name.errors) {
      msg = name.errors.required ? 'Họ tên không được phép bỏ trống!'
        : 'Số ký tự của họ tên không được vượt quá 45 ký tự!';
      this.openDialog({ Text: msg, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iName.nativeElement.focus();
          }
        );
      return false;
    }

    const email = this.updForm.get('email');
    if (email.errors) {
      if (email.errors.required) {
        msg = 'Email không được phép bỏ trống!';
      } else if (email.errors.maxlength) {
        msg = 'Số ký tự của Email không được vượt quá 45 ký tự!';
      } else {
        msg = 'Vui lòng nhập đúng định dạng email!';
      }
      this.openDialog({ Text: msg, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iEmail.nativeElement.focus();
          }
        );
      return false;
    }

    const phone = this.updForm.get('phone');
    if (phone.errors) {
      msg = 'Số ký tự của số điện thoại không được vượt quá 15 ký tự!';
      this.openDialog({ Text: msg, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iPhone.nativeElement.focus();
          }
        );
      return false;
    }

    const address = this.updForm.get('address');
    if (address.errors) {
      msg = 'Số ký tự của địa chỉ không được vượt quá 200 ký tự!';
      this.openDialog({ Text: msg, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iAddress.nativeElement.focus();
          }
        );
      return false;
    }
    return true;
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

  private Update_Employee(): Observable<boolean> {
    this.ngxSpinnerService.show();
    const employee = {
      address: this.updForm.get('address').value,
      email: this.updForm.get('email').value,
      full_name: this.updForm.get('name').value,
      permission: this.updForm.get('permission').value,
      phone: this.updForm.get('phone').value,
      sex: this.updForm.get('sex').value,
      password: `${this.updForm.get('email').value.split('@')[0]}12345`
    };
    return Observable.create((observer: Observer<boolean>) => {
      this.adminService.update(employee).subscribe(
        result => {
          if (result) {
            observer.next(true);
          } else {
            observer.next(false);
          }
          this.ngxSpinnerService.hide();
          observer.complete();
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
