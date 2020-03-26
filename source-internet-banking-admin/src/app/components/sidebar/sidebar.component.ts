import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export let ROUTES: RouteInfo[] = []

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    ROUTES = localStorage.getItem('quyen_han') === '1' ? [
      { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
      { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '' },
      { path: '/maps', title: 'Maps', icon: 'ni-pin-3 text-orange', class: '' },
      { path: '/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '' },
      { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '' },
      { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '' },
      { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '' },
      { path: '/manager', title: 'Employee Manager', icon: 'ni-tv-2 text-primary', class: '' },
      { path: '/report', title: 'Trade Report', icon: 'ni-tv-2 text-primary', class: '' },
    ] : [
        { path: '/customer', title: 'Register Customer', icon: 'ni-tv-2 text-primary', class: '' },
        { path: '/trade', title: 'Trade', icon: 'ni-tv-2 text-primary', class: '' },
        { path: '/reviewtrade', title: 'Trade Review', icon: 'ni-tv-2 text-primary', class: '' },
      ];
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  logout() {
    this.router.navigate(['']);
  }

}
