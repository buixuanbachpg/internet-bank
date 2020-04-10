import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipientListComponent } from './recipient-list.component';

const routes: Routes = [
  {
    path: '',
    component: RecipientListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipientListRoutingModule { }
