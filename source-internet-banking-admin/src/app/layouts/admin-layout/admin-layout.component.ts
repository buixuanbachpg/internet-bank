import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  constructor(
    private router: Router
  ) { }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    history.go(1);
  }
  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.which === 2) {
      event.preventDefault();
      alert('Hệ thống bị gián đoạn!');
    }
  }


  ngOnInit() {
  }

}
