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
  @ViewChild ('gridSystemModalupdate') gridSystemModalupdate : UiModalComponent;


  public user_info;
  public makebyme: FormGroup;
  listdebit: any[];
  public opt = 1
  public isExist = true;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.makebyme = this.formBuilder.group({
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

  closeModal() {
    this.makebyme.reset();
    this.gridSystemModal.hide()
  }

  getDetail(event?) {
    
    if(event && event.nextId === 1) {
      this.opt = 0
    } else if (event && event.nextId === 0){
      this.opt = 1;
    }
    
    this.Get_Detail_Debit(this.user_info.account_number, this.opt).subscribe(
      (res) => {
        console.log(res);
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Get_Detail_Debit(this.user_info.account_number, this.opt).subscribe(
                  (res) => {
                    console.log(res);
                  },
                  errors => {
                    alert('Error. Please again!!');
                  });
              } else {
                if(confirm('Session has been expired. Please re-login.')){
                  this.router.navigateByUrl("/auth/signin");
                  localStorage.clear();
                }
              }
            }
          );
        } else {
          alert('Error. Please again!!');
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
                    if(res){
                      this.makebyme.reset();
                      this.getDetail();
                      this.gridSystemModal.hide();
                    } else {
                      alert("Error. Please angain");
                    }
                  },
                  errors => {
                    alert('Error. Please again!!');
                  });
              } else {
                if(confirm('Session has been expired. Please re-login.')){
                  this.router.navigateByUrl("/auth/signin");
                  localStorage.clear();
                }
              }
            }
          );
        } else {
          alert('Error. Please again!!');
        }
      }
    );
  }

  deleteDebit(item) {
    this.Delete_Debit(item.account_number_debit).subscribe(
      (res) => {
        if(res) {
          this.getDetail();
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Delete_Debit(item.account_number_debit).subscribe(
                  (res) => {
                    console.log(res);
                    // ket qua tra ve o day
                  },
                  errors => {
                    // he thong co ve bi loi do db cu chuoi
                  });
              } else {
                if(confirm('Session has been expired. Please re-login.')){
                  this.router.navigateByUrl("/auth/signin");
                  localStorage.clear();
                }
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
            this.listdebit = [];
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
        this.user_info.account_number,
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

  focusoutAccNumber(evt) {
    this.userService.getUserByAccNumber(this.makebyme.controls['account_number_debit'].value).subscribe(res => {
      if (res) {
        this.isExist = true;
      } else {
        this.isExist = false;
      }
    },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.userService.getUserByAccNumber(this.makebyme.controls['account_number_debit'].value).subscribe(res2 => {
                  if (res2) {
                    this.isExist = true;
                  } else {
                    this.isExist = false;
                  }
                },
                  errs => {
                    alert('Error. Please again!!');
                  });
              } else {
                if(confirm('Session has been expired. Please re-login.')){
                  this.router.navigateByUrl("/auth/signin");
                  localStorage.clear();
                }
              }
            });
        } else {
          alert('Error. Please again!!');
        }
      });
  }

}
