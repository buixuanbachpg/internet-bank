import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/api/employee.service';
import { Router } from '@angular/router';
import { Msg } from 'src/app/variables/icommon';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';

@Component({
  selector: 'app-dialog-changepass',
  templateUrl: './dialog-changepass.component.html',
  styleUrls: ['./dialog-changepass.component.scss']
})
export class DialogChangepassComponent implements OnInit {
  @ViewChild('oldpass') private iOldPass: ElementRef;
  @ViewChild('newpass') private iNewPass: ElementRef;
  @ViewChild('confirmpass') private iConfirmPass: ElementRef;
  changeForm: FormGroup;
  constructor(
    private matDialogRef: MatDialogRef<DialogChangepassComponent>,
    private ngxSpinnerService: NgxSpinnerService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.changeForm = new FormGroup({
      'oldpass': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(22),
          Validators.minLength(6)
        ]),
      'newpass': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(22),
          Validators.minLength(6)
        ]),
      'confirmpass': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(22),
          Validators.minLength(6)
        ]),
    }, {
      validators: this.MustMatch
    });
  }

  ngOnInit() {
  }

  closeClick() {
    this.matDialogRef.close(false);
  }

  updateClick() {
    if (!this.CheckInput()) {
      return;
    }

    this.openDialog({ Text: 'Bạn có muốn đổi mật khẩu không?', Title: 3 }).afterClosed()
      .subscribe(
        updateConfirm => {
          if (updateConfirm) {
            this.Update_Password().subscribe(
              result => {
                if (result) {
                  this.changeForm.get('oldpass').setValue('');
                  this.changeForm.get('newpass').setValue('');
                  this.changeForm.get('confirmpass').setValue('');
                  this.openDialog({ Text: 'Bạn đã cập nhật mật khẩu thành công!', Title: 1 });
                } else {
                  this.openDialog({ Text: 'Bạn đã cập nhật mật khẩu thất bại!', Title: 0 });
                }
              },
              error => {
                if (error.status === 401) {
                  this.Renew_Token().subscribe(
                    result => {
                      if (result) {
                        this.Update_Password().subscribe(
                          result2 => {
                            if (result) {
                              this.changeForm.get('oldpass').setValue('');
                              this.changeForm.get('newpass').setValue('');
                              this.changeForm.get('confirmpass').setValue('');

                              this.openDialog({ Text: 'Bạn đã cập nhật mật khẩu thành công!', Title: 1 });
                            } else {
                              this.openDialog({ Text: 'Bạn đã cập nhật mật khẩu thất bại!', Title: 0 });
                            }
                          },
                          errors => {
                            if (error.status === 400) {
                              this.openDialog({ Text: 'Mật khẩu cũ không đúng!', Title: 0 }).afterClosed()
                                .subscribe(
                                  Prosc => {
                                    this.iOldPass.nativeElement.focus();
                                  }
                                );
                            } else {
                              this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
                            }
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
                } else if (error.status === 400) {
                  this.openDialog({ Text: 'Mật khẩu cũ không đúng!', Title: 0 }).afterClosed()
                    .subscribe(
                      Prosc => {
                        this.iOldPass.nativeElement.focus();
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

  private Update_Password(): Observable<boolean> {
    this.ngxSpinnerService.show();
    const data = {
      email: localStorage.getItem('email'),
      new_password: this.changeForm.get('newpass').value,
      old_password: this.changeForm.get('oldpass').value
    };
    return Observable.create((observer: Observer<boolean>) => {
      this.employeeService.changePass(data).subscribe(
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

  private CheckInput(): boolean {
    const oldPass = this.changeForm.get('oldpass');
    const newPass = this.changeForm.get('newpass');
    const confirmPass = this.changeForm.get('confirmpass');
    if (oldPass.errors) {
      this.iOldPass.nativeElement.focus();
      return false;
    }

    if (newPass.errors) {
      this.iNewPass.nativeElement.focus();
      return false;
    }

    if (confirmPass.errors) {
      this.iConfirmPass.nativeElement.focus();
      return false;
    }

    if (newPass.value !== confirmPass.value) {
      this.openDialog({ Text: 'Mật khẩu mới và mật khẩu nhập lại không khớp!', Title: 0 }).afterClosed()
        .subscribe(
          Prosc => {
            this.iConfirmPass.nativeElement.focus();

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

  MustMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    return control.get('newpass').value !== control.get('confirmpass').value
      ? { 'MustMatch': true } : null;
  }

}
