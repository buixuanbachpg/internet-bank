import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import {
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatBadgeModule,
  MatSidenavModule,
  MatListModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatChipsModule,
  MatTooltipModule,
  MatTableModule,
  MatPaginatorModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatCheckboxModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { DialogWarningComponent } from './dialog-warning/dialog-warning.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { DialogEmployeeaddComponent } from './pages/dialog-employeeadd/dialog-employeeadd.component';
import { DialogEmployeeupdComponent } from './pages/dialog-employeeupd/dialog-employeeupd.component';
import { DialogDetailComponent } from './pages/dialog-detail/dialog-detail.component';
import { EmployeeService } from './api/employee.service';
import { UserService } from './api/user.service';
import { AdminService } from './api/admin.service';



@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatBadgeModule,
    MatListModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    RecaptchaModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatCheckboxModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    DialogWarningComponent,
    PagenotfoundComponent,
    DialogEmployeeaddComponent,
    DialogEmployeeupdComponent,
    DialogDetailComponent,
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatBadgeModule,
    MatListModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatChipsModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    NgxSpinnerModule,
    MatCheckboxModule
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false }
    },
    AdminService,
    EmployeeService,
    UserService
  ],
  entryComponents: [
    DialogWarningComponent,
    DialogEmployeeaddComponent,
    DialogEmployeeupdComponent,
    DialogDetailComponent,
    AppComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
