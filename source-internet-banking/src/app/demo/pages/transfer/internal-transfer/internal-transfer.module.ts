import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../../../../theme/shared/shared.module';
import { InternalTransferRoutingModule } from './internal-transfer-routing.module';
import { InternalTransferComponent } from './internal-transfer.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [InternalTransferComponent],
  imports: [
    CommonModule,
    InternalTransferRoutingModule,
    SharedModule,
    NgbDropdownModule
  ]
})
export class InternalTransferModule { }
