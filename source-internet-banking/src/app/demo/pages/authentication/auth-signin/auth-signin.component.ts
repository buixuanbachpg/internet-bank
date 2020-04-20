import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from 'src/service/validation-service';
import { Store, select } from '@ngrx/store';
import * as appReducer from 'src/store/appStore.reducer';
import { homeArticles } from 'src/store/user/user.action';
import { userService } from 'src/store/user/user.service';

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
    protected userService: userService,
  ) {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required, ValidationService.passwordValidator, Validators.minLength(6), Validators.maxLength(20)]]
    });
   }

   ngOnInit() {}

  submit(){
    if (grecaptcha.getResponse()) {
      if (this.userForm.dirty && this.userForm.valid) {
        // this.store.pipe(select('article'))  .subscribe(res => {
        //   console.log(res);
          
        // });

        // this.store.dispatch(homeArticles({limit: 1, offset: 10}));
        this.userService.login().subscribe(res => {
          console.log(res);
          
        });
        this.router.navigateByUrl("/dashboard/default");
       }
     }
     else{
       this.messageErrCaptcha = 'Please check reCaptcha to continue.';
     }
  }

}
