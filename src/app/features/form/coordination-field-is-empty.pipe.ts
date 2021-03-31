import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Pipe({
  name: 'coordinationFieldIsEmpty'
})
export class CoordinationFieldIsEmptyPipe implements PipeTransform {

  transform(control: FormGroup): Observable<boolean> {
    return control.valueChanges.pipe(
      map(value => value.value === null || value.value.length === 0),
      startWith(control.value.value === null || control.value.value.length === 0)
    );
  }

}
