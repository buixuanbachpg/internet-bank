import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-debt-reminder-management',
  templateUrl: './debt-reminder-management.component.html',
  styleUrls: ['./debt-reminder-management.component.scss']
})
export class DebtReminderManagementComponent implements OnInit {
  
  public isCollapsed: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  constructor() {
  }

  ngOnInit() {
    this.isCollapsed = true;
    this.multiCollapsed1 = true;
    this.multiCollapsed2 = true;
  }

}
