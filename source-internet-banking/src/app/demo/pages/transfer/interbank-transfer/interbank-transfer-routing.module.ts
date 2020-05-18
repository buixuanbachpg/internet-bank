import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterbankTransferComponent } from './interbank-transfer.component';

const routes: Routes = [
  {
    path: '',
    component: InterbankTransferComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterbankTransferRoutingModule { }
