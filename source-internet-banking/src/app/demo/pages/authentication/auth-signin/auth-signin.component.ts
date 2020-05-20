import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from 'src/service/validation-service';
import { Store, select } from '@ngrx/store';
import * as appReducer from 'src/store/appStore.reducer';
import { login } from 'src/store/user/user.action';
import { UserService } from 'src/app/api/user.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  public userForm: FormGroup;
  public messageErrCaptcha: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<appReducer.AppState>,
    protected userService: UserService,
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      password: ['', [Validators.required, ValidationService.passwordValidator, Validators.minLength(6), Validators.maxLength(20)]]
    });
   }

   ngOnInit() {}

  async submit(){
    console.log("submit")
    if (grecaptcha.getResponse()) {
      console.log("submit2")
      if (this.userForm.dirty && this.userForm.valid) {
        console.log("submit3")
        const user = {
          username: this.userForm.controls['username'].value,
          password: this.userForm.controls['password'].value
        }
        this.userService.login(user).subscribe(res => {
          if (res && res.auth) {
            console.log("submit4")
            const user = {
              username: res.user.username,
              account_number: res.user.account_number,
              account_balance: res.user.account_balance,
              full_name: res.user.full_name,
              email: res.user.email
            }
            localStorage.setItem('USER_ifo', JSON.stringify(user));
            localStorage.setItem('TOKEN', JSON.stringify(res.access_token))
            this.router.navigateByUrl("/dashboard/default");
          } else {
            
          }
        });
      //   await this.store.dispatch(login({username: this.userForm.controls['username'].value, password: this.userForm.controls['password'].value}));
        
      //   console.log("111111")
      //   this.store.pipe(select('user')).subscribe(res => {
      //     if (res.data && res.data.auth) {
      //       this.router.navigateByUrl("/dashboard/default");
      //     } else {
            
      //     }
      //   })
       }
     }
     else{
       this.messageErrCaptcha = 'Please check reCaptcha to continue.';
     }
  }

}
