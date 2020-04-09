import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthSigninRoutingModule } from './auth-signin-routing.module';
import { AuthSigninComponent } from './auth-signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlMessages } from '../../control-messages/control-messages.component';
import { RecaptchaModule, RecaptchaFormsModule, RECAPTCHA_LANGUAGE, RecaptchaSettings, RECAPTCHA_SETTINGS, RecaptchaLoaderService } from 'ng-recaptcha';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AuthSigninRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
  ],
  declarations: [
    AuthSigninComponent,
    ControlMessages
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // providers: [
  //   {
  //     provide: RECAPTCHA_SETTINGS,
  //     useValue: {
  //       siteKey: '6LcpOOcUAAAAAL9snZlJrREwndZbasst7Z1gqWjJ',
  //     } as RecaptchaSettings,
  //   }
  // ],
})
export class AuthSigninModule { }
