import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/api/user.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionhistoryComponent implements OnInit {
  public userIfo: any;

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit() {
  }

}
