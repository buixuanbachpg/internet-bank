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
      transactionDetail: ['', [Validators.required]]
    });

    this.user_info = JSON.parse(localStorage.getItem("USER_ifo"));
    this.interbankForm.controls['sourcebillingaccount'].setValue(this.user_info.account_number);
  }

  ngOnInit() {
  }

  checkInfo() {
    const data = {
      bank: this.interbankForm.controls['bank'].value,
      account_number: this.interbankForm.controls['beneficiaryAccount'].value
    }
    this.userService.queryInfo(data).subscribe(res =>{
      if(res && res.messageCode === 'QUERY_ACCOUNT_SUCCESSFULLY'){
        this.interbankForm.controls['accountname'].setValue(res.data.full_name);  
      }
    },
    err =>{
      if (err.status === 401) {
        this.Renew_Token().subscribe(
          result => {
            if (result) {
              this.userService.queryInfo(data).subscribe(res =>{
                if(res && res.messageCode === 'QUERY_ACCOUNT_SUCCESSFULLY'){
                  this.interbankForm.controls['accountname'].setValue(res.data.full_name);  
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
