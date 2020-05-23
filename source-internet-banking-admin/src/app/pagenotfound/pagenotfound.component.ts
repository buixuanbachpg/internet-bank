import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  gotoHomePage() {
    if (localStorage.getItem('permission') === '1') {
      this.router.navigate(['/manager'], { replaceUrl: true });
    } else if (localStorage.getItem('permission') === '0') {
      this.router.navigate(['/customer'], { replaceUrl: true });
    } else {
      this.router.navigate([''], { replaceUrl: true });
    }
  }

}
