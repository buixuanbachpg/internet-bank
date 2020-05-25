import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionhistoryRoutingModule } from './transaction-history-routing.module';
import {SharedModule} from '../../../theme/shared/shared.module';
import { TransactionhistoryComponent } from './transaction-history.component';
import { NgbCollapseModule, NgbTabsetModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [TransactionhistoryComponent],
  imports: [
    CommonModule,
    TransactionhistoryRoutingModule,
    SharedModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbTabsetModule
  ]
})
export class TransactionhistoryModule { }
