import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../../../../theme/shared/shared.module';
import { InternalTransferRoutingModule } from './internal-transfer-routing.module';
import { InternalTransferComponent } from './internal-transfer.component';

@NgModule({
  declarations: [InternalTransferComponent],
  imports: [
    CommonModule,
    InternalTransferRoutingModule,
    SharedModule,
  ]
})
export class InternalTransferModule { }
