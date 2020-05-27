import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/api/user.service';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UiModalComponent } from 'src/app/theme/shared/components/modal/ui-modal/ui-modal.component';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss']
})
export class AccountInformationComponent implements OnInit {
  public userIfo: any;
  UserInfoForm: FormGroup;

  @ViewChild ("gridSystemModal") gridSystemModal: UiModalComponent;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {

    this.UserInfoForm = this.formBuilder.group({
      account_number: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required]],
      full_name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      username: ['', [Validators.required]],
      status: [1],
    });

    this.userService.getUserByAccNumber(JSON.parse(localStorage.getItem('USER_ifo')).account_number).subscribe(res => {
      if (res) {
        const user = {
          username: res[0].username,
          account_number: res[0].account_number,
          account_balance: res[0].account_balance,
          full_name: res[0].full_name,
          email: res[0].email,
          phone: res[0].phone,
          sex: res[0].sex,
          address: res[0].address,
        }
        localStorage.setItem('USER_ifo', JSON.stringify(user));
      }
    },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.userService.getUserByAccNumber(JSON.parse(localStorage.getItem('USER_ifo')).account_number).subscribe(res2 => {
                  if (res2) {
                    const user = {
                      username: res2[0].username,
                      account_number: res2[0].account_number,
                      account_balance: res2[0].account_balance,
                      full_name: res2[0].full_name,
                      email: res2[0].email,
                      phone: res2[0].phone,
                      sex: res2[0].sex,
                      address: res2[0].address
                    }
                    localStorage.setItem('USER_ifo', JSON.stringify(user));
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
    this.userIfo = JSON.parse(localStorage.getItem('USER_ifo'));
  }

  ngOnInit() {
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

  showInfo() {
    this.UserInfoForm.controls['username'].setValue(this.userIfo.username);
    this.UserInfoForm.controls['account_number'].setValue(this.userIfo.account_number);
    this.UserInfoForm.controls['full_name'].setValue(this.userIfo.full_name);
    this.UserInfoForm.controls['email'].setValue(this.userIfo.email);
    this.UserInfoForm.controls['phone'].setValue(this.userIfo.phone);
    this.UserInfoForm.controls['address'].setValue(this.userIfo.address);
    const val = this.userIfo.sex == 'nu'? 1:0;
    this.UserInfoForm.controls['sex'].setValue(val);
    this.gridSystemModal.show()
  }

  updateUser() {
    const gt = this.UserInfoForm.controls['sex'].value == 1?'nu':'nam';
    this.UserInfoForm.controls['sex'].setValue(gt);
    this.updateInfo(this.UserInfoForm.value).subscribe(
      (res) => {
        if(res){
          if(this.UserInfoForm.controls['status'].value == 0) {
            this.router.navigateByUrl("/auth/signin");
            localStorage.clear();
          } else if(confirm("Update successful")){
            this.gridSystemModal.hide();
          }
        } else {
          alert("Update error. Please try again.");
        }
      },
      error => {
        if (error.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.updateInfo(this.UserInfoForm.value).subscribe(
                  (res) => {
                    if(res){
                      if(confirm("Update successful")){
                        this.gridSystemModal.hide();
                      }
                    } else {
                      alert("Update error. Please try again.");
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

  updateInfo(data) {
    return Observable.create((observer: Observer<boolean>) => {
      this.userService.updateUserInfo(data).subscribe(
        result => {
          console.log(result);
          
          if (result) {
            observer.next(true); // tra ve thanh cong
            observer.complete();
          }
        },
        error => {
          console.log(error);
          
          observer.next(false); // co loi tra ve  khong thanh cong
          observer.complete();
        }
      );
    });
  }

  blockUser() {
    if(confirm("Are you sure to close yours account?")) {
      this.UserInfoForm.controls['status'].setValue(0);
      this.updateUser();
    }
  }

}
