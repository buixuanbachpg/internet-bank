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
  changepassword: FormGroup;

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

    this.changepassword = this.formBuilder.group({
      username: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      old_password: ['', [Validators.required]]
    });
    this.user_info = JSON.parse(localStorage.getItem("USER_ifo"));

    this.changepassword.controls['username'].setValue(this.user_info.username);

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
    this.userService.changePassword(this.changepassword.value).subscribe(
      res => {
      if(res && res.changedRows === 1){
        alert(res.message);
      } else {
        alert(res.message);
      }
    },
    err => {
      alert("Error. Please again!!");
    })
  }

}
