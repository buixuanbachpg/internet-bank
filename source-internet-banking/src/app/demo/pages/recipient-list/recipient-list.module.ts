import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../../../theme/shared/shared.module';
import { RecipientListComponent } from './recipient-list.component';
import { RecipientListRoutingModule } from './recipient-list-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [RecipientListComponent],
  imports: [
    CommonModule,
    RecipientListRoutingModule,
    FormsModule,
    SharedModule,
  ]
})
export class RecipientListModule { }
