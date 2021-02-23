import { AbstractControl, ValidatorFn } from '@angular/forms';

export function sameFields(field1: string, field2: string): ValidatorFn {
  return (group: AbstractControl): { [key: string]: any } | null => {
    const field1Value = group.get(field1)?.value;
    const field2Value = group.get(field2)?.value;
    return field1Value === field2Value ? null : { notSameFields: true };
  };
}
