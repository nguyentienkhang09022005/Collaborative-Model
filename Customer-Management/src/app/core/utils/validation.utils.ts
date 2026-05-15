import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ValidationUtils {
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);
      return valid ? null : { email: true };
    };
  }

  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const phoneRegex = /^[0-9]{10,11}$/;
      const valid = phoneRegex.test(control.value.replace(/\D/g, ''));
      return valid ? null : { phone: true };
    };
  }

  static passwordStrengthValidator(minLength: number = 8): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value: string = control.value;
      const errors: ValidationErrors = {};

      if (value.length < minLength) {
        errors['minlength'] = { requiredLength: minLength, actualLength: value.length };
      }

      if (!/[A-Z]/.test(value)) {
        errors['uppercase'] = true;
      }

      if (!/[a-z]/.test(value)) {
        errors['lowercase'] = true;
      }

      if (!/[0-9]/.test(value)) {
        errors['number'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  static matchValues(matchControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !matchControl.value) return null;

      const isMatch = control.value === matchControl.value;
      return isMatch ? null : { mismatch: true };
    };
  }
}
