import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-debt-reminder-management',
  templateUrl: './debt-reminder-management.component.html',
  styleUrls: ['./debt-reminder-management.component.scss']
})
export class DebtReminderManagementComponent implements OnInit {

  public isCollapsed: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  public makebyme: FormGroup;
  public orther: FormGroup;
  listdebit: any[];

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.makebyme = this.formBuilder.group({
      account_number_debit: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
    this.orther = this.formBuilder.group({
      account_number_debit: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.isCollapsed = true;
    this.multiCollapsed1 = true;
    this.multiCollapsed2 = true;
    this.listdebit = [];
    this.getDetail();
  }

  getDetail() {
    this.Get_Detail_Debit('182536813595', '1').subscribe(
      () => {
        // ket qua tra ve o day
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Get_Detail_Debit('182536813595', '1').subscribe(
                  () => {
                    // ket qua tra ve o day
                  },
                  errors => {
                    // he thong co ve bi loi do db cu chuoi
                  });
              } else {
                // tai day thi tro ve page login lun ket thuc phien lam viec vi het thoi gian token
              }
            }
          );
        } else {
          // he thong co ve bi loi do db cu chuoi
        }
      }
    );
  }

  addDebit() {
    this.Add_Debit('556664697916', 'thieu tien thi tra dung de doi').subscribe(
      () => {
        // ket qua tra ve o day
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Add_Debit('556664697916', 'thieu tien thi tra dung de doi').subscribe(
                  () => {
                    // ket qua tra ve o day
                  },
                  errors => {
                    // he thong co ve bi loi do db cu chuoi
                  });
              } else {
                // tai day thi tro ve page login lun ket thuc phien lam viec vi het thoi gian token
              }
            }
          );
        } else {
          // he thong co ve bi loi do db cu chuoi
        }
      }
    );
  }

  deleteDebit() {
    this.Delete_Debit('182536813595').subscribe(
      () => {
        // ket qua tra ve o day
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Delete_Debit('182536813595').subscribe(
                  () => {
                    // ket qua tra ve o day
                  },
                  errors => {
                    // he thong co ve bi loi do db cu chuoi
                  });
              } else {
                // tai day thi tro ve page login lun ket thuc phien lam viec vi het thoi gian token
              }
            }
          );
        } else {
          // he thong co ve bi loi do db cu chuoi
        }
      }
    );
  }

  // opt = 1 la lay danh ghi no
  // opt <> 1 la danh sach other
  private Get_Detail_Debit(account, opt): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.userService.getindebit(account, opt).subscribe(
        result => {
          if (result instanceof Array) {
            result.forEach(element => {
              this.listdebit.push({
                account_number: element.account_number,
                account_number_debit: element.account_number_debit,
                message: element.message,
                seen: element.seen
              });
            });
            observer.next(true); // tra ve danh sach
          } else {
            this.listdebit = [];
            observer.next(false); // tra ve danh sach rong
          }
          observer.complete();
        },
        error => {
          observer.error(error); // loi
          observer.complete();
        }
      );
    });
  }


  private Add_Debit(account, mess): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.userService.addindebit({
        account_number: localStorage.getItem('USER_ifo'),
        account_number_debit: account,
        message: mess
      }).subscribe(
        result => {
          if (result) {
            observer.next(true); // tra ve thanh cong
            observer.complete();
          }
        },
        error => {
          observer.next(false); // co loi tra ve  khong thanh cong
          observer.complete();
        }
      );
    });
  }

  private Delete_Debit(accountdebit): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.userService.deleteindebit(
        localStorage.getItem('USER_ifo'),
        accountdebit  // tai khoan bi nhac no
      ).subscribe(
        result => {
          if (result) {
            observer.next(true); // tra ve thanh cong
            observer.complete();
          }
        },
        error => {
          observer.next(false); // co loi tra ve  khong thanh cong
          observer.complete();
        }
      );
    });
  }

  private Renew_Token(): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.userService.renewToken<any>().subscribe(
        result => {
          localStorage.setItem('TOKEN', result.access_token);
          observer.next(true);
          observer.complete();
        },
        error => {
          observer.next(false);
          observer.complete();
        }
      );
    });
  }

}
