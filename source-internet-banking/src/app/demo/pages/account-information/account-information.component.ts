import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/api/user.service';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss']
})
export class AccountInformationComponent implements OnInit {
  public userIfo: any;

  constructor(
    private userService: UserService,
    private router: Router,
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

}
