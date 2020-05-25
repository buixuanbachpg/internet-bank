import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/api/user.service';
import { Observer, Observable } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
  providers: [
    CurrencyPipe,
    DatePipe
  ]
})
export class TransactionhistoryComponent implements OnInit {
  public userIfo: any;
  dataReceive: any[];
  dataTransfer: any[];
  dataDebit: any[];
  islogout = false;

  constructor(
    private userService: UserService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.userIfo = JSON.parse(localStorage.getItem('USER_ifo'));
  }

  ngOnInit() {
    this.dataReceive = [];
    this.dataTransfer = [];
    this.dataDebit = [];
    this.getReceive();
    this.getTransfer();
    this.getDebit();
  }

  getReceive() {
    this.Get_Detail_Receive(this.userIfo.account_number).subscribe(
      result => {
        console.log(result);
        
        this.dataReceive = [];
        const array = [];
        result.local.forEach(data => {
          array.push({
            to_account_number: data.to_account_number,
            amount: `+${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
            from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
            message: data.message,
            time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
          });
        });

        result.global.forEach(data => {
          array.push({
            to_account_number: data.to_account_number,
            amount: `+${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
            from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
            message: data.message,
            time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
          });
        });
        this.dataReceive = array.sort((a, b) => a.time > b.time ? 1 : -1);
        if (this.dataReceive.length === 0) {
          // khong co du lieu nhan tien
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Get_Detail_Receive(this.userIfo.account_number).subscribe(
                  result2 => {
                    this.dataReceive = [];
                    const array = [];
                    result2.local.forEach(data => {
                      array.push({
                        to_account_number: data.to_account_number,
                        amount: `+${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                        from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                        message: data.message,
                        time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                      });
                    });

                    result2.global.forEach(data => {
                      array.push({
                        to_account_number: data.to_account_number,
                        amount: `+${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                        from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                        message: data.message,
                        time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                      });
                    });
                    this.dataReceive = array.sort((a, b) => a.time > b.time ? 1 : -1);
                    if (this.dataReceive.length === 0) {
                      // khong co du lieu giao dich nhan tien
                    }
                  },
                  errors => {
                    // he thong co ve bi loi do db cu chuoi
                  });
              } else {
                
              }
            }
          );
        } else {
          // he thong co ve bi loi do db cu chuoi
        }
      }
    );
  }

  getTransfer() {
    this.Get_Detail_Transfer(this.userIfo.account_number).subscribe(
      result => {
        console.log(result);
        this.dataTransfer = [];
        result.local.forEach(data => {
          this.dataTransfer.push({
            to_account_number: data.to_account_number,
            amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
            from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
            message: data.message,
            time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
          });
        });

        result.global.forEach(data => {
          this.dataTransfer.push({
            to_account_number: data.to_account_number,
            amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
            from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
            message: data.message,
            time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
          });
        });
        this.dataTransfer = this.dataTransfer.sort((a, b) => a.time > b.time ? 1 : -1);
        if (this.dataTransfer.length === 0) {
          // khong co du lieu giao dich chuyen khoan
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Get_Detail_Transfer(this.userIfo.account_number).subscribe(
                  result2 => {
                    this.dataTransfer = [];
                    result2.local.forEach(data => {
                      this.dataTransfer.push({
                        to_account_number: data.to_account_number,
                        amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                        from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                        message: data.message,
                        time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                      });
                    });

                    result2.global.forEach(data => {
                      this.dataTransfer.push({
                        to_account_number: data.to_account_number,
                        amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                        from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                        message: data.message,
                        time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                      });
                    });
                    this.dataTransfer = this.dataTransfer.sort((a, b) => a.time > b.time ? 1 : -1);
                    if (this.dataTransfer.length === 0) {
                      // khong co du lieu giao dich chuyen khoan
                    }
                  },
                  errors => {
                    // he thong co ve bi loi do db cu chuoi
                  });
              } else {
      
              }
            }
          );
        } else {
          // he thong co ve bi loi do db cu chuoi
        }
      }
    );
  }

  getDebit() {
    this.Get_Detail_Debit(this.userIfo.account_number).subscribe(
      result => {
        this.dataDebit = [];
        result.forEach(data => {
          this.dataDebit.push({
            to_account_number: data.to_account_number,
            amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
            from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
            message: data.message,
            time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
          });
        });
        this.dataDebit = this.dataDebit.sort((a, b) => a.time > b.time ? 1 : -1);
        if (this.dataDebit.length === 0) {
          // Khong co du lieu ve giao dich nhac no
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.Get_Detail_Debit(this.userIfo.account_number).subscribe(
                  result2 => {
                    this.dataDebit = [];
                    result2.forEach(data => {
                      this.dataDebit.push({
                        to_account_number: data.to_account_number,
                        amount: `-${this.currencyPipe.transform(data.amount, 'VND').substr(1)}`,
                        from_account_number: data.from_account_number === '0000' ? 'BBD Bank' : data.from_account_number,
                        message: data.message,
                        time: this.datePipe.transform(data.time, 'dd/MM/yyyy hh:mm a'),
                      });
                    });
                    this.dataDebit = this.dataDebit.sort((a, b) => a.time > b.time ? 1 : -1);
                    if (this.dataDebit.length === 0) {
                      // Khong co du lieu ve giao dich nhac no
                    }
                  },
                  errors => {
                    // he thong co ve bi loi do db cu chuoi
                  });
              } else {
                
              }
            }
          );
        } else {
          // he thong co ve bi loi do db cu chuoi
        }
      }
    );
  }

  private Get_Detail_Receive(id): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.userService.getHistoryReceive(id).subscribe(
        result => {
          if (result) {
            observer.next(result);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  private Get_Detail_Transfer(id): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.userService.getHistoryTransfer(id).subscribe(
        result => {
          if (result) {
            observer.next(result);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  private Get_Detail_Debit(id): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.userService.getHistoryDebit(id).subscribe(
        result => {
          if (result) {
            observer.next(result);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        },
        error => {
          observer.error(error);
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
          if(confirm('Session has been expired. Please re-login.')){
            this.router.navigateByUrl("/auth/signin");
            localStorage.clear();
          }
          observer.complete();
        }
      );
    });
  }



}
