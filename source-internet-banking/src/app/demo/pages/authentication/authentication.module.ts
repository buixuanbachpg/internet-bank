import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    RecaptchaModule
  ],
  declarations: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LcpOOcUAAAAAL9snZlJrREwndZbasst7Z1gqWjJ',
      } as RecaptchaSettings,
    }
  ],
})
export class AuthenticationModule { }
