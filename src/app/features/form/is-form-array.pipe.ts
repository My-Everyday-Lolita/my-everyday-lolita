import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

@Pipe({
  name: 'isFormArray'
})
export class IsFormArrayPipe implements PipeTransform {

  transform(control: AbstractControl): boolean {
    return control instanceof FormArray;
  }

}
