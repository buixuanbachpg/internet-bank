import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { TransferService } from 'src/app/api/transfer.service';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-internal-transfer',
  templateUrl: './internal-transfer.component.html',
  styleUrls: ['./internal-transfer.component.scss']
})
export class InternalTransferComponent implements OnInit {
  intrabankForm: FormGroup;
  public user_info;
  public issendOTP = false;
  public listRecipient = [];
  public isExist = true;

  constructor(
    private formBuilder: FormBuilder,
    protected userService: UserService,
    private transferService: TransferService,
    private router: Router,
  ) {
    this.intrabankForm = this.formBuilder.group({
      sourcebillingaccount: ['', [Validators.required]],
      beneficiaryAccount: ['', [Validators.required]],
      accountname: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      transactionDetail: ['', [Validators.required]]
    });

    this.user_info = JSON.parse(localStorage.getItem("USER_ifo"));
    this.intrabankForm.controls['sourcebillingaccount'].setValue(this.user_info.account_number);

    this.userService.getRecipient(this.user_info.account_number).subscribe(res => {
      this.listRecipient = JSON.parse(JSON.stringify(res));
    },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.userService.getRecipient(this.user_info.account_number).subscribe(res2 => {
                  this.listRecipient = JSON.parse(JSON.stringify(res2));
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

  ngOnInit() {
  }

  continue() {
    this.transferService.sendOTP(this.user_info.email).subscribe(
      res => {
        if (res) {
          this.issendOTP = true;
        }
      },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.transferService.sendOTP(this.user_info.email).subscribe(
                  res2 => {
                    if (res2) {
                      this.issendOTP = true;
                    }
                  },
                  errs => {
                    alert("Error. Please again!!")
                  }
                );
              } else {
                if(confirm('Session has been expired. Please re-login.')){
                  this.router.navigateByUrl("/auth/signin");
                  localStorage.clear();
                }
              }
            });
        } else {
          alert("Error. Please again!!")
        }
      });
  }

  cancelBTN() {
    this.issendOTP = false;
  }

  submitTransfer() {
    const otp = $("#otp").val();
    const data = {
      username: this.user_info.username,
      to_account_number: this.intrabankForm.controls['beneficiaryAccount'].value,
      amount: this.intrabankForm.controls['currency'].value,
      message: this.intrabankForm.controls['transactionDetail'].value,
      pay_debit: 0,
      email: this.user_info.email
    }

    this.transferService.transferInternal(data, otp).subscribe(res => {
      if(confirm(res.message)){
        this.issendOTP = false;
        this.intrabankForm.reset();
      }
    },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.transferService.transferInternal(data, otp).subscribe(res2 => {
                  if(confirm(res2.message)){
                    this.issendOTP = false;
                    this.intrabankForm.reset();
                  }
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

  chooseRecipient(item) {
    this.intrabankForm.controls['beneficiaryAccount'].setValue(item.account_number_receive);
    this.intrabankForm.controls['accountname'].setValue(item.name_reminiscent);
  }

  addRecipient() {
    const data = {
      account_number_receive: this.intrabankForm.controls['beneficiaryAccount'].value,
      name_reminiscent: this.intrabankForm.controls['accountname'].value
    }

    this.userService.addRecipient(data, this.user_info.account_number).subscribe(
      res => {
        if (res && !res.insertId) {
          if (confirm(res.message)) {
            $('#closeBTN').click();
          }
          this.listRecipient.push({
            account_number: this.user_info.account_number,
            account_number_receive: this.intrabankForm.controls['beneficiaryAccount'].value,
            name_reminiscent: this.intrabankForm.controls['accountname'].value
          });
        } else {
          alert('Error. Please create again!!');
        }
      },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.userService.addRecipient(data, this.user_info.account_number).subscribe(
                  res2 => {
                    if (res2 && !res2.insertId) {
                      if (confirm(res2.message)) {
                        $('#closeBTN').click();
                      }
                      this.listRecipient.push({
                        account_number: this.user_info.account_number,
                        account_number_receive: this.intrabankForm.controls['beneficiaryAccount'].value,
                        name_reminiscent: this.intrabankForm.controls['accountname'].value
                      });
                    } else {
                      alert('Error. Please create again!!');
                    }
                  },
                  errs => {
                    alert('Error. Please create again!!');
                  });
              } else {
                if(confirm('Session has been expired. Please re-login.')){
                  this.router.navigateByUrl("/auth/signin");
                  localStorage.clear();
                }
              }
            });
        } else {
          alert('Error. Please create again!!');
        }
      }
    );
  }

  focusoutAccNumber(evt) {
    this.userService.getUserByAccNumber(this.intrabankForm.controls['beneficiaryAccount'].value).subscribe(res => {
      if (res) {
        this.intrabankForm.controls['accountname'].setValue(res[0].full_name);
        this.isExist = !this.isExist;
      } else {
        this.isExist = !this.isExist;
        this.intrabankForm.controls['accountname'].setValue('');
      }
    },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.userService.getUserByAccNumber(this.intrabankForm.controls['beneficiaryAccount'].value).subscribe(res2 => {
                  if (res2) {
                    this.intrabankForm.controls['accountname'].setValue(res2[0].full_name);
                    this.isExist = !this.isExist;
                  } else {
                    this.isExist = !this.isExist;
                    this.intrabankForm.controls['accountname'].setValue('');
                  }
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
