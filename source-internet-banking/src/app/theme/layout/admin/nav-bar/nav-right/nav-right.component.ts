import {Component, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserService } from 'src/app/api/user.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  public userInfo

  constructor(
    private router: Router,
    private userService: UserService
  ) { 
    this.userInfo = JSON.parse(localStorage.getItem('USER_ifo'));
  }

  ngOnInit() { }

  signout() {
    this.userService.logout(this.userInfo).subscribe(res => {
      if(res && res.msg) {
        this.router.navigateByUrl("/auth/signin");
        localStorage.clear();
      }
    });
  }
}
