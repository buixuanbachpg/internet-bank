import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogWarningComponent } from '../../dialog-warning/dialog-warning.component';
import { MatDialog } from '@angular/material';
import { StaffService } from '../../api/staff.service';
import { Msg } from 'src/app/variables/icommon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;

  private resolvedRecaptcha: string;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private staffService: StaffService
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        ]
      ),
      password: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(45)
        ]
      )
    });
  }

  ngOnInit() {
    this.resolvedRecaptcha = '';
    localStorage.clear();
  }
  ngOnDestroy() {
  }

  resolved(captchaResponse: string) {
    this.resolvedRecaptcha = captchaResponse;
  }

  onSubmit() {
    const Email = this.formLogin.get('email');
    let mess = '';
    if (Email.errors) {
      mess = Email.errors.required
        ? 'Vui lòng không để trống email!'
        : 'Vui lòng nhập đúng kiểu email!';
      this.openDialog({ Text: mess, Title: 0 });
      return;
    }
    const Pass = this.formLogin.get('password');
    if (Pass.errors) {
      if (Pass.errors.minlength) {
        mess = 'Số ký tự không được dưới 2 ký tự!';
      } else if (Pass.errors.maxlength) {
        mess = 'Số ký tự không được vượt quá 45 ký tự!';
      } else {
        mess = 'Vui lòng không để trống mật khẩu!';
      }
      this.openDialog({ Text: mess, Title: 0 });
      return;

    }
    if (!this.resolvedRecaptcha) {
      mess = 'Hãy xác minh bạn không phải là robot!';
      this.openDialog({ Text: mess, Title: 0 });
      return;
    }
    localStorage.setItem('userid', 'Bao-LG');
    localStorage.setItem('quyen_han', '0');
    const user = localStorage.getItem('quyen_han');
    if (user === '1') {
      this.router.navigate(['\manager'], {
        fragment: 'sessionId=%23HRAf4w184VVBAS9#x45w24g7a47vADaJNGHAGVA545RQ1ZXVAJI14'
      });
    } else {
      this.router.navigate(['\customer'], {
        fragment: 'sessionId=%23HRAf4w184VVBAS9#x45w24g7a47vADaJNGHAGVA545RQ1ZXVAJI14',
        skipLocationChange: true
      });
    }

    // this.staffService.getAccountInfoStaff(Email.value).subscribe(
    //   result => {
    //     if (result && result.mat_khau === Pass.value) {
    //       this.router.navigate(['\dashboard'], {
    //         queryParams: { id: result.ten_tai_khoan, pass: result.mat_khau },
    //         fragment: 'sessionId=%23HRAf4w184VVBAS9#x45w24g7a47vADaJNGHAGVA545RQ1ZXVAJI14'
    //       });
    //     } else {
    //       mess = 'Mật khẩu hoặc email của bạn đã sai!';
    //       this.openDialog(mess);
    //     }
    //   },
    //   error => {
    //     mess = 'Hệ thống đang bị lỗi!';
    //     this.openDialog(mess);
    //   }
    // );

  }

  private openDialog(mess: Msg) {
    const dialogRef = this.dialog.open(DialogWarningComponent, {
      width: '350px',
      hasBackdrop: true,
      data: mess
    });
  }

}
