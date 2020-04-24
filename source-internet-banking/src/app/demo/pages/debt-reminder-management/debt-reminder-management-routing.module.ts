import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebtReminderManagementComponent } from './debt-reminder-management.component';

const routes: Routes = [
  {
    path: '',
    component: DebtReminderManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebtReminderManagementRoutingModule { }
