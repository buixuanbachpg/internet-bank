import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { TransferService } from 'src/app/api/transfer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  public user_info;
  public issendOTP = false
  public listRecipient = [];
  
  constructor(
    private formBuilder: FormBuilder,
    protected userService: UserService,
    private transferService: TransferService
  ) { 
    this.profileForm = this.formBuilder.group({
      account_number: ['', [Validators.required]],
      address: [''],
      email: [''],
      full_name: [''],
      phone: [''],
      sex: [1, [Validators.required]],
      username: ['', [Validators.required]]
    });

    this.user_info = JSON.parse(localStorage.getItem("USER_ifo"));

    this.profileForm.controls['account_number'].setValue(this.user_info.account_number);
    this.profileForm.controls['address'].setValue(this.user_info.address);
    this.profileForm.controls['email'].setValue(this.user_info.email);
    this.profileForm.controls['full_name'].setValue(this.user_info.full_name);
    this.profileForm.controls['phone'].setValue(this.user_info.phone);
    this.user_info.email === 'nu'
    ? this.profileForm.controls['sex'].setValue('1')
    :this.profileForm.controls['sex'].setValue(0);
    this.profileForm.controls['username'].setValue(this.user_info.username);
  }

  ngOnInit() {
  }

  changePassword() {
    this.transferService.sendOTP(this.user_info.email).subscribe(
      res => {
      if(res) {
        this.issendOTP = true;
      }
    },
    err => {
      alert("Error!!")
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
            account_number: this.account_number,
            account_number_receive: this.receiveForm.controls['account_number_rev'].value,
            name_reminiscent: this.receiveForm.controls['full_name'].value
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
}
