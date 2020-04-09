import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from 'src/service/validation-service';

@Component({
  selector: 'control-messages',
  template: `
    <div style="color: red; text-center: left; font-size:10px;" *ngIf="errorMessage() !== null">{{errorMessage()}}</div>
  `
})
export class ControlMessages {
  error_message: string;
  @Input() control: FormControl;
  constructor() {}

  errorMessage() {
    for (let propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }

    return null;
  }
}