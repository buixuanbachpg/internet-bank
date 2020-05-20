import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss']
})
export class AccountInformationComponent implements OnInit {
  public userIfo: any;

  constructor() {
    this.userIfo = JSON.parse(localStorage.getItem('USER_ifo'));
  }

  ngOnInit() {
  }

}
