import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatButton } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Msg, Employee } from 'src/app/variables/icommon';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';
import { Observable, Observer } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/api/admin.service';
import { EmployeeService } from 'src/app/api/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-employeeadd',
  templateUrl: './dialog-employeeadd.component.html',
  styleUrls: ['./dialog-employeeadd.component.scss']
})
export class DialogEmployeeaddComponent implements OnInit {
  @ViewChild('name') private iName: ElementRef;
  @ViewChild('email') private iEmail: ElementRef;
  @ViewChild('phone') private iPhone: ElementRef;
  @ViewChild('address') private iAddress: ElementRef;
  @ViewChild('btnBack') private iBack: MatButton;

  insForm: FormGroup;
  constructor(
    private matDialogRef: MatDialogRef<DialogEmployeeaddComponent>,
    @Inject(MAT_DIALOG_DATA) private data: string[],
    private dialog: MatDialog,
    private ngxSpinnerService: NgxSpinnerService,
    private adminService: AdminService,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.insForm = new FormGroup({
      'name': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(45)
        ]),
      'sex': new FormControl('Nam'),
      'permission': new FormControl('0'),
      'email': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(45),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        ]),
      'phone': new FormControl('',
        [
          Validators.maxLength(15),
          Validators.pattern('^[0-9]{1,}$'),
          Validators.required,

        ]),
      'address': new FormControl('',
        [
          Validators.maxLength(200),
          Validators.required
        ])
    });
  }

  ngOnInit() {
    this.iBack.focus();
  }

  insertClick() {
    if (!this.CheckInput()) {
      return;
    }

    this.Insert_Employee().subscribe(
      insComplete => {
        if (insComplete) {
          this.insForm.get('name').setValue('');
          this.insForm.get('email').setValue('');
          this.insForm.get('phone').setValue('');
          this.insForm.get('sex').setValue('Nam');
          this.insForm.get('permission').setValue('0');
          this.insForm.get('address').setValue('');
          this.openDialog({ Text: 'Thêm nhân viên thành công!', Title: 1 });
        } else {
          this.openDialog({ Text: 'Thêm nhân viên thất bại!', Title: 0 });
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Insert_Employee().subscribe(
                  insComplete2 => {
                    if (insComplete2) {
                      this.insForm.get('name').setValue('');
                      this.insForm.get('email').setValue('');
                      this.insForm.get('phone').setValue('');
                      this.insForm.get('sex').setValue('Nam');
                      this.insForm.get('permission').setValue('0');
                      this.insForm.get('address').setValue('');
                      this.openDialog({ Text: 'Thêm nhân viên thành công!', Title: 1 });
                    } else {
                      this.openDialog({ Text: 'Thêm nhân viên thất bại!', Title: 0 });
                    }
                  },
                  errors => {
                    this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
                  });
              } else {
                this.openDialog({ Text: 'Phiên làm việc đã kết thúc!', Title: 2 }).afterClosed()
                  .subscribe(
                    Prosc => {
                      this.matDialogRef.close(false);
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

  private openDialog(mess: Msg) {
    const dialogRef = this.dialog.open(DialogWarningComponent, {
      width: '400px',
      hasBackdrop: true,
      data: mess
    });

    return dialogRef;
  }

  private CheckInput(): boolean {
    const name = this.insForm.get('name');
    let msg = '';
    if (name.errors) {
      msg = name.errors.required ? 'Vui lòng không được phép bỏ trống họ tên!'
        : 'Số ký tự của họ tên không được vượt quá 45 ký tự!';
      this.openDialog({ Text: msg, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iName.nativeElement.focus();
          }
        );
      return false;
    }

    const email = this.insForm.get('email');
    if (email.errors) {
      if (email.errors.required) {
        msg = 'Vui lòng không được phép bỏ trống Email!';
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

    if (this.data.indexOf(email.value) !== -1) {
      msg = 'Email này đã được đăng ký';
      this.openDialog({ Text: msg, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iEmail.nativeElement.focus();
          }
        );
      return false;
    }

    const phone = this.insForm.get('phone');
    if (phone.errors) {
      if (phone.errors.required) {
        msg = 'Vui lòng không được phép bỏ trống số điện thoại!';
      } else if (phone.errors.maxlength) {
        msg = 'Số ký tự của số điện thoại không được vượt quá 15 ký tự';
      } else {
        msg = 'Số điện thoại phải là số!';
      }

      this.openDialog({ Text: msg, Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iPhone.nativeElement.focus();
          }
        );
      return false;
    }

    const address = this.insForm.get('address');
    if (address.errors) {
      msg = address.errors.required
        ? 'Vui lòng không để trống địa chỉ!'
        : 'Số ký tự của địa chỉ không được vượt quá 200 ký tự!';
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

  private Insert_Employee(): Observable<boolean> {
    this.ngxSpinnerService.show();
    const employee = {
      address: this.insForm.get('address').value,
      email: this.insForm.get('email').value,
      full_name: this.insForm.get('name').value,
      permission: this.insForm.get('permission').value,
      phone: this.insForm.get('phone').value,
      sex: this.insForm.get('sex').value,
      password: `${this.insForm.get('email').value.split('@')[0]}12345`
    };
    return Observable.create((observer: Observer<boolean>) => {
      this.adminService.insert(employee).subscribe(
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
