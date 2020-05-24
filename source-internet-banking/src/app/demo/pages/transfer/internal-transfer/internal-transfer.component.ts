import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { TransferService } from 'src/app/api/transfer.service';

@Component({
  selector: 'app-internal-transfer',
  templateUrl: './internal-transfer.component.html',
  styleUrls: ['./internal-transfer.component.scss']
})
export class InternalTransferComponent implements OnInit {
  intrabankForm: FormGroup;
  public user_info;
  public issendOTP = false
  public listRecipient = [];
  public isExist = true;
  
  constructor(
    private formBuilder: FormBuilder,
    protected userService: UserService,
    private transferService: TransferService
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
    });
  }

  ngOnInit() {
  }

  continue() {
    this.transferService.sendOTP(this.user_info.email).subscribe(
      res => {
      if(res) {
        this.issendOTP = true;
      }
    },
    err => {
      alert("Error. Please again!!")
    });
  }

  submitTransfer() {
    const otp = $("#otp").val();
    console.log('otp', otp);

    const data = {
      username: this.user_info.username,
      to_account_number: this.intrabankForm.controls['beneficiaryAccount'].value,
      amount: this.intrabankForm.controls['currency'].value,
      message: this.intrabankForm.controls['transactionDetail'].value,
      pay_debit: 0,
      email: this.user_info.email
    }
    
    this.transferService.transferInternal(data,otp).subscribe(res => {
      console.log(res);
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
        if(res && !res.insertId) {
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
        alert('Error. Please create again!!');
      }
    );
  }

  focusoutAccNumber(evt){
    this.userService.getUserByAccNumber(this.intrabankForm.controls['beneficiaryAccount'].value).subscribe(res => {
      if (res) {
        this.intrabankForm.controls['accountname'].setValue(res[0].full_name);
        this.isExist = !this.isExist;
      } else {
        this.isExist = !this.isExist;
        this.intrabankForm.controls['accountname'].setValue('');
      }
    });
  }
}
