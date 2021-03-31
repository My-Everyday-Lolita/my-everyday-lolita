import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Pipe({
  name: 'coordinationFieldIsEmpty'
})
export class CoordinationFieldIsEmptyPipe implements PipeTransform {

  transform(control: FormGroup): Observable<boolean> {
    return control.valueChanges.pipe(
      map(value => (value.value === null || value.value.length === 0) && value.customText === ''),
      startWith((control.value.value === null || control.value.value.length === 0) && control.value.customText === '')
    );
  }

}
