import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogWarningComponent } from '../../dialog-warning/dialog-warning.component';
import { MatDialog } from '@angular/material';
import { Msg } from 'src/app/variables/icommon';
import { EmployeeService } from 'src/app/api/employee.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('email') private iEmail: ElementRef;
  @ViewChild('password') private iPassword: ElementRef;
  formLogin: FormGroup;

  private resolvedRecaptcha: string;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private ngxSpinnerService: NgxSpinnerService
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(
        '',
        [
          Validators.required,
          Validators.maxLength(45),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        ]
      ),
      password: new FormControl(
        '',
        [
          Validators.required,
          Validators.maxLength(45)
        ]
      )
    });
  }
  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.which === 2) {
      event.preventDefault();
      alert('Hệ thống bị gián đoạn!');
    }
  }

  ngOnInit() {
    this.resolvedRecaptcha = '';
    localStorage.clear();
  }


  resolved(captchaResponse: string) {
    this.resolvedRecaptcha = captchaResponse;
  }

  onSubmit() {
    const Email = this.formLogin.get('email');
    let mess = '';
    if (Email.errors) {
      if (Email.errors.required) {
        mess = 'Vui lòng không để trống email!';
      } else if (Email.errors.maxlength) {
        mess = 'Số ký tự của email không được vượt quá 45 ký tự!';
      } else {
        mess = 'Vui lòng nhập đúng định dạng email!';
      }
      this.openDialog({ Text: mess, Title: 0 }).afterClosed().subscribe(
        Prosc => {
          this.iEmail.nativeElement.focus();
        }
      );
      return;
    }
    const Pass = this.formLogin.get('password');
    if (Pass.errors) {
      mess = Pass.errors.maxlength
        ? 'Số ký tự của mật khẩu không được vượt quá 45 ký tự!'
        : 'Vui lòng không để trống mật khẩu!';
      this.openDialog({ Text: mess, Title: 0 }).afterClosed().subscribe(
        Prosc => {
          this.iPassword.nativeElement.focus();
        }
      );
      return;

    }
    if (!this.resolvedRecaptcha) {
      mess = 'Hãy xác minh bạn không phải là robot!';
      this.openDialog({ Text: mess, Title: 0 });
      return;
    }

    this.ngxSpinnerService.show();
    // localStorage.setItem('userid', 'Bao-LG');
    // localStorage.setItem('quyen_han', '0');
    // const user = localStorage.getItem('quyen_han');
    // if (user === '1') {
    //   this.router.navigate(['\manager'], {
    //     fragment: 'sessionId=%23HRAf4w184VVBAS9#x45w24g7a47vADaJNGHAGVA545RQ1ZXVAJI14'
    //   });
    // } else {
    //   this.router.navigate(['\customer'], {
    //     fragment: 'sessionId=%23HRAf4w184VVBAS9#x45w24g7a47vADaJNGHAGVA545RQ1ZXVAJI14',
    //     skipLocationChange: true
    //   });
    // }

    this.employeeService.login<any>({ email: Email.value, password: Pass.value }).subscribe(
      result => {
        this.ngxSpinnerService.hide();
        if (result.auth) {
          localStorage.setItem('access-token', result.access_token);
          localStorage.setItem('email', result.user.email);
          localStorage.setItem('full_name', result.user.full_name);
          localStorage.setItem('permission', result.user.permission.toString());
          localStorage.setItem('refresh-token', result.refresh_token);
          if (result.user.permission.toString() === '1') {
            this.router.navigate(['/manager'], { replaceUrl: true });
          } else {
            this.router.navigate(['/customer'], { replaceUrl: true });
          }
        } else {
          this.openDialog({ Text: 'Email hoặc mật khẩu đang bị sai!', Title: 0 });
        }
      },
      error => {
        this.ngxSpinnerService.hide();
        this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
      }
    );

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
