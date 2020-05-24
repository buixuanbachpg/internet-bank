import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionhistoryComponent } from './transaction-history.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionhistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionhistoryRoutingModule { }
