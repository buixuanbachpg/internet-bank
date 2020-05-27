import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { TransferService } from 'src/app/api/transfer.service';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interbank-transfer',
  templateUrl: './interbank-transfer.component.html',
  styleUrls: ['./interbank-transfer.component.scss']
})
export class InterbankTransferComponent implements OnInit {
  public user_info;
  public issendOTP = false;
  interbankForm: FormGroup;
  public isExist = true;

  constructor(
    private formBuilder: FormBuilder,
    protected userService: UserService,
    private transferService: TransferService,
    private router: Router,
  ) { 
    this.interbankForm = this.formBuilder.group({
      sourcebillingaccount: ['', [Validators.required]],
      beneficiaryAccount: ['', [Validators.required]],
      bank: ['', [Validators.required]],
      accountname: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      transactionDetail: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });

    this.user_info = JSON.parse(localStorage.getItem("USER_ifo"));
    this.interbankForm.controls['sourcebillingaccount'].setValue(this.user_info.account_number);
  }

  ngOnInit() {
  }

  cancelBTN() {
    this.issendOTP = false;
  }

  checkInfo() {
    const data = {
      bank: this.interbankForm.controls['bank'].value,
      account_number: this.interbankForm.controls['beneficiaryAccount'].value
    }
    this.userService.queryInfo(data).subscribe(res =>{
      if(res){
        this.isExist = true;
        if (this.interbankForm.controls['bank'].value == 'bkt.bank'){
          if(res.data) {
            this.interbankForm.controls['accountname'].setValue(res.data.full_name); 
            this.interbankForm.controls['email'].setValue(res.data.email);
          } else {
            alert(res.message);
            this.interbankForm.controls['accountname'].setValue(''); 
          }
        } else if (this.interbankForm.controls['bank'].value == 'ta.bank') {
          if(res.statusCode == 400) {
            alert(res.message);
            this.interbankForm.controls['accountname'].setValue(''); 
          } else {
            this.interbankForm.controls['accountname'].setValue(res.full_name); 
            this.interbankForm.controls['email'].setValue(res.email);
          }
        } else if (res.statusCode == 500) {
          alert(res.message);
          this.interbankForm.controls['accountname'].setValue(''); 
        }
      } else {
        this.isExist = false;
      }
    },
    err =>{
      if (err.status === 401) {
        this.Renew_Token().subscribe(
          result => {
            if (result) {
              this.userService.queryInfo(data).subscribe(res =>{
                if(res){
                  this.isExist = true;
                  if (this.interbankForm.controls['bank'].value == 'bkt.bank'){
                    if(res.data) {
                      this.interbankForm.controls['accountname'].setValue(res.data.full_name); 
                    } else {
                      alert(res.message);
                      this.interbankForm.controls['accountname'].setValue(''); 
                    }
                  } else if (this.interbankForm.controls['bank'].value == 'ta.bank') {
                    if(res.statusCode == 400) {
                      alert(res.message);
                      this.interbankForm.controls['accountname'].setValue(''); 
                    } else {
                      this.interbankForm.controls['accountname'].setValue(res.full_name); 
                    }
                  } else if (res.statusCode == 500) {
                    alert(res.message);
                    this.interbankForm.controls['accountname'].setValue(''); 
                  }
                } else {
                  this.isExist = false;
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

  submitTransfer() {
    const otp = $("#otp").val();
    const data = {
      from_account_number: this.user_info.account_number + "",
      to_account_number: this.interbankForm.controls['beneficiaryAccount'].value + "",
      amount: +this.interbankForm.controls['currency'].value,
      message: this.interbankForm.controls['transactionDetail'].value + "",
      pay_debit: 0,
      email: this.user_info.email + ""
    }

    const bank = this.interbankForm.controls['bank'].value;

    this.transferService.transferInterbank(data, bank, otp).subscribe(res => {
      if(confirm("Transfer successful.")){
        this.issendOTP = false;
        this.interbankForm.reset();
      }
    },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.transferService.transferInterbank(data,bank,otp).subscribe(res2 => {
                  if(confirm("Transfer successful.")){
                    this.issendOTP = false;
                    this.interbankForm.reset();
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

}
