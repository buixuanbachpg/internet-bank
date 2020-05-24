import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionhistoryRoutingModule } from './transaction-history-routing.module';
import {SharedModule} from '../../../theme/shared/shared.module';
import { TransactionhistoryComponent } from './transaction-history.component';


@NgModule({
  declarations: [TransactionhistoryComponent],
  imports: [
    CommonModule,
    TransactionhistoryRoutingModule,
    SharedModule
  ]
})
export class TransactionhistoryModule { }
