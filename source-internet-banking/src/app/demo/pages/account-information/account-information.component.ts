import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/api/user.service';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss']
})
export class AccountInformationComponent implements OnInit {
  public userIfo: any;

  constructor(
    private userService: UserService
  ) {
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
          address: res[0].address
        }
        localStorage.setItem('USER_ifo', JSON.stringify(user));
      }
    });
    this.userIfo = JSON.parse(localStorage.getItem('USER_ifo'));
  }

  ngOnInit() {
  }

}
