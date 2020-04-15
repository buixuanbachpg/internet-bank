import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Employee, Msg } from 'src/app/variables/icommon';
import { DialogEmployeeupdComponent } from '../dialog-employeeupd/dialog-employeeupd.component';
import { DialogEmployeeaddComponent } from '../dialog-employeeadd/dialog-employeeadd.component';
import { AdminService } from 'src/app/api/admin.service';
import { Observable, Observer } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';
import { EmployeeService } from 'src/app/api/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employeemanager',
  templateUrl: './employeemanager.component.html',
  styleUrls: ['./employeemanager.component.scss']
})
export class EmployeemanagerComponent implements OnInit {

  private dataEmployee: Employee[] = [];
  displayedColumns: string[] = ['name', 'sex', 'email', 'phone', 'address', 'permission', 'update', 'delete'];
  dataSource = new MatTableDataSource<Employee>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private employeeService: EmployeeService,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    try {
      this.dataSource.paginator = this.paginator;
      this.F_Get_Data_Init();
    } catch (ex) {
      this.ngxSpinnerService.hide();
    }
  }

  openDialogUpdate(obj: Employee) {
    const dialogUpd = this.dialog.open(DialogEmployeeupdComponent, {
      width: '450px',
      height: '500px',
      data: obj,
      hasBackdrop: true,
    });

    dialogUpd.afterClosed().subscribe(
      Prosc => {
        this.F_Get_Data_Init();
      }
    );
  }

  openDialogInsert() {
    const dialogIns = this.dialog.open(DialogEmployeeaddComponent, {
      width: '450px',
      height: '500px',
      hasBackdrop: true,
    });

    dialogIns.afterClosed().subscribe(
      Prosc => {
        this.F_Get_Data_Init();
      }
    );
  }

  DeleteEmployee(element) {
    this.Delete_Employee(element.email).subscribe(
      delComplete => {
        if (delComplete) {
          this.openDialog({ Text: 'Xóa thành công!', Title: 1 }).afterClosed().subscribe(
            () => {
              this.F_Get_Data_Init();
            }
          );
        } else {
          this.openDialog({ Text: 'Xóa không thành công!', Title: 0 });
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Delete_Employee(element.email).subscribe(
                  delComplete2 => {
                    if (delComplete2) {
                      this.openDialog({ Text: 'Xóa thành công!', Title: 1 }).afterClosed().subscribe(
                        () => {
                          this.F_Get_Data_Init();
                        }
                      );
                    } else {
                      this.openDialog({ Text: 'Xóa không thành công!', Title: 0 });
                    }
                  },
                  errors => {
                    this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
                  });
              } else {
                this.openDialog({ Text: 'Phiên làm việc đã kết thúc!', Title: 2 }).afterClosed()
                  .subscribe(
                    Prosc => {
                      this.router.navigateByUrl('', { replaceUrl: true });
                    }
                  );
              }
            }
          );
        } else {
          this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
        }
      }
    );
  }

  private F_Get_Data_Init() {
    this.dataSource.data = [];
    this.Get_All_Employee().subscribe(
      () => { },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Get_All_Employee().subscribe(
                  () => { },
                  errors => {
                    this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
                  });
              } else {
                this.openDialog({ Text: 'Phiên làm việc đã kết thúc!', Title: 2 }).afterClosed()
                  .subscribe(
                    Prosc => {
                      this.router.navigateByUrl('', { replaceUrl: true });
                    }
                  );
              }
            }
          );
        } else {
          this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
        }
      }
    );
  }

  private openDialog(mess: Msg) {
    const dialogRef = this.dialog.open(DialogWarningComponent, {
      width: '400px',
      hasBackdrop: true,
      data: mess
    });

    return dialogRef;
  }

  private Renew_Token(): Observable<boolean> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<boolean>) => {
      this.employeeService.renew<any>().subscribe(
        result => {
          localStorage.setItem('access-token', result.access_token);
          this.ngxSpinnerService.hide();
          observer.next(true);
          observer.complete();
        },
        error => {
          this.ngxSpinnerService.hide();
          observer.next(false);
          observer.complete();
        }
      );
    });
  }

  private Get_All_Employee(): Observable<boolean> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<boolean>) => {
      this.adminService.getall<Employee[]>().subscribe(
        result => {
          if (result) {
            result.forEach(element => {
              this.dataEmployee.push({
                address: element.address,
                email: element.email,
                full_name: element.full_name,
                sex: element.sex,
                permission: element.permission.toString() === '1' ? 'Admin' : 'Giao dịch viên',
                phone: element.phone,
              });
            });
            this.dataSource.data = this.dataEmployee.sort((a, b) => a.full_name > b.full_name ? 1 : -1);
            observer.next(true);
            observer.complete();
          } else {
            observer.next(false);
            observer.complete();
          }
          this.ngxSpinnerService.hide();
        },
        error => {
          this.ngxSpinnerService.hide();
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  private Delete_Employee(id): Observable<boolean> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<boolean>) => {
      this.adminService.delete<any>(id).subscribe(
        result => {
          if (result.affectedRows === 1) {
            observer.next(true);
          } else {
            observer.next(false);
          }
          this.ngxSpinnerService.hide();
          observer.complete();
        },
        error => {
          this.ngxSpinnerService.hide();
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

}

