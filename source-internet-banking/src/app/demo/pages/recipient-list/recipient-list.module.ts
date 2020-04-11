import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../../../theme/shared/shared.module';
import { RecipientListComponent } from './recipient-list.component';
import { RecipientListRoutingModule } from './recipient-list-routing.module';


@NgModule({
  declarations: [RecipientListComponent],
  imports: [
    CommonModule,
    RecipientListRoutingModule,
    SharedModule
  ]
})
export class RecipientListModule { }
