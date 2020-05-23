import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';

@Component({
  selector: 'app-debt-reminder-management',
  templateUrl: './debt-reminder-management.component.html',
  styleUrls: ['./debt-reminder-management.component.scss']
})
export class DebtReminderManagementComponent implements OnInit {
  
  public isCollapsed: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  public makebyme: FormGroup;
  public orther: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.makebyme = this.formBuilder.group({
      account_number_debit: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
    this.orther = this.formBuilder.group({
      account_number_debit: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.isCollapsed = true;
    this.multiCollapsed1 = true;
    this.multiCollapsed2 = true;
  }

}
