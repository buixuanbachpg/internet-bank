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


  }

  ngOnInit() {
  }

  continue() {
    const data = {
      username: 'danvu1997',
      to_account_number: '34325',
      amount: 1000,
      message: "asdasdas",
      pay_debit: ""
    }
    this.transferService.transfer(data).subscribe(res => {
      console.log(res);
      
    });
  }

}
