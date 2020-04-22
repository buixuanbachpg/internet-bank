import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';


import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { A11yModule } from '@angular/cdk/a11y';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    RecaptchaModule,
    NgbModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    A11yModule,
    RecaptchaFormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6Lc1INwUAAAAAA0ntCzOxL6-5Pw-NSUQrPkVzF95' } as RecaptchaSettings,
    }
  ]
})
export class AuthLayoutModule { }
