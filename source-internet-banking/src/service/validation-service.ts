export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
      let config = {
        required: 'Required',
        invalidEmail: 'Invalid email',
        invalidPassword:
          'Invalid password. Password must be at least 6 characters long, and contain a number.',
        minlength: `Minimum length ${validatorValue.requiredLength}`,
        maxlength: `Maximum length ${validatorValue.requiredLength}`
      };
  
      return config[validatorName];
    }
  
    static emailValidator(control) {
      if (
        control.value.match(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
      ) {
        return null;
      } else {
        return { invalidEmail: true };
      }
    }
  
    static passwordValidator(control) {
      // {6,100}           - Assert password is between 6 and 100 characters
      // (?=.*[0-9])       - Assert a string has at least one number
      if (control.value) {
        return null;
      } else {
        return { invalidPassword: true };
      }
    }
  }