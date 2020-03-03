import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule, MatPaginatorModule } from '@angular/material/';
import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { EmployeemanagerComponent } from '../../pages/employeemanager/employeemanager.component';

// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    MatTableModule,
    MatPaginatorModule,
    ClipboardModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    EmployeemanagerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AdminLayoutModule {}
