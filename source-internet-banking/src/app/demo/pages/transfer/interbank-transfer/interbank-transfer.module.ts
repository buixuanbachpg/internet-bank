import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../../../../theme/shared/shared.module';
import { InterbankTransferComponent } from './interbank-transfer.component';
import { InterbankTransferRoutingModule } from './interbank-transfer-routing.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [InterbankTransferComponent],
  imports: [
    CommonModule,
    InterbankTransferRoutingModule,
    SharedModule,
    NgbDropdownModule
  ]
})
export class InterbankTransferModule { }
