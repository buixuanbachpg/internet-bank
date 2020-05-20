import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/api/user.service';

@Component({
  selector: 'app-recipient-list',
  templateUrl: './recipient-list.component.html',
  styleUrls: ['./recipient-list.component.scss']
})
export class RecipientListComponent implements OnInit {
  public account_number;
  public listRecipient;

  constructor(
    private userService: UserService
  ) {
    this.account_number = JSON.parse(localStorage.getItem("USER_ifo")).account_number;
    this.userService.getRecipient(this.account_number).subscribe(res => {
      console.log('res', res)
      this.listRecipient = res;
    });
  }

  ngOnInit() {
  }

}
