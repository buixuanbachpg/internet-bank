import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/service/validation-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  public userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required, ValidationService.passwordValidator, Validators.minLength(6), Validators.maxLength(20)]],
      // captcha: ['', [Validators.required]]
    });
   }

  ngOnInit() {
  }

  submit(){
    // console.log(window.grecaptcha.getResponse())
    // if (window.document.querySelector("#g-recaptcha-response")) {
      if (this.userForm.dirty && this.userForm.valid) {
       this.router.navigateByUrl("/dashboard/default");
      }
    // }
    // else{
    //   this.messageCaptcha = 'Please check reCaptcha to continue.';
    // }
  }

  test(key) {
    console.log(key);
  }
  
  
}
