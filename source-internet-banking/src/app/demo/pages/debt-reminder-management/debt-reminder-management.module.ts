import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtReminderManagementComponent } from './debt-reminder-management.component';
import {SharedModule} from '../../../theme/shared/shared.module';
import { DebtReminderManagementRoutingModule } from './debt-reminder-management-routing.module';
import { NgbCollapseModule, NgbAccordionModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [DebtReminderManagementComponent],
  imports: [
    CommonModule,
    DebtReminderManagementRoutingModule,
    SharedModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbTabsetModule
  ]
})
export class DebtReminderManagementModule { }
