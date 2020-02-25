import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin;

  private resolvedRecaptcha: string;
  constructor(
    private router: Router
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(
        '',
        Validators.required
      ),
      password: new FormControl(
        '',
        Validators.required
      )
    });
  }

  ngOnInit() {
    this.resolvedRecaptcha = '';
  }
  ngOnDestroy() {
  }

  resolved(captchaResponse: string) {
    this.resolvedRecaptcha = captchaResponse;
  }

  onSubmit() {
    this.router.navigate(['/dashboard']);
  }

}
