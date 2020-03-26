import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    localStorage.clear();
  }

}
