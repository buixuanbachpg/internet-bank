import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from 'src/service/validation-service';
import { Store } from '@ngrx/store';
import * as appReducer from 'src/store/appStore.reducer';
import { UserService } from 'src/app/api/user.service';
import { TransferService } from 'src/app/api/transfer.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit, OnDestroy {
  public userForm: FormGroup;
  public resetForm: FormGroup;
  public messageErrCaptcha: string;
  public isInterval: number;
  public email:string;
  public issendOTP = false;
  public isReset = false;
  public isExist = true;
  public otp;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<appReducer.AppState>,
    protected userService: UserService,
    private transferService: TransferService
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      password: ['', [Validators.required, ValidationService.passwordValidator, Validators.minLength(6), Validators.maxLength(20)]]
    });

    this.resetForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      newpass: ['', [Validators.required]],
    });
   }

   
   ngOnInit() {
    //  this.isInterval = setInterval(() => {
    //    if(grecaptcha.getResponse()) {
    //      this.messageErrCaptcha = '';
    //     }
    //   });
    }
    
  ngOnDestroy(): void {
    // clearInterval(this.isInterval);
  }

  resolved(event) {
    this.messageErrCaptcha = '';
  }

  async submit(){
    if (grecaptcha.getResponse()) {
      if (this.userForm.dirty && this.userForm.valid) {
        const user = {
          username: this.userForm.controls['username'].value,
          password: this.userForm.controls['password'].value
        }
        this.userService.login(user).subscribe(res => {
          if (res && res.auth) {
            const user = {
              username: res.user.username,
              account_number: res.user.account_number,
              account_balance: res.user.account_balance,
              full_name: res.user.full_name,
              email: res.user.email,
              phone: res.user.phone,
              sex: res.user.sex,
              address: res.user.address
            }
            this.email = res.user.email;
            localStorage.setItem('USER_ifo', JSON.stringify(user));
            localStorage.setItem('RE_TOKEN', res.refresh_token);
            localStorage.setItem('TOKEN', res.access_token);
            this.router.navigateByUrl("/dashboard/default");
          } else {
            alert("Username or password incorrect!!!");
          }
        });
       }
     }
     else{
       this.messageErrCaptcha = 'Please check reCaptcha to continue.';
     }
  }

  getnamebyUsername() {
    const param = $("#usernameOtp").val();
    this.userService.getUserbyUsername(param).subscribe(res => {
      if(res && res.length === 1) {
        this.email = res[0].email;
        this.resetForm.controls['username'].setValue(res[0].username);
        this.transferService.sendOTP(this.email).subscribe(
        res => {
        if(res) {
          this.issendOTP = true;
        }
      },
      err => {
        alert("Error. Please again!!")
      });
        this.isExist = true;
      } else {
        this.isExist = false;
      }
    },
    err => {
      this.isExist = false;
    });
  }

  resetPass() {
    clearInterval(this.isInterval);
    this.issendOTP = true;
  }

  submitOTP() {
    this.otp =  $("#otp").val();
    this.isReset = true;
    this.issendOTP = false;
  }

  cancelBTN() {
    this.issendOTP = false;
    this.isReset = false;
  }

  submitResetPass() {
    const data = {
      username: this.resetForm.controls['username'].value,
      new_password: this.resetForm.controls['newpass'].value,
      email: this.email
    }
    this.userService.resetPassword(data,this.otp).subscribe(res => {
      if(res && res.message) {
        if(res.message == 'changed success' && confirm(res.message)) {
          this.issendOTP = false;
          this.isReset = false;
          this.isInterval = setInterval(() => {
            if(grecaptcha.getResponse()) {
              this.messageErrCaptcha = '';
             }
           });
        } else {
          alert(res.message + '. Please try again');
        }
      }
    },
    err => {
      alert('Error. Please try again');
    });
  }

}
