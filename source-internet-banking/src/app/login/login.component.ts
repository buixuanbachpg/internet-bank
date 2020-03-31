import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup} from '@angular/forms';
import { ValidationService } from 'src/service/validation-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userForm: FormGroup;
  size = "Normal"
  
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required, ValidationService.passwordValidator, Validators.minLength(6), Validators.maxLength(20)]],
    });
   }

  ngOnInit() {
    
  }

  submit(){
    if (this.userForm.dirty && this.userForm.valid) {
      alert(
        `Name: ${this.userForm.value.name} Email: ${this.userForm.value.email}`
      );
    }
  }

}
