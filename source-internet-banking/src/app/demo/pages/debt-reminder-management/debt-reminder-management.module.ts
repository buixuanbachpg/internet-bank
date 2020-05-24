import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtReminderManagementComponent } from './debt-reminder-management.component';
import {SharedModule} from '../../../theme/shared/shared.module';
import { DebtReminderManagementRoutingModule } from './debt-reminder-management-routing.module';
import { NgbCollapseModule, NgbAccordionModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
// import { ControlMessages } from '../control-messages/control-messages.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DebtReminderManagementComponent,
    // ControlMessages
  ],
  imports: [
    CommonModule,
    DebtReminderManagementRoutingModule,
    // FormsModule,
    // ReactiveFormsModule,
    SharedModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbTabsetModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DebtReminderManagementModule { }
