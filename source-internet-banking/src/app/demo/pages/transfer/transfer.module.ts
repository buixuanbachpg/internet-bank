import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferRoutingModule } from './transfer-routing.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    TransferRoutingModule,
    SharedModule
  ]
})
export class TransferModule { }
