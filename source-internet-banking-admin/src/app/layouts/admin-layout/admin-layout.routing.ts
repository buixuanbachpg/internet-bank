import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { EmployeemanagerComponent } from '../../pages/employeemanager/employeemanager.component';
import { RegistercustomerComponent } from '../../pages/registercustomer/registercustomer.component';
import { TradereportComponent } from 'src/app/pages/tradereport/tradereport.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'manager', component: EmployeemanagerComponent },
    { path: 'report', component: TradereportComponent },
    { path: 'registercustomer', component: RegistercustomerComponent },



];
