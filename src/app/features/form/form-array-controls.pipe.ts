import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

@Pipe({
  name: 'formArrayControls'
})
export class FormArrayControlsPipe implements PipeTransform {

  transform(control: AbstractControl): AbstractControl[] {
    return control instanceof FormArray ? control.controls : [];
  }

}
