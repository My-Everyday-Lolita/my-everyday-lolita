import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Pipe({
  name: 'formArrayLength'
})
export class FormArrayLengthPipe implements PipeTransform {

  transform(control: AbstractControl): Observable<number> {
    return control.valueChanges.pipe(
      map(value => Array.isArray(value) ? value.length : 0),
      startWith(Array.isArray(control.value) ? control.value.length : 0)
    );
  }

}
