import { Pipe, PipeTransform } from '@angular/core';
import { FormArray } from '@angular/forms';

@Pipe({
  name: 'isChecked'
})
export class IsCheckedPipe implements PipeTransform {

  transform(id: string, control: FormArray): boolean {
    return !!control.controls.find(ctrl => ctrl.value === id);
  }

}
