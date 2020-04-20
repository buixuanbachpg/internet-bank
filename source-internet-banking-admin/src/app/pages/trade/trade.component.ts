import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { MatDialog } from '@angular/material';
import { EmployeeService } from 'src/app/api/employee.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Msg } from 'src/app/variables/icommon';
import { DialogWarningComponent } from 'src/app/dialog-warning/dialog-warning.component';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {
  @ViewChild('name') private iName: ElementRef;
  @ViewChild('full_name') private iFullname: ElementRef;
  @ViewChild('sex') private iSex: ElementRef;
  @ViewChild('email') private iEmail: ElementRef;
  @ViewChild('phone') private iPhone: ElementRef;
  @ViewChild('address') private iAddress: ElementRef;
  @ViewChild('cash') private iCash: ElementRef;
  @ViewChild('btnIns') private btnIns: ElementRef;
  tradeForm: FormGroup;
  fullname_detail: string;
  sex_detail: string;
  email_detail: string;
  phone_detail: string;
  address_detail: string;
  cash_detail: string;
  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router
  ) {
    this.tradeForm = new FormGroup({
      'name': new FormControl('',
        [
          Validators.required,
          Validators.maxLength(45)
        ]),
      // 'fullname': new FormControl(''),
      // 'sex': new FormControl('Nam'),
      // 'email': new FormControl(''),
      // 'phone': new FormControl(''),
      // 'address': new FormControl(''),
      // 'cash': new FormControl('0')
    });
  }

  ngOnInit() {
    this.tradeForm.controls['fullname'].disable();
    this.fullname_detail = '';
    this.sex_detail = '';
    this.email_detail = '';
    this.phone_detail = '';
    this.address_detail = '';
    this.cash_detail = '0';
    this.iEmail.nativeElement.disabled = true;
    this.iPhone.nativeElement.disabled = true;
    this.iAddress.nativeElement.disabled = true;
    this.iCash.nativeElement.disabled = true;
    this.iFullname.nativeElement.disabled = true;
    this.iSex.nativeElement.disabled = true;
    this.btnIns.nativeElement.disabled = true;

  }

  onSubmit() {

  }

  onIns() {
    if (Number(this.tradeForm.get('cash').value) < 50000) {
      this.openDialog({ Text: 'Số tiền vui lòng lớn hơn 50.000₫', Title: 0 });
      return;
    }
  }

  private Check_User_Exists(value): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.Get_User_Id(value).subscribe(
        checkUser => {
          if (checkUser) {
            observer.next(true);
          } else {
            observer.next(false);
          }
          observer.complete();
        },
        error => {
          if (error.status === 401) {
            this.Renew_Token().subscribe(
              result => {
                if (result) {
                  this.Get_User_Id(value).subscribe(
                    checkUser => {
                      if (checkUser) {
                        observer.next(true);
                      } else {
                        observer.next(false);
                      }
                      observer.complete();
                    },
                    errors => {
                      this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
                      observer.complete();
                    });
                } else {
                  this.openDialog({ Text: 'Phiên làm việc đã kết thúc!', Title: 2 }).afterClosed()
                    .subscribe(
                      Prosc => {
                        this.router.navigateByUrl('', { replaceUrl: true });
                      }
                    );
                  observer.complete();
                }
              }
            );
          } else {
            this.openDialog({ Text: 'Hệ thống đang bị lỗi!', Title: 0 });
            observer.complete();
          }
        }
      );
    });
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

  private Get_User_Id(id): Observable<boolean> {
    this.ngxSpinnerService.show();
    return Observable.create((observer: Observer<boolean>) => {
      this.employeeService.getUser(id).subscribe(
        result => {
          this.ngxSpinnerService.hide();
          if (result) {
            observer.next(true);
            observer.complete();
          } else {
            observer.next(false);
            observer.complete();
          }
        },
        error => {
          this.ngxSpinnerService.hide();
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  private openDialog(mess: Msg) {
    const dialogRef = this.dialog.open(DialogWarningComponent, {
      width: '400px',
      hasBackdrop: true,
      data: mess
    });

    return dialogRef;
  }
}
