import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'internal',
        loadChildren: () => import('./internal-transfer/internal-transfer.module').then(module => module.InternalTransferModule)
      },
      {
        path: 'interbank',
        loadChildren: () => import('./interbank-transfer/interbank-transfer.module').then(module => module.InterbankTransferModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRoutingModule { }
