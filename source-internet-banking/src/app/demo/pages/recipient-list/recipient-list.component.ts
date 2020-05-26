import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/api/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UiModalComponent } from 'src/app/theme/shared/components/modal/ui-modal/ui-modal.component';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipient-list',
  templateUrl: './recipient-list.component.html',
  styleUrls: ['./recipient-list.component.scss']
})
export class RecipientListComponent implements OnInit {
  public account_number;
  public isExist = true;
  public receiveForm: FormGroup;
  public receiveFormUpdate: FormGroup;
  public listRecipient: [];

  @ViewChild('gridSystemModalupdate') gridSystemModalupdate: UiModalComponent;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.receiveForm = this.formBuilder.group({
      account_number_rev: ['', [Validators.required]],
      full_name: ['', [Validators.required]]
    });
    this.receiveFormUpdate = this.formBuilder.group({
      account_number_revUpdate: ['', [Validators.required]],
      full_nameUpdate: ['', [Validators.required]]
    });
    this.account_number = JSON.parse(localStorage.getItem("USER_ifo")).account_number;
    this.userService.getRecipient(this.account_number).subscribe(res => {
      this.listRecipient = JSON.parse(JSON.stringify(res));
    },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.userService.getRecipient(this.account_number).subscribe(res2 => {
                  this.listRecipient = JSON.parse(JSON.stringify(res2));
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

  ngOnInit() {
  }

  addRecipient() {
    const data = {
      account_number_receive: this.receiveForm.controls['account_number_rev'].value,
      name_reminiscent: this.receiveForm.controls['full_name'].value
    }

    this.userService.addRecipient(data, this.account_number).subscribe(
      res => {
        if (res && !res.insertId) {
          if (confirm(res.message)) {
            $('#closeBTN').click();
          }
          this.listRecipient.push({
            account_number: this.account_number,
            account_number_receive: this.receiveForm.controls['account_number_rev'].value,
            name_reminiscent: this.receiveForm.controls['full_name'].value
          });
          this.receiveForm.controls['account_number_rev'].setValue('');
          this.receiveForm.controls['full_name'].setValue('');
        } else {
          alert('Error. Please create again!!');
        }
      },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.userService.addRecipient(data, this.account_number).subscribe(
                  res2 => {
                    if (res2 && !res2.insertId) {
                      if (confirm(res2.message)) {
                        $('#closeBTN').click();
                      }
                      this.listRecipient.push({
                        account_number: this.account_number,
                        account_number_receive: this.receiveForm.controls['account_number_rev'].value,
                        name_reminiscent: this.receiveForm.controls['full_name'].value
                      });
                      this.receiveForm.controls['account_number_rev'].setValue('');
                      this.receiveForm.controls['full_name'].setValue('');
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
    this.userService.getUserByAccNumber(this.receiveForm.controls['account_number_rev'].value).subscribe(res => {
      if (res) {
        this.receiveForm.controls['full_name'].setValue(res[0].full_name);
        this.isExist = true;
      } else {
        this.isExist = false;
        this.receiveForm.controls['full_name'].setValue('');
      }
    },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.userService.getUserByAccNumber(this.receiveForm.controls['account_number_rev'].value).subscribe(res2 => {
                  if (res2) {
                    this.receiveForm.controls['full_name'].setValue(res2[0].full_name);
                    this.isExist = true;
                  } else {
                    this.isExist = false;
                    this.receiveForm.controls['full_name'].setValue('');
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

  deleteDetail(item) {
    this.userService.deleteRecipient(item.account_number, item.account_number_receive).subscribe(
      res => {
        if (res.affectedRows === 1) {
          this.listRecipient.splice(this.listRecipient.indexOf(item), 1)
        }
      },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.userService.deleteRecipient(item.account_number, item.account_number_receive).subscribe(
                  res2 => {
                    if (res2.affectedRows === 1) {
                      this.listRecipient.splice(this.listRecipient.indexOf(item), 1)
                    }
                  },
                  errs => {
                    alert('Error. Please delete again!!');
                  });
              } else {
                if(confirm('Session has been expired. Please re-login.')){
                  this.router.navigateByUrl("/auth/signin");
                  localStorage.clear();
                }
              }
            });
        } else {
          alert('Error. Please delete again!!');
        }
      }
    );
  }

  chooseItemEdit(item) {
    this.receiveFormUpdate.controls['account_number_revUpdate'].setValue(item.account_number_receive);
    this.receiveFormUpdate.controls['full_nameUpdate'].setValue(item.name_reminiscent);
    this.gridSystemModalupdate.show();
  }

  updateRecipient() {
    const data = {
      account_number_receive: this.receiveFormUpdate.controls['account_number_revUpdate'].value,
      name_reminiscent: this.receiveFormUpdate.controls['full_nameUpdate'].value
    }
    this.userService.updateRecipient(data, this.account_number).subscribe(
      res => {
        if (res && res.changedRows === 1) {
          if (confirm('Update successful!!')) {
            $('#closeBTNupdate').click();
          }
          this.listRecipient.forEach(item => {
            if (item.account_number_receive === this.receiveFormUpdate.controls['account_number_revUpdate'].value) {
              item.name_reminiscent = this.receiveFormUpdate.controls['full_nameUpdate'].value;
              return;
            }
          })
          this.receiveForm.controls['account_number_rev'].setValue('');
          this.receiveForm.controls['full_name'].setValue('');
        }
      },
      err => {
        if (err.status === 401) {
          this.Renew_Token().subscribe(
            result => {
              if (result) {
                this.userService.updateRecipient(data, this.account_number).subscribe(
                  res2 => {
                    if (res2 && res2.changedRows === 1) {
                      if (confirm('Update successful!!')) {
                        $('#closeBTNupdate').click();
                      }
                      this.listRecipient.forEach(item => {
                        if (item.account_number_receive === this.receiveFormUpdate.controls['account_number_revUpdate'].value) {
                          item.name_reminiscent = this.receiveFormUpdate.controls['full_nameUpdate'].value;
                          return;
                        }
                      })
                      this.receiveForm.controls['account_number_rev'].setValue('');
                      this.receiveForm.controls['full_name'].setValue('');
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
          alert('Error. Please create again!!');
        }
      }
    );
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
