import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthSigninRoutingModule } from './auth-signin-routing.module';
import { AuthSigninComponent } from './auth-signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RECAPTCHA_LANGUAGE, RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { ControlMessages } from '../../control-messages/control-messages.component';


@NgModule({
  imports: [
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
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LcpOOcUAAAAAL9snZlJrREwndZbasst7Z1gqWjJ',
      } as RecaptchaSettings,
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'en',
    },
  ],
})
export class AuthSigninModule { }
