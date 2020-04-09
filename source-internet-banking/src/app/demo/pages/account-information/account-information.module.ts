import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountInformationRoutingModule } from './account-information-routing.module';
import { AccountInformationComponent } from './account-information.component';
import {SharedModule} from '../../../theme/shared/shared.module';


@NgModule({
  declarations: [AccountInformationComponent],
  imports: [
    CommonModule,
    AccountInformationRoutingModule,
    SharedModule
  ]
})
export class AccountInformationModule { }
