import { ValidatorFn, AbstractControl } from '@angular/forms';

export function cantBeZeroValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = control.value === 0;
    return forbidden ? {cantBeZeroError: true} : null
  }
}
