import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';
import { UiModalComponent } from 'src/app/theme/shared/components/modal/ui-modal/ui-modal.component';

@Component({
  selector: 'app-debt-reminder-management',
  templateUrl: './debt-reminder-management.component.html',
  styleUrls: ['./debt-reminder-management.component.scss']
})
export class DebtReminderManagementComponent implements OnInit {

  public isCollapsed: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  @ViewChild ('gridSystemModal') gridSystemModal : UiModalComponent;

  public user_info;
  public makebyme: FormGroup;
  public orther: FormGroup;
  listdebit: any[];
  public opt = 1

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.makebyme = this.formBuilder.group({
      account_number_debit: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
    this.orther = this.formBuilder.group({
      account_number_debit: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });

    this.user_info = JSON.parse(localStorage.getItem('USER_ifo'));
  }

  ngOnInit() {
    this.isCollapsed = true;
    this.multiCollapsed1 = true;
    this.multiCollapsed2 = true;
    this.listdebit = [];
    this.getDetail();
  }

  getDetail() {
    this.Get_Detail_Debit(this.user_info.account_number, this.opt).subscribe(
      (res) => {
        if(res){
          if(this.opt === 1) {
            this.opt = 0;
          } else {
            this.opt = 1;
          }
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Get_Detail_Debit(this.user_info.account_number, this.opt).subscribe(
                  (res) => {
                    if(res){
                      if(this.opt === 1) {
                        this.opt = 0;
                      } else {
                        this.opt = 1;
                      }
                    }
                  },
                  errors => {
                    // he thong co ve bi loi do db cu chuoi
                  });
              } else {
                this.router.navigateByUrl("/auth/signin");
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
    const data = {
      account_number_debit: this.makebyme.controls['account_number_debit'].value,
      message: this.makebyme.controls['message'].value
    }
    this.Add_Debit(data).subscribe(
      (res) => {
        console.log(res);
        if(res){
          this.makebyme.reset();
          this.getDetail();
          this.gridSystemModal.hide();
        } else {
          alert("Error. Please angain");
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Add_Debit(data).subscribe(
                  (res) => {
                    console.log(res);
                    
                  },
                  errors => {
                    // he thong co ve bi loi do db cu chuoi
                  });
              } else {
                this.router.navigateByUrl("/auth/signin");
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


  private Add_Debit(data): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.userService.addindebit({
        account_number: this.user_info.account_number,
        account_number_debit: data.account_number_debit,
        message: data.message
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
