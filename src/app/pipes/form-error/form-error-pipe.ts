import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'formError',
  pure: false,
})
export class FormErrorPipe implements PipeTransform {
  transform(control: AbstractControl, fieldName: string, ...args: unknown[]): string | null {
    if (!control.invalid) return null;

    const errors = control.errors;

    if (errors?.['required']) return `${fieldName} is required`;

    if (errors?.['email']) return `${fieldName} must be valid email`;

    if (errors?.['minlength'])
      return `${fieldName} must be atleast ${errors['minlength'].requiredLength} characters long`;

    return 'Some error';
  }
}
