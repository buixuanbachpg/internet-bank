import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/api/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UiModalComponent } from 'src/app/theme/shared/components/modal/ui-modal/ui-modal.component';

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
  public listRecipient : [];

  @ViewChild ('gridSystemModalupdate') gridSystemModalupdate : UiModalComponent;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.receiveForm = this.formBuilder.group({
      account_number_rev: ['', [Validators.required]],
      full_name: ['', [Validators.required]]
    });
    this.receiveFormUpdate = this.formBuilder.group({
      account_number_rev: ['', [Validators.required]],
      full_name: ['', [Validators.required]]
    });
    this.account_number = JSON.parse(localStorage.getItem("USER_ifo")).account_number;
    this.userService.getRecipient(this.account_number).subscribe(res => {
      console.log('res', res)
      this.listRecipient = res;
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
        if(res && !res.insertId) {
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
        alert('Error. Please create again!!');
      }
    );
  }

  focusoutAccNumber(evt){
    this.userService.getUserByAccNumber(this.receiveForm.controls['account_number_rev'].value).subscribe(res => {
      if (res) {
        this.receiveForm.controls['full_name'].setValue(res[0].full_name);
        this.isExist = true;
      } else {
        this.isExist = false;
        this.receiveForm.controls['full_name'].setValue('');
      }
    });
  }

  deleteDetail(item) {
    this.userService.deleteRecipient(item.account_number, item.account_number_receive).subscribe(
      res => {
        if(res.affectedRows === 1) {
          this.listRecipient.splice(this.listRecipient.indexOf(item), 1)
        }
      },
      err => {
        alert('Error. Please delete again!!');
      }
    );
  }

  chooseItemEdit(item){
    this.receiveFormUpdate.controls['account_number_rev'].setValue(item.account_number_receive);
    this.receiveFormUpdate.controls['full_name'].setValue(item.name_reminiscent);
    this.gridSystemModalupdate.show();
  }

  updateRecipient() {
    const data = {
      account_number_receive: this.receiveFormUpdate.controls['account_number_rev'].value,
      name_reminiscent: this.receiveFormUpdate.controls['full_name'].value
    }
    this.userService.updateRecipient(data, this.account_number).subscribe(
      res => {
        if(res && res.changedRows === 1) {
          if (confirm('Update successful!!')) {
            $('#closeBTNupdate').click();
          }
          this.listRecipient.forEach(item => {
            if(item.account_number_receive === this.receiveFormUpdate.controls['account_number_rev'].value) {
              item.name_reminiscent =  this.receiveFormUpdate.controls['full_name'].value;
              return;
            }
          })
          this.receiveForm.controls['account_number_rev'].setValue('');
          this.receiveForm.controls['full_name'].setValue('');
        }
      },
      err => {

      }
    );
  }
}
