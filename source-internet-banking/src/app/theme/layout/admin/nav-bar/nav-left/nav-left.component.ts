import { Component, OnInit } from '@angular/core';
import {NextConfig} from '../../../../../app-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit {
  public flatConfig: any;

  constructor(
    private router: Router
  ) {
    this.flatConfig = NextConfig.config;
  }

  ngOnInit() {
  }

  signout() {
    this.router.navigateByUrl("/auth/signin");
  }
}
