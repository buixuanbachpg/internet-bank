import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from 'src/service/validation-service';

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
    private router: Router
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
        this.router.navigateByUrl("/dashboard/default");
       }
     }
     else{
       this.messageErrCaptcha = 'Please check reCaptcha to continue.';
     }
  }

}
